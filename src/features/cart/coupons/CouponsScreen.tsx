import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  RefreshControl
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';
import { Coupon } from '../../../types/coupon';
import { UserProfile } from '../../../types/user';
import Clipboard from '@react-native-clipboard/clipboard';

const CouponsScreen = () => {
  const { colors } = useTheme();
  const { user } = useAuth() as { user: UserProfile | null };
  const { state: cart, applyCoupon } = useCart();
  
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const now = new Date();
      
      console.log('Fetching coupons from Firestore...');
      const querySnapshot = await db.collection('coupons').where('isActive', '==', true).get();
      
      console.log(`Found ${querySnapshot.size} coupon documents`);

      const validCoupons = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          console.log('Coupon data:', doc.id, data);
          return {
            id: doc.id,
            ...data,
            validFrom: data.validFrom?.toDate ? data.validFrom.toDate() : data.validFrom,
            validTill: data.validTill?.toDate ? data.validTill.toDate() : (data.validUntil?.toDate ? data.validUntil.toDate() : data.validTill || data.validUntil)
          } as Coupon;
        })
        .filter(coupon => {
          // Log all date information for debugging
          console.log('Coupon date info:', {
            code: coupon.code,
            validFrom: coupon.validFrom,
            validTill: coupon.validTill,
            now: now,
            validFromType: typeof coupon.validFrom,
            validTillType: typeof coupon.validTill
          });
          
          // More permissive date validation
          const fromValid = !coupon.validFrom || 
            (coupon.validFrom instanceof Date ? coupon.validFrom <= now : true);
          const tillValid = !coupon.validTill || 
            (coupon.validTill instanceof Date ? coupon.validTill >= now : true);
          
          const isValid = fromValid && tillValid;
          console.log(`Coupon ${coupon.code} is ${isValid ? 'valid' : 'invalid'}`);
          return isValid;
        });

      console.log(`Found ${validCoupons.length} valid coupons`);
      setCoupons(validCoupons);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to load coupons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCoupons();
    setRefreshing(false);
  };

  const copyToClipboard = (code: string) => {
    Clipboard.setString(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const handleApplyCoupon = async (coupon: Coupon) => {
    try {
      const result = await applyCoupon(coupon);
      if (result.success) {
        Alert.alert('Success', 'Coupon applied successfully!');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to apply coupon');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const renderCouponItem = ({ item }: { item: Coupon }) => {
    const isCopied = copiedCoupon === item.code;
    
    // Format minimum order requirement
    const minOrderText = item.minOrderAmount 
      ? `Min. order: ₹${item.minOrderAmount}` 
      : item.minOrderCount 
        ? `Min. ${item.minOrderCount} items` 
        : '';
    
    // Format validity period
    const validityText = (item.validTill || item.validUntil)
      ? `Valid till: ${new Date(item.validTill || item.validUntil!).toLocaleDateString()}` 
      : '';
    
    // Format usage info
    const usageText = item.usageLimit?.perUserLimit
      ? `Limit: ${item.usageLimit.perUserLimit} per user`
      : item.maxUses
        ? `Total uses: ${item.usedCount || 0}/${item.maxUses}`
        : '';
    
    return (
      <View style={[styles.couponCard, { backgroundColor: colors.card }]}>
        <View style={styles.couponHeader}>
          <View style={styles.couponInfo}>
            <Text style={[styles.couponTitle, { color: colors.text }]} numberOfLines={1}>
              {item.title || item.name}
            </Text>
            <Text style={[styles.couponDescription, { color: colors.text }]}>
              {item.description || `Get ${item.discountValue || item.value}${(item.discountType || item.type) === 'percentage' ? '%' : ''} off on your order`}
            </Text>
            {minOrderText ? (
              <Text style={[styles.couponTerms, { color: colors.text }]}>
                {minOrderText}
              </Text>
            ) : null}
            {usageText ? (
              <Text style={[styles.couponTerms, { color: colors.text }]}>
                {usageText}
              </Text>
            ) : null}
          </View>
          <View style={styles.couponBadge}>
            <Text style={[styles.couponDiscount, { color: colors.primary }]}>
              {(item.discountType || item.type) === 'percentage' 
                ? `${item.discountValue || item.value}%` 
                : formatPrice(item.discountValue || item.value || 0)}
            </Text>
          </View>
        </View>
        
        <View style={styles.couponDetails}>
          <Text style={[styles.couponCodeText, { color: colors.text }]}>
            Code: <Text style={{ fontWeight: 'bold', color: colors.text }}>{item.code}</Text>
          </Text>
          {validityText ? (
            <Text style={[styles.couponExpiry, { color: colors.text }]}>
              {validityText}
            </Text>
          ) : null}
          {item.termsAndConditions ? (
            <Text style={[styles.couponTerms, { color: colors.text }]} numberOfLines={1}>
              T&C: {item.termsAndConditions}
            </Text>
          ) : null}
        </View>
        
        <View style={styles.couponActions}>
          <TouchableOpacity 
            onPress={() => copyToClipboard(item.code)}
            style={[styles.actionButton, { backgroundColor: colors.background }]}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              {isCopied ? 'Copied!' : 'Copy Code'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleApplyCoupon(item)}
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.actionButtonText, { color: 'white' }]}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>Loading coupons...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={coupons}
        renderItem={renderCouponItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No coupons available at the moment.
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text }]}>
              Check back later for exciting offers!
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  couponCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  couponInfo: {
    flex: 1,
    marginRight: 12,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  couponDescription: {
    fontSize: 14,
  },
  couponBadge: {
    backgroundColor: 'rgba(117, 76, 41, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  couponDiscount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  couponDetails: {
    marginBottom: 16,
  },
  couponCodeText: {
    fontSize: 14,
    marginBottom: 4,
  },
  couponExpiry: {
    fontSize: 12,
  },
  couponTerms: {
    fontSize: 12,
    marginTop: 4,
  },
  couponActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    margin: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
});

export default CouponsScreen;