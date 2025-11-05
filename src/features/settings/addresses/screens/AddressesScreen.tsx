import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaWrapper } from '../../../../components/layout';
import { useThemeContext } from '../../../../contexts/ThemeContext';
import { AddressForm } from '../components/AddressForm';
import { useAddresses } from '../hooks/useAddresses';

export const AddressesScreen = () => {
  const { theme } = useThemeContext();
  const { addresses, loading, saving, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const handleSaveAddress = async (data: any) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
        Alert.alert('Success', 'Address updated successfully');
      } else {
        await addAddress(data);
        Alert.alert('Success', 'Address added successfully');
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to save address');
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAddress(id);
              Alert.alert('Success', 'Address deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      Alert.alert('Success', 'Default address updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update default address');
    }
  };

  const renderAddressItem = (address: any) => (
    <View 
      key={address.id} 
      style={[styles.addressCard, { 
        backgroundColor: theme.colors.surface, 
        borderColor: address.isDefault ? theme.colors.primary : theme.colors.border 
      }]}
    >
      <View style={styles.addressHeader}>
        <Text style={[styles.addressName, { color: theme.colors.text }]}>{address.name}</Text>
        {address.isDefault && (
          <Text style={[styles.defaultBadge, { backgroundColor: theme.colors.primary }]}>Default</Text>
        )}
      </View>
      <Text style={[styles.addressText, { color: theme.colors.text }]}>{address.address}</Text>
      <Text style={[styles.addressText, { color: theme.colors.text }]}>
        {address.city}, {address.state} {address.zipCode}
      </Text>
      <Text style={[styles.addressText, { color: theme.colors.text }]}>{address.phone}</Text>
      
      <View style={styles.addressActions}>
        {!address.isDefault && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleSetDefault(address.id)}
          >
            <Text style={[styles.actionText, { color: theme.colors.white }]}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={() => handleEditAddress(address)}
        >
          <Text style={[styles.actionText, { color: theme.colors.text }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={() => handleDeleteAddress(address.id)}
        >
          <Text style={[styles.actionText, { color: theme.colors.white }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaWrapper>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerContainer}>
          <Text style={[styles.header, { color: theme.colors.text }]}>Addresses</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
          >
            <Text style={[styles.addButtonText, { color: theme.colors.white }]}>Add Address</Text>
          </TouchableOpacity>
        </View>

        {showForm ? (
          <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setShowForm(false);
                setEditingAddress(null);
              }}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>×</Text>
            </TouchableOpacity>
            <AddressForm
              initialData={editingAddress || {}}
              onSave={handleSaveAddress}
              saving={saving}
            />
          </View>
        ) : (
          <View style={styles.content}>
            {loading ? (
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                Loading addresses...
              </Text>
            ) : addresses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  No addresses found
                </Text>
              </View>
            ) : (
              addresses.map(renderAddressItem)
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
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
  addressCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 18,
    fontWeight: '600',
  },
  defaultBadge: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    marginBottom: 4,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  actionButton: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AddressesScreen;