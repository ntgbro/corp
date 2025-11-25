import React from 'react';
import { FlatList, Text, View, StyleSheet, ViewStyle, RefreshControl, ListRenderItem, Dimensions } from 'react-native';
import { useThemeContext } from '../../contexts/ThemeContext';
import { ProductCard, ProductData } from './ProductCard';
import { SectionHeader } from './SectionHeader';
import { SPACING, CARD_DIMENSIONS } from '../../constants/ui';

export interface ProductGridProps {
  products: ProductData[];
  onProductPress?: (product: ProductData) => void;
  onAddToCart?: (product: ProductData) => void;
  style?: ViewStyle;
  numColumns?: number;
  cardSize?: 'small' | 'medium' | 'large';
  showRating?: boolean;
  showCategory?: boolean;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductPress,
  onAddToCart,
  style,
  numColumns = 2,
  showRating = true,
  showCategory = false,
  cardSize = 'medium',
  loading = false,
  emptyMessage = 'No products available',
  onRefresh,
  refreshing = false,
  onLoadMore,
  hasMore = false,
}) => {
  const { theme } = useThemeContext();
  const screenWidth = Dimensions.get('window').width;
  const horizontalPadding = SPACING.screen;
  const availableWidth = screenWidth - (horizontalPadding * 2);
  const cardWidth = (availableWidth / numColumns) - (SPACING.card.horizontal * (numColumns - 1) / numColumns);

  const renderProduct: ListRenderItem<ProductData> = ({ item, index }) => {
    return (
      <ProductCard
        product={item}
        onPress={() => onProductPress?.(item)}
        onAddToCart={(product) => onAddToCart?.(product)}
        showRating={showRating}
        showCategory={showCategory}
        size={cardSize}
        style={{ 
          width: cardWidth,
          marginHorizontal: SPACING.card.horizontal / 2,
          marginVertical: SPACING.card.vertical / 2
        }}
        // Remove manual width override - let FlatList handle grid layout
      />
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        {emptyMessage}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading || !hasMore) return null;

    return (
      <View style={styles.footer}>
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading more products...
        </Text>
      </View>
    );
  };

  if (products.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        {renderEmpty()}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={renderProduct}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{
          padding: SPACING.screen, // Changed from separate horizontal/vertical to uniform padding
        }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={true}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing || false} onRefresh={onRefresh} />
          ) : undefined
        }
        onEndReached={() => {
          onLoadMore?.();
        }}
        onEndReachedThreshold={0.1}
        bounces={true}
        scrollEnabled={true}
        key={`grid-${products.length}-${numColumns}`}
        removeClippedSubviews={true}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          alignItems: 'flex-start', // ✅ Align items to top for consistent grid
          marginVertical: SPACING.card.vertical / 2 // Add vertical spacing between rows
        }}
        legacyImplementation={false}
        // ✅ Added getItemLayout for better performance with fixed height cards
        getItemLayout={(data, index) => {
          const cardHeight = 200; // Fixed height for all product cards (updated from 240)
          const rowHeight = cardHeight; // Each row has the same height
          const rowIndex = Math.floor(index / numColumns);
          return {
            length: rowHeight,
            offset: rowHeight * rowIndex,
            index,
          };
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.section.large,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.content.large,
  },
  loadingText: {
    fontSize: 14,
  },
});

export default ProductGrid;