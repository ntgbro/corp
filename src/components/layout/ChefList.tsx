import React from 'react';
import { FlatList, StyleSheet, ViewStyle, ListRenderItem } from 'react-native';
import { useTheme } from '../../config/theme';
import { ChefCard, ChefData } from './ChefCard';

interface ChefListProps {
  chefs: ChefData[];
  onChefPress?: (chef: ChefData) => void;
  onEndReached?: () => void;
  style?: ViewStyle;
  horizontal?: boolean;
  numColumns?: number;
  showRating?: boolean;
  showDistance?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const ChefList: React.FC<ChefListProps> = ({
  chefs,
  onChefPress,
  onEndReached,
  style,
  horizontal = false,
  numColumns = 1,
  showRating = true,
  showDistance = false,
  loading = false,
  emptyMessage = 'No chefs available',
  onRefresh,
  refreshing = false,
}) => {
  const theme = useTheme();

  const renderChef: ListRenderItem<ChefData> = ({ item }) => (
    <ChefCard
      chef={item}
      onPress={() => onChefPress?.(item)}
      showRating={showRating}
      showDistance={showDistance}
      style={{ margin: 8 }}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        {emptyMessage}
      </Text>
    </View>
  );

  const getItemLayout = (_, index: number) => ({
    length: 180,
    offset: 180 * index,
    index,
  });

  if (horizontal) {
    return (
      <FlatList
        data={chefs}
        renderItem={renderChef}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.horizontalContainer, style]}
        ListEmptyComponent={renderEmpty}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    );
  }

  return (
    <FlatList
      data={chefs}
      renderItem={renderChef}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.verticalContainer, style]}
      ListEmptyComponent={renderEmpty}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
    />
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  verticalContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ChefList;
