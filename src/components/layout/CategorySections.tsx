import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ViewStyle, Image } from 'react-native';
import { Card } from '../common';
import { useTheme } from '../../config/theme';

interface Category {
  id: string;
  name: string;
  icon?: string;
  isActive?: boolean;
  imageURL?: string;
}

interface CategorySectionsProps {
  categories: Category[];
  selectedCategory?: string;
  onCategoryPress?: (category: Category) => void;
  style?: ViewStyle;
  variant?: 'horizontal' | 'grid' | 'grid4' | 'grid3' | 'direct'; // ✅ Added 'grid3' variant
  showIcons?: boolean;
}

export const CategorySections: React.FC<CategorySectionsProps> = ({
  categories,
  selectedCategory,
  onCategoryPress,
  style,
  variant = 'horizontal',
  showIcons = false,
}) => {
  const theme = useTheme();

  const renderCategoryItem = (category: Category) => {
    const isSelected = selectedCategory === category.id;

    if (variant === 'grid3') {
      // 3-column grid with square cards
      return (
        <View key={category.id} style={styles.grid3ItemContainer}>
          <TouchableOpacity
            onPress={() => onCategoryPress?.(category)}
            activeOpacity={0.7}
            style={styles.grid3CardTouchable}
          >
            <View style={[
              styles.grid3Card,
              {
                backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                borderColor: isSelected ? theme.colors.primary : theme.colors.border,
              }
            ]}>
              {/* Placeholder icon for visibility */}
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <Text style={{
                  fontSize: 20,
                  color: isSelected ? theme.colors.white : theme.colors.primary
                }}>
                  📦
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Category Name Below Card */}
          <Text
            style={[
              styles.grid3CategoryName,
              {
                color: isSelected ? theme.colors.primary : theme.colors.text,
                fontWeight: isSelected ? '600' : '500',
              },
            ]}
            numberOfLines={2}
          >
            {category.name}
          </Text>
        </View>
      );
    }

    if (variant === 'grid4') {
      // 4-column grid with square cards and full image coverage
      return (
        <View key={category.id} style={styles.grid4ItemContainer}>
          <TouchableOpacity
            onPress={() => onCategoryPress?.(category)}
            activeOpacity={0.7}
            style={styles.grid4CardTouchable}
          >
            <View style={styles.grid4Card}>
              {/* Full-size image that covers the entire card */}
              <Image
                source={{
                  uri: category.imageURL || category.icon || 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=' + encodeURIComponent(category.name.charAt(0))
                }}
                style={styles.grid4Image}
                resizeMode="cover"
              />
              {/* Optional overlay for selection state */}
              {selectedCategory === category.id && (
                <View style={styles.grid4Overlay}>
                  <Text style={styles.grid4OverlayText}>✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Category Name Below Card */}
          <Text
            style={[
              styles.grid4CategoryName,
              {
                color: selectedCategory === category.id ? theme.colors.primary : theme.colors.text,
                fontWeight: selectedCategory === category.id ? '600' : '500',
              },
            ]}
            numberOfLines={2}
          >
            {category.name}
          </Text>
        </View>
      );
    }

    if (variant === 'grid') {
      // Grid layout uses Card component
      return (
        <View key={category.id} style={styles.gridItemContainer}>
          <Card
            variant="outlined"
            padding="none"
            shadow={true}
            style={{
              backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
              borderColor: isSelected ? theme.colors.primary : theme.colors.border,
              minHeight: 80,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 16,
              borderWidth: isSelected ? 2 : 1,
              width: '100%',
              height: '100%',
            }}
          >
            {/* Use category image if available, otherwise placeholder that occupies entire card */}
            {category.imageURL ? (
              <Image
                source={{ uri: category.imageURL }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 16,
                }}
                resizeMode="cover"
              />
            ) : (
              <View style={{
                width: '100%',
                height: '100%',
                borderRadius: 16,
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 20,
                  color: isSelected ? theme.colors.white : theme.colors.primary
                }}>
                  📦
                </Text>
              </View>
            )}
          </Card>

          {/* Category Name Below Card */}
          <Text
            style={[
              styles.categoryNameBelow,
              {
                color: isSelected ? theme.colors.primary : theme.colors.text,
                fontWeight: isSelected ? '600' : '400',
              },
            ]}
            numberOfLines={2}
          >
            {category.name}
          </Text>
        </View>
      );
    }

    if (variant === 'direct') {
      // Direct layout - simple TouchableOpacity with icon and text
      return (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.directCategoryItem,
            {
              backgroundColor: isSelected ? theme.colors.primary + '20' : theme.colors.surface,
              borderColor: isSelected ? theme.colors.primary : theme.colors.border,
            },
          ]}
          onPress={() => onCategoryPress?.(category)}
          activeOpacity={0.7}
        >
          {/* Use category image if available, otherwise icon placeholder that occupies entire container */}
          <View style={styles.directIconContainer}>
            {category.imageURL ? (
              <Image
                source={{ uri: category.imageURL }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
                resizeMode="cover"
              />
            ) : (
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={[
                  styles.directIcon,
                  {
                    color: isSelected ? theme.colors.primary : theme.colors.textSecondary
                  }
                ]}>
                  📦
                </Text>
              </View>
            )}
          </View>

          {/* Category name */}
          <Text
            style={[
              styles.directCategoryName,
              {
                color: isSelected ? theme.colors.primary : theme.colors.text,
                fontWeight: isSelected ? '600' : '500',
              },
            ]}
            numberOfLines={2}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      );
    }

    if (variant === 'horizontal') {
      // Horizontal layout uses TouchableOpacity for backward compatibility
      return (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryItem,
            {
              backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
              borderColor: isSelected ? theme.colors.primary : theme.colors.border,
            },
          ]}
          onPress={() => onCategoryPress?.(category)}
          activeOpacity={0.7}
        >
          {showIcons && (category.icon || category.imageURL) && (
            category.imageURL ? (
              <Image
                source={{ uri: category.imageURL }}
                style={styles.categoryImage}
              />
            ) : (
              <View style={{
                width: 16,
                height: 16,
                marginRight: 6,
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={[styles.categoryIcon, { 
                  color: isSelected ? theme.colors.white : theme.colors.primary,
                  fontSize: 12,
                }]}>
                  📦
                </Text>
              </View>
            )
          )}
          <Text
            style={[
              styles.categoryName,
              {
                color: isSelected ? theme.colors.white : theme.colors.text,
                fontWeight: isSelected ? '600' : '400',
              },
            ]}
            numberOfLines={1}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      );
    }

    // Default grid layout
    return (
      <View key={category.id} style={styles.gridItemContainer}>
        <Card
          variant="outlined"
          padding="none"
          shadow={true}
          style={{
            backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
            borderColor: isSelected ? theme.colors.primary : theme.colors.border,
            minHeight: 80,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 16,
            borderWidth: isSelected ? 2 : 1,
            width: '100%',
            height: '100%',
          }}
        >
          {/* Use category image if available, otherwise placeholder that occupies entire card */}
          {category.imageURL ? (
            <Image
              source={{ uri: category.imageURL }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 16,
              }}
              resizeMode="cover"
            />
          ) : (
            <View style={{
              width: '100%',
              height: '100%',
              borderRadius: 16,
              backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 20,
                color: isSelected ? theme.colors.white : theme.colors.primary
              }}>
                📦
              </Text>
            </View>
          )}
        </Card>

        {/* Category Name Below Card */}
        <Text
          style={[
            styles.categoryNameBelow,
            {
              color: isSelected ? theme.colors.primary : theme.colors.text,
              fontWeight: isSelected ? '600' : '400',
            },
          ]}
          numberOfLines={2}
        >
          {category.name}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {variant === 'horizontal' ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContainer}
        >
          {categories.map(renderCategoryItem)}
        </ScrollView>
      ) : variant === 'direct' ? (
        <View style={styles.directContainer}>
          {categories.map(renderCategoryItem)}
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {categories.map(renderCategoryItem)}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  horizontalContainer: {
    // Removed paddingHorizontal for edge-to-edge layout
    gap: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Removed paddingHorizontal for edge-to-edge layout
    gap: 0, // No gap for perfect edge-to-edge alignment
    justifyContent: 'space-between',
  },
  directContainer: {
    // Removed paddingHorizontal for edge-to-edge layout
    gap: 8,
  },
  categoryItem: {
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItem: {
    width: '22%', // 4 columns with gaps (100% - 6% gaps) / 4 = 23.5% ≈ 22%
    aspectRatio: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
  },
  gridItemContainer: {
    width: '23%', // 4 columns: (100% - 3*gap) / 4 = 23%
    aspectRatio: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 100,
  },
  // New 3-column grid styles
  grid3ItemContainer: {
    width: '33.33%', // 3 columns: exactly 33.33% each
    marginBottom: 20,
    alignItems: 'center',
  },
  grid3CardTouchable: {
    width: '90%',
    aspectRatio: 1,
  },
  grid3Card: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  grid3CategoryName: {
    fontSize: 14, // ✅ Increased font size from 12 to 14 for better readability
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  // New 4-column grid styles
  grid4ItemContainer: {
    width: '25%', // 4 columns: exactly 25% each for perfect edge-to-edge fit
    marginBottom: 20,
    alignItems: 'center',
    aspectRatio: 1, // Ensure perfect square
  },
  grid4CardTouchable: {
    width: '100%',
    aspectRatio: 1,
  },
  grid4Card: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F5F5F5', // Light gray background
  },
  grid4Image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  grid4Overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid4OverlayText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  grid4CategoryName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  gridCard: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squarePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderBox: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryNameBelow: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryImage: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 14,
    textAlign: 'center',
  },
  directCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    // Removed paddingHorizontal for edge-to-edge layout
    marginVertical: 4,
    // Removed marginHorizontal for edge-to-edge layout
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  directIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  directIcon: {
    fontSize: 18,
  },
  directCategoryName: {
    fontSize: 16,
    flex: 1,
  },
});

export default CategorySections;