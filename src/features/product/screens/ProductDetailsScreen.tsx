import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../../components/layout';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { HomeService } from '../../home/services/homeService';
import { MenuItem, Restaurant } from '../../../types/firestore';
import AddToCartButton from '../../../components/common/AddToCartButton';
import Typography from '../../../components/common/Typography';
import { useCart } from '../../../contexts/CartContext';

interface RouteParams {
  menuItemId: string;
  initialProductData?: any; // ✅ New param
  initialEntityData?: any;  // ✅ New param
}

const ProductDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const { addToCart } = useCart();
  const { menuItemId, initialProductData, initialEntityData } = route.params as RouteParams;

  // Initialize state with the passed data immediately
  const [product, setProduct] = React.useState<any | null>(initialProductData || null);
  const [entity, setEntity] = React.useState<any | null>(initialEntityData || null);
  
  // Don't show loading spinner if we already have the data
  const [loading, setLoading] = React.useState(!initialProductData);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      // ✅ If we already have the product and the entity, STOP. Do not fetch.
      if (product && (entity || !product.restaurantId)) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const menuItemData = await HomeService.getMenuItemById(menuItemId);
        if (menuItemData) {
          setProduct(menuItemData);
          if (menuItemData.restaurantId) {
            const restaurantData = await HomeService.getRestaurantById(menuItemData.restaurantId);
            setEntity(restaurantData);
          }
          return;
        }
        const productData = await HomeService.getProductById(menuItemId);
        if (productData) {
          setProduct(productData);
          if (productData.warehouseId) {
            const warehouseData = await HomeService.getWarehouseById(productData.warehouseId);
            setEntity(warehouseData);
          }
          return;
        }
        setError('Product not found');
      } catch (err: any) {
        console.error('Error fetching product details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (menuItemId) {
      fetchProductDetails();
    }
  }, [menuItemId, product, entity]);

  const handleAddToCart = async () => {
    if (product) {
      await addToCart({
        id: product.menuItemId || product.productId || product.id,
        productId: product.menuItemId || product.productId || product.id,
        name: product.name,
        price: product.price,
        image: product.mainImageURL || product.imageURL || 'https://via.placeholder.com/150',
        chefId: product.restaurantId || product.warehouseId || '',
        chefName: entity?.name || (product.restaurantId ? 'Restaurant' : 'Warehouse'),
        serviceId: product.restaurantId ? 'fresh' : 'fmcg',
        warehouseId: product.warehouseId || '',
        restaurantId: product.restaurantId || '',
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaWrapper>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1" color="error">
          Error loading product details.
        </Typography>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: product.mainImageURL || product.imageURL }} style={styles.image} />
        <View style={styles.details}>
          <Typography variant="h2" color="text" style={{ textAlign: 'center', marginBottom: 5 }}>
            {product.name}
          </Typography>
          <Typography variant="body1" color="secondary" style={{ textAlign: 'center', marginBottom: 5 }}>
            {product.description}
          </Typography>
          <View style={styles.priceContainer}>
            <Typography variant="h2" color="primary" style={{ marginRight: 10, color: '#3b82f6' }}>
              ₹{product.price}
            </Typography>
            <AddToCartButton onPress={handleAddToCart} size={50} />
          </View>
          
          {/* SAFE RENDERING START */}
          <View style={styles.table}>
            {entity ? (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  From
                </Typography>
                <Typography variant="body1" color="text" style={[styles.tableValue]}>
                  {entity.name}
                </Typography>
              </View>
            ) : null}
            
            {product.isVeg !== undefined ? (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Type
                </Typography>
                <Typography
                  variant="body1"
                  color={product.isVeg ? 'success' : 'error'}
                  style={[styles.tableValue]}
                >
                  {product.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                </Typography>
              </View>
            ) : null}

            {product.cuisine ? (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Cuisine
                </Typography>
                <Typography variant="body1" color="text" style={[styles.tableValue]}>
                  {product.cuisine}
                </Typography>
              </View>
            ) : null}

            {product.prepTime ? (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Prep Time
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {product.prepTime}
                </Typography>
              </View>
            ) : null}

            {product.portionSize ? (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Portion Size
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {product.portionSize}
                </Typography>
              </View>
            ) : null}

            {product.spiceLevel ? (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Spice Level
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {product.spiceLevel}
                </Typography>
              </View>
            ) : null}

            {(product.rating !== undefined && product.rating !== null) ? (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Rating
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {product.rating}
                </Typography>
              </View>
            ) : null}

            {product.ingredients && product.ingredients.length > 0 ? (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Ingredients
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {product.ingredients.join(', ')}
                </Typography>
              </View>
            ) : null}

            {product.allergens && product.allergens.length > 0 ? (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Allergens
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {product.allergens.join(', ')}
                </Typography>
              </View>
            ) : null}

            {product.tags && product.tags.length > 0 ? (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Tags
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {product.tags.join(', ')}
                </Typography>
              </View>
            ) : null}

            {product.gst !== undefined ? (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  GST
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {product.gst}%
                </Typography>
              </View>
            ) : null}

            {product.status ? (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Status
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {product.status}
                </Typography>
              </View>
            ) : null}
          </View>
          {/* SAFE RENDERING END */}
          {Array.isArray(product.galleryURLs) && product.galleryURLs.length > 0 ? (
            <View style={styles.section}>
              <FlatList
                data={product.galleryURLs.filter((url: any) => 
                  url && typeof url === 'string' && url.trim() !== '' && url !== product.mainImageURL && url !== product.imageURL
                )}
                keyExtractor={(url, index) => index.toString()}
                horizontal
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.galleryImage} />
                )}
              />
            </View>
          ) : null}

          {entity ? (
            <TouchableOpacity onPress={() => {
              if (product.restaurantId) {
                (navigation as any).navigate('RestaurantDetails', { restaurantId: product.restaurantId });
              }
            }}>
              <Typography variant="body1" color="primary" style={[styles.restaurant]}>
                From: {entity.name}
              </Typography>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 20 },
  details: { alignItems: 'center' },
  priceContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  table: {
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fefefe',
    padding: 10
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
    paddingVertical: 5
  },
  tableLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    padding: 5,
    borderRadius: 5,
    marginRight: 5
  },
  tableValue: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
    backgroundColor: '#FBF5EB',
    padding: 5,
    borderRadius: 5
  },
  section: { marginBottom: 15, alignItems: 'center' },
  galleryImage: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
  restaurant: { fontSize: 16, textDecorationLine: 'underline' },
});

export default ProductDetailsScreen;