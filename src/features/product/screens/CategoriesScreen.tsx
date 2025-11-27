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
  
  console.log('[NAVIGATION] CategoriesScreen rendered');
  
  // Get categories for fresh and fmcg services only
  const { categories: freshCategories, loading: freshLoading, error: freshError } = useCategories('fresh');
  const { categories: fmcgCategories, loading: fmcgLoading, error: fmcgError } = useCategories('fmcg');

  const handleCategoryPress = (category: { id: string; name: string }, service: 'fresh' | 'fmcg') => {
    console.log('[NAVIGATION] Category pressed:', { category, service });
    
    // For both FMCG and Fresh categories, navigate directly to ProductScreen (Products route)
    // without passing restaurantId or warehouseId to avoid showing specific entity names
    console.log('[NAVIGATION] Navigating to Product/Products for category');
    (navigation as any).navigate('Products', { 
      category: category.name || category.id,
      service: service
    });
  };

  // Function to get service title
  const getServiceTitle = (service: 'fresh' | 'fmcg') => {
    switch (service) {
      case 'fmcg':
        return 'FMCG Categories';
      case 'fresh':
      default:
        return 'Fresh Food Categories';
    }
  };

  // Function to get service icon
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'fresh':
        return '🥗';
      case 'fmcg':
        return '🛒';
      default:
        return '📱';
    }
  };

  const loading = freshLoading || fmcgLoading;
  const error = freshError || fmcgError;

  if (loading) {
    console.log('[NAVIGATION] CategoriesScreen loading');
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
    console.log('[NAVIGATION] CategoriesScreen error:', error);
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

  // Function to render a service section
  const renderServiceSection = (service: 'fresh' | 'fmcg', categories: any[]) => {
    if (categories.length === 0) return null;
    
    return (
      <View style={styles.serviceSection}>
        <View style={styles.serviceHeader}>
          <Text style={[styles.serviceIcon, { color: theme.colors.text }]}>
            {getServiceIcon(service)}
          </Text>
          <Typography variant="h5" color="text" style={styles.serviceTitle}>
            {getServiceTitle(service)}
          </Typography>
        </View>
        <CategorySections
          categories={categories}
          onCategoryPress={(category) => handleCategoryPress(category, service)}
          variant="grid3"
          showIcons={false}
        />
      </View>
    );
  };

  console.log('[NAVIGATION] CategoriesScreen rendering content');
  
  return (
    <SafeAreaWrapper style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <View style={styles.header}>
        <Typography variant="h4" color="text">
          All Categories
        </Typography>
        <Typography variant="body2" color="secondary" style={{ marginTop: 4 }}>
          Browse products by category across all services
        </Typography>
      </View>
      
      <FlatList
        data={[{ key: 'sections' }]}
        renderItem={() => (
          <View style={styles.content}>
            {renderServiceSection('fresh', freshCategories)}
            {renderServiceSection('fmcg', fmcgCategories)}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Typography variant="body1" color="secondary">
              No categories available
            </Typography>
          </View>
        }
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
  content: {
    padding: 16,
  },
  serviceSection: {
    marginBottom: 24,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  serviceTitle: {
    fontWeight: '600',
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