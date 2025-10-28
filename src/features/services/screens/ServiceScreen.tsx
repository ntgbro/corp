import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaWrapper, Header } from '../../../components/layout';
import { ProductCard } from '../../../components/layout';
import { useThemeContext } from '../../../contexts/ThemeContext';
import {
  getProductsByService,
  getFeaturedProducts,
  ProductData
} from '../../../services/firebase/firestore/productService';

type ServiceScreenRouteProp = RouteProp<{
  ServiceScreen: {
    service: 'fresh' | 'fmcg' | 'supplies';
    title: string;
  };
}, 'ServiceScreen'>;

const ServiceScreen: React.FC = () => {
  const { theme } = useThemeContext();
  const route = useRoute<ServiceScreenRouteProp>();
  const navigation = useNavigation();
  const { service, title } = route.params;

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await getProductsByService(service, 50);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadProducts();
  }, [service]);

  const handleProductPress = (product: ProductData) => {
    // For now, just show a placeholder alert until we implement the product details screen
    console.log('Product pressed:', product.id);
    // TODO: Navigate to product details screen when implemented
  };

  const renderProduct = ({ item }: { item: ProductData }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      style={{ width: 180, margin: 8 }}
      showRating={true}
      showCategory={true}
    />
  );

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'fresh':
        return '🥗';
      case 'fmcg':
        return '🛒';
      case 'supplies':
        return '📦';
      default:
        return '📱';
    }
  };

  const getServiceDescription = (serviceType: string) => {
    switch (serviceType) {
      case 'fresh':
        return 'Fresh, healthy meals and ingredients';
      case 'fmcg':
        return 'Everyday essentials and groceries';
      case 'supplies':
        return 'Office and household supplies';
      default:
        return 'Products and services';
    }
  };

  if (loading) {
    return (
      <SafeAreaWrapper>
        <Header title={title} showBackButton />
        <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading {title.toLowerCase()}...
          </Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <Header title={title} showBackButton />

      {/* Service Info Header */}
      <View style={[styles.serviceHeader, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.serviceIcon, { fontSize: 48 }]}>
          {getServiceIcon(service)}
        </Text>
        <Text style={[styles.serviceTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
          {getServiceDescription(service)}
        </Text>
      </View>

      {/* Products List */}
      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[
            styles.productsContainer,
            { backgroundColor: theme.colors.background }
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.serviceIcon, { fontSize: 64, marginBottom: 16 }]}>
            {getServiceIcon(service)}
          </Text>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No products available
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            Products for {title.toLowerCase()} will be available soon
          </Text>
        </View>
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  serviceHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  serviceIcon: {
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  productsContainer: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ServiceScreen;
