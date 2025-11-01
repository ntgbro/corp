import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsItem } from '../components/SettingsItem';
import { useFirebase } from '../../../contexts/FirebaseContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../navigation/SettingsNavigator';

interface PreferenceItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  type: 'promotion' | 'order_update' | 'price_drop' | 'stock_alert';
}

type PreferencesScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'Preferences'>;

export const PreferencesScreen = () => {
  const { colors } = useTheme();
  const { firestore } = useFirebase();
  const navigation = useNavigation<PreferencesScreenNavigationProp>();
  const [preferences, setPreferences] = useState<PreferenceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual Firebase fetch
    const fetchPreferences = async () => {
      try {
        // Simulated preferences - replace with actual Firebase fetch
        const defaultPreferences: PreferenceItem[] = [
          {
            id: 'promotions',
            label: 'Promotions & Offers',
            description: 'Get notified about special offers and promotions',
            enabled: true,
            type: 'promotion'
          },
          {
            id: 'order_updates',
            label: 'Order Updates',
            description: 'Get updates about your orders',
            enabled: true,
            type: 'order_update'
          },
          {
            id: 'price_drops',
            label: 'Price Drops',
            description: 'Get notified when prices drop on items you like',
            enabled: true,
            type: 'price_drop'
          },
          {
            id: 'stock_alerts',
            label: 'Stock Alerts',
            description: 'Get notified when items are back in stock',
            enabled: true,
            type: 'stock_alert'
          }
        ];
        
        setPreferences(defaultPreferences);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const togglePreference = async (id: string) => {
    setPreferences(prev => 
      prev.map(item => 
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
    
    // TODO: Update preference in Firebase
    try {
      // await firestore().collection('user_preferences').doc(userId).update({
      //   [id]: !preferences.find(p => p.id === id)?.enabled
      // });
    } catch (error) {
      console.error('Error updating preference:', error);
      // Revert on error
      setPreferences(prev => 
        prev.map(item => 
          item.id === id ? { ...item, enabled: !item.enabled } : item
        )
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading preferences...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <SettingsSection title="Notification Preferences">
        {preferences.map((pref) => (
          <SettingsItem
            key={pref.id}
            icon={getIconForType(pref.type)}
            title={pref.label}
            subtitle={pref.description}
            onPress={() => togglePreference(pref.id)}
            isSwitch={true}
            switchValue={pref.enabled}
            onSwitchChange={() => togglePreference(pref.id)}
          />
        ))}
      </SettingsSection>

      <SettingsSection title="Cuisine Preferences">
        <SettingsItem
          icon="🍕"
          title="Manage Cuisines"
          subtitle="Select your favorite cuisines"
          onPress={() => navigation.navigate('CuisinePreferences')}
          showChevron
        />
      </SettingsSection>

      <SettingsSection title="Food Type Preferences">
        <SettingsItem
          icon="🥗"
          title="Manage Food Types"
          subtitle="Select your preferred food types"
          onPress={() => navigation.navigate('FoodTypePreferences')}
          showChevron
        />
      </SettingsSection>
    </ScrollView>
  );
};

const getIconForType = (type: string) => {
  switch (type) {
    case 'promotion':
      return '🎁';
    case 'order_update':
      return '📦';
    case 'price_drop':
      return '💰';
    case 'stock_alert':
      return '🔔';
    default:
      return '🔔';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});
