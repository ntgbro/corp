import React from 'react';
import { FlatList, Text, View, StyleSheet, ViewStyle, RefreshControl, ListRenderItem, Dimensions } from 'react-native';
import { useTheme } from '../../config/theme';
import { ProductCard, ProductData } from './ProductCard';
import { SectionHeader } from './SectionHeader';
import { SPACING, CARD_DIMENSIONS } from '../../constants/ui';

export interface ProductGridProps {
  products: ProductData[];
  onProductPress?: (product: ProductData) => void;
  style?: ViewStyle;
  numColumns?: 2 | 3 | 4;
  showRating?: boolean;
  showCategory?: boolean;
  cardSize?: 'small' | 'medium' | 'large';
  loading?: boolean;
  emptyMessage?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductPress,
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
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth) / numColumns;

  const renderProduct: ListRenderItem<ProductData> = ({ item, index }) => {
    return (
      <ProductCard
        product={item}
        onPress={() => onProductPress?.(item)}
        showRating={showRating}
        showCategory={showCategory}
        size={cardSize}
        style={{ width: cardWidth }}
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
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={renderProduct}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{
          paddingVertical: SPACING.screen,
          // Removed horizontal padding for edge-to-edge layout
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
          // Removed any vertical spacing to prevent row misalignment
        }}
        legacyImplementation={false}
        // ✅ Added getItemLayout for better performance with fixed height cards
        getItemLayout={(data, index) => {
          const cardHeight = 240; // Fixed height for all product cards
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
