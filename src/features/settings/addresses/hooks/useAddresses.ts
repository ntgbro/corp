import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { db } from '../../../../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, GeoPoint } from '@react-native-firebase/firestore';
import { QueryDocumentSnapshot } from '../../../../types/firebase';

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
  label: string;
  cityId: string;
  geoPoint: GeoPoint;
  isActive: boolean;
  addressId: string;
}

export const useAddresses = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (user?.userId) {
        try {
          setLoading(true);
          const addressesRef = collection(db, 'users', user.userId, 'addresses');
          const q = query(addressesRef);
          const querySnapshot = await getDocs(q);
          
          const addressesData: Address[] = [];
          querySnapshot.forEach((doc: QueryDocumentSnapshot<any>) => {
            const data = doc.data();
            addressesData.push({
              id: doc.id,
              name: data.name || '',
              line1: data.line1 || '',
              line2: data.line2 || '',
              city: data.city || '',
              state: data.state || '',
              zipCode: data.zipCode || '',
              phone: data.phone || '',
              isDefault: data.isDefault || false,
              label: data.label || '',
              cityId: data.cityId || '',
              geoPoint: data.geoPoint,
              isActive: data.isActive || true,
              addressId: data.addressId || doc.id,
            });
          });
          
          setAddresses(addressesData);
        } catch (error) {
          console.error('Error fetching addresses:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setAddresses([]);
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user?.userId]);

  const addAddress = async (address: Omit<Address, 'id' | 'isDefault' | 'addressId'>) => {
    setSaving(true);
    try {
      if (user?.userId) {
        const addressesRef = collection(db, 'users', user.userId, 'addresses');
        const newAddress = {
          ...address,
          isDefault: addresses.length === 0,
          addressId: '', // Will be set by Firebase
          isActive: true,
        };
        
        const docRef = await addDoc(addressesRef, newAddress);
        
        const addedAddress: Address = {
          ...address,
          id: docRef.id,
          isDefault: addresses.length === 0,
          addressId: docRef.id,
        };
        
        setAddresses(prev => [...prev, addedAddress]);
        return { success: true, address: addedAddress };
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateAddress = async (id: string, address: Partial<Address>) => {
    setSaving(true);
    try {
      if (user?.userId) {
        const addressDocRef = doc(db, 'users', user.userId, 'addresses', id);
        await updateDoc(addressDocRef, address);
        
        setAddresses(prev => 
          prev.map(item => 
            item.id === id ? { ...item, ...address } : item
          )
        );
        return { success: true };
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id: string) => {
    setSaving(true);
    try {
      if (user?.userId) {
        const addressDocRef = doc(db, 'users', user.userId, 'addresses', id);
        await deleteDoc(addressDocRef);
        
        setAddresses(prev => prev.filter(item => item.id !== id));
        return { success: true };
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const setDefaultAddress = async (id: string) => {
    setSaving(true);
    try {
      if (user?.userId) {
        // First, set all addresses to not default
        const addressesRef = collection(db, 'users', user.userId, 'addresses');
        const q = query(addressesRef);
        const querySnapshot = await getDocs(q);
        
        const updatePromises = [];
        for (const docSnapshot of querySnapshot.docs) {
          if (docSnapshot.id !== id) {
            const addressDocRef = doc(db, 'users', user.userId, 'addresses', docSnapshot.id);
            updatePromises.push(updateDoc(addressDocRef, { isDefault: false }));
          }
        }
        
        // Then set the selected address as default
        const addressDocRef = doc(db, 'users', user.userId, 'addresses', id);
        updatePromises.push(updateDoc(addressDocRef, { isDefault: true }));
        
        await Promise.all(updatePromises);
        
        setAddresses(prev => 
          prev.map(item => ({
            ...item,
            isDefault: item.id === id,
          }))
        );
        return { success: true };
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    addresses,
    loading,
    saving,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};