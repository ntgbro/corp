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
}

const ProductDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const { addToCart } = useCart();
  const { menuItemId } = route.params as RouteParams;

  const [menuItem, setMenuItem] = React.useState<MenuItem | null>(null);
  const [restaurant, setRestaurant] = React.useState<Restaurant | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const menuItemData = await HomeService.getMenuItemById(menuItemId);
        if (menuItemData) {
          setMenuItem(menuItemData);
          if (menuItemData.restaurantId) {
            const restaurantData = await HomeService.getRestaurantById(menuItemData.restaurantId);
            setRestaurant(restaurantData);
          }
        } else {
          setError('Menu item not found');
        }
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
  }, [menuItemId]);

  const handleAddToCart = () => {
    if (menuItem) {
      addToCart({
        id: menuItem.menuItemId,
        productId: menuItem.menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        image: menuItem.mainImageURL || menuItem.imageURL || 'https://via.placeholder.com/150',
        chefId: menuItem.restaurantId || '',
        chefName: restaurant?.name || 'Restaurant',
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

  if (error || !menuItem) {
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
        <Image source={{ uri: menuItem.mainImageURL || menuItem.imageURL }} style={styles.image} />
        <View style={styles.details}>
          <Typography variant="h2" color="text" style={{ textAlign: 'center', marginBottom: 10 }}>
            {menuItem.name}
          </Typography>
          <Typography variant="body1" color="secondary" style={{ textAlign: 'center', marginBottom: 10 }}>
            {menuItem.description}
          </Typography>
          <View style={styles.priceContainer}>
            <Typography variant="h3" color="primary" style={{ marginBottom: 20 }}>
              ₹{menuItem.price}
            </Typography>
            <AddToCartButton onPress={handleAddToCart} size={50} />
          </View>
          <View style={styles.table}>
            {menuItem.isVeg !== undefined && (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Type
                </Typography>
                <Typography
                  variant="body1"
                  color={menuItem.isVeg ? 'success' : 'error'}
                  style={[styles.tableValue]}
                >
                  {menuItem.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                </Typography>
              </View>
            )}
            {menuItem.cuisine && (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Cuisine
                </Typography>
                <Typography variant="body1" color="text" style={[styles.tableValue]}>
                  {menuItem.cuisine}
                </Typography>
              </View>
            )}
            {menuItem.prepTime && (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Prep Time
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {menuItem.prepTime}
                </Typography>
              </View>
            )}
            {menuItem.portionSize && (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Portion Size
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {menuItem.portionSize}
                </Typography>
              </View>
            )}
            {menuItem.spiceLevel && (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Spice Level
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {menuItem.spiceLevel}
                </Typography>
              </View>
            )}
            {menuItem.rating && (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Rating
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {menuItem.rating}
                </Typography>
              </View>
            )}
            {menuItem.ingredients && menuItem.ingredients.length > 0 && (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Ingredients
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {menuItem.ingredients.join(', ')}
                </Typography>
              </View>
            )}
            {menuItem.allergens && menuItem.allergens.length > 0 && (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Allergens
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {menuItem.allergens.join(', ')}
                </Typography>
              </View>
            )}
            {menuItem.tags && menuItem.tags.length > 0 && (
              <View style={styles.tableRow}>
                <Typography variant="body1" color="text" style={[styles.tableLabel]}>
                  Tags
                </Typography>
                <Typography variant="body1" color="secondary" style={[styles.tableValue]}>
                  {menuItem.tags.join(', ')}
                </Typography>
              </View>
            )}
          </View>
          {menuItem.galleryURLs && menuItem.galleryURLs.length > 0 && (
            <View style={styles.section}>
              <FlatList
                data={menuItem.galleryURLs.filter(url => typeof url === 'string' && url.trim() !== '' && url !== menuItem.mainImageURL && url !== menuItem.imageURL)}
                keyExtractor={(url, index) => index.toString()}
                horizontal
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.galleryImage} />
                )}
              />
            </View>
          )}
          {restaurant && (
            <TouchableOpacity onPress={() => (navigation as any).navigate('RestaurantDetails', { restaurantId: restaurant.restaurantId })}>
              <Typography variant="body1" color="primary" style={[styles.restaurant]}>
                From: {restaurant.name}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 20 },
  details: { alignItems: 'center' },
  priceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
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
    backgroundColor: '#FBF5EB',
    padding: 5,
    borderRadius: 5,
    marginRight: 5
  },
  tableValue: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right'
  },
  section: { marginBottom: 15, alignItems: 'center' },
  galleryImage: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
  restaurant: { fontSize: 16, textDecorationLine: 'underline' },
});

export default ProductDetailsScreen;
