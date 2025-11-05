import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { db } from '../../../../config/firebase';
import { doc, getDoc, updateDoc } from '@react-native-firebase/firestore';

export const usePreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (user?.userId) {
        try {
          setLoading(true);
          const userDocRef = doc(db, 'users', user.userId);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setPreferences({
              notifications: {
                orderUpdates: userData?.preferences?.notifications?.orderUpdates ?? true,
                promotions: userData?.preferences?.notifications?.promotions ?? true,
                offers: userData?.preferences?.notifications?.offers ?? true,
              },
              darkMode: false, // Not in Firebase schema, using default
              locationAccess: true, // Not in Firebase schema, using default
              cuisines: userData?.preferences?.cuisines || [],
              foodTypes: userData?.preferences?.foodTypes || [],
            });
          }
        } catch (error) {
          console.error('Error fetching preferences:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setPreferences(null);
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user?.userId]);

  const updatePreferences = async (data: any) => {
    setSaving(true);
    try {
      if (user?.userId) {
        const userDocRef = doc(db, 'users', user.userId);
        
        // Prepare update data for Firebase
        const updateData: any = {};
        
        // Update notification preferences if provided
        if (data.notifications) {
          updateData['preferences.notifications'] = data.notifications;
        }
        
        // Update cuisine preferences if provided
        if (data.cuisines) {
          updateData['preferences.cuisines'] = data.cuisines;
        }
        
        // Update food type preferences if provided
        if (data.foodTypes) {
          updateData['preferences.foodTypes'] = data.foodTypes;
        }
        
        await updateDoc(userDocRef, updateData);
        setPreferences(data);
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
    preferences,
    loading,
    saving,
    updatePreferences,
  };
};