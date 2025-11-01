import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../config/firebase';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';
import { Coupon } from '../../../types/coupon';
import { UserProfile } from '../../../types/user';
import Clipboard from '@react-native-clipboard/clipboard';

const CouponsScreen = () => {
  const { colors } = useTheme();
  const { user } = useAuth() as { user: UserProfile | null };
  const { state: cart } = useCart();
  
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const now = new Date();
      
      const querySnapshot = await firestore()
        .collection('coupons')
        .where('isActive', '==', true)
        .get();

      const validCoupons = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            validFrom: data.validFrom?.toDate(),
            validTill: data.validTill?.toDate()
          } as Coupon;
        })
        .filter(coupon => {
          const fromValid = !coupon.validFrom || coupon.validFrom <= now;
          const tillValid = !coupon.validTill || coupon.validTill >= now;
          return fromValid && tillValid;
        });

      setCoupons(validCoupons);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to load coupons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    Clipboard.setString(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const renderCouponItem = ({ item }: { item: Coupon }) => (
    <View style={[styles.couponCard, { backgroundColor: colors.card }]}>
      <View style={styles.couponContent}>
        <View style={styles.codeContainer}>
          <Text style={[styles.couponCode, { color: colors.primary }]}>
            {item.code}
          </Text>
          <TouchableOpacity 
            onPress={() => copyToClipboard(item.code)}
            style={[styles.copyButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.copyButtonText}>
              {copiedCoupon === item.code ? 'Copied!' : 'Copy'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.couponDescription, { color: colors.text }]}>
          {item.description || `Get ${item.discountValue}% off on your order`}
        </Text>
        <Text style={[styles.couponTerms, { color: colors.text }]}>
          Valid till: {item.validTill?.toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>Loading coupons...</Text>
        </View>
      ) : (
        <FlatList
          data={coupons}
          renderItem={renderCouponItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No coupons available at the moment.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  couponCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  couponContent: {
    flex: 1,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  copyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  couponDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  couponTerms: {
    fontSize: 12,
    opacity: 0.8,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
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
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});


export default CouponsScreen;