import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../../components/layout';
import { SPACING } from '../../../constants/ui';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { useProductSearch } from '../hooks/useProducts';
import { ProductGrid } from '../../../components/layout';
import Typography from '../../../components/common/Typography';
import { useCart } from '../../../contexts/CartContext';

interface RouteParams {
  searchQuery: string;
}

const SearchResultsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const searchQuery = (route.params as RouteParams)?.searchQuery || '';
  const { theme } = useThemeContext();
  const { addToCart } = useCart();

  const { products, loading, error } = useProductSearch(searchQuery, 'fresh');

  const handleProductPress = (product: any) => {
    (navigation as any).navigate('Main', { screen: 'ProductDetails', params: { menuItemId: product.id } });
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || 'https://via.placeholder.com/150',
      chefId: product.restaurantId || '',
      chefName: 'Restaurant',
    });
  };

  const handleRefresh = () => {
    // Refresh will be handled by the hooks
    console.log('Refreshing search results...');
  };

  if (loading) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Typography variant="body2" color="secondary" style={{ marginTop: 10 }}>
          Searching for "{searchQuery}"...
        </Typography>
      </SafeAreaWrapper>
    );
  }

  if (error) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1" color="error">
          Error searching products: {error}
        </Typography>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Typography variant="h5" color="text">
          Search Results
        </Typography>
        <Typography variant="body2" color="secondary" style={{ marginTop: 4 }}>
          Found {products.length} results for "{searchQuery}"
        </Typography>
      </View>
      
      <ProductGrid
        products={products}
        onProductPress={handleProductPress}
        onRefresh={handleRefresh}
        refreshing={loading}
        numColumns={2}
        showRating={true}
        showCategory={true}
        emptyMessage={`No products found for "${searchQuery}"`}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fefefe',
  },
});

export default SearchResultsScreen;