import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaWrapper } from '../../../components/layout';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { useCategories } from '../hooks/useProducts';
import CategorySections from '../../../components/layout/CategorySections';
import Typography from '../../../components/common/Typography';

const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const { categories, loading, error } = useCategories('fresh');

  const handleCategoryPress = (category: { id: string; name: string }) => {
    (navigation as any).navigate('Product', {
      screen: 'ProductsPage',
      params: { category: category.id }
    });
  };

  if (loading) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, flex: 1 }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Typography variant="body2" color="secondary" style={{ marginTop: 10 }}>
            Loading categories...
          </Typography>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (error) {
    return (
      <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, flex: 1 }}>
        <View style={styles.errorContainer}>
          <Typography variant="body1" color="error">
            Error loading categories: {error}
          </Typography>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <View style={styles.header}>
        <Typography variant="h4" color="text">
          Categories
        </Typography>
        <Typography variant="body2" color="secondary" style={{ marginTop: 4 }}>
          Browse products by category
        </Typography>
      </View>
      
      <View style={styles.content}>
        {categories.length > 0 ? (
          <CategorySections
            categories={categories}
            onCategoryPress={handleCategoryPress}
            variant="grid3"
            showIcons={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Typography variant="body1" color="secondary">
              No categories available
            </Typography>
          </View>
        )}
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoriesScreen;