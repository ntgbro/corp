import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaWrapper } from '../../../../components/layout';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { WishlistItem } from '../components/WishlistItem';
import { useWishlist } from '../hooks/useWishlist';

export const WishlistScreen = () => {
  const { theme } = useThemeContext();
  const { wishlist, loading, removeFromWishlist, addToCart } = useWishlist();

  const handleRemove = (id: string) => {
    removeFromWishlist(id);
  };

  const handleAddToCart = (id: string) => {
    addToCart(id);
  };

  const renderWishlistItem = ({ item }: { item: any }) => (
    <WishlistItem
      id={item.id}
      name={item.name}
      price={item.price}
      image={item.image}
      onRemove={handleRemove}
      onAddToCart={handleAddToCart}
    />
  );

  return (
    <SafeAreaWrapper>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Wishlist</Text>
        <View style={styles.content}>
          {loading && wishlist.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                Loading wishlist...
              </Text>
            </View>
          ) : wishlist.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Your wishlist is empty
              </Text>
            </View>
          ) : (
            <FlatList
              data={wishlist}
              renderItem={renderWishlistItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default WishlistScreen;