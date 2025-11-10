import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const NavigationTest: React.FC = () => {
  const navigation = useNavigation();
  const navState = useNavigationState(state => state);

  const testNavigationFlow = () => {
    // Test the navigation flow that was causing issues
    console.log('Testing navigation flow...');
    console.log('Current route:', navState.routes[navState.index].name);
    console.log('Current route params:', navState.routes[navState.index].params);
    
    // Navigate from Categories to FMCG Product Page
    (navigation as any).navigate('Product', {
      screen: 'Products',
      params: { category: 'office supplies', service: 'fmcg' }
    });
  };

  const testBackNavigation = () => {
    // Test back navigation
    console.log('Testing back navigation...');
    console.log('Can go back:', (navigation as any).canGoBack());
    console.log('Current route:', navState.routes[navState.index].name);
    
    if ((navigation as any).canGoBack()) {
      (navigation as any).goBack();
    } else {
      console.log('Cannot go back, trying to navigate to Categories');
      try {
        // Try to navigate to Categories tab
        const parent = (navigation as any).getParent();
        console.log('Parent navigator:', parent);
        if (parent) {
          parent.navigate('Categories');
        } else {
          (navigation as any).navigate('Categories');
        }
      } catch (error) {
        console.log('Error navigating to Categories:', error);
      }
    }
  };

  const logNavigationState = () => {
    console.log('Navigation state:', JSON.stringify(navState, null, 2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Navigation Test</Text>
      <TouchableOpacity style={styles.button} onPress={testNavigationFlow}>
        <Text style={styles.buttonText}>Test Navigation Flow</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={testBackNavigation}>
        <Text style={styles.buttonText}>Test Back Navigation</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={logNavigationState}>
        <Text style={styles.buttonText}>Log Navigation State</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NavigationTest;