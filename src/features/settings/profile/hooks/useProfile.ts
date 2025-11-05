import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { db } from '../../../../config/firebase';
import { doc, getDoc, updateDoc } from '@react-native-firebase/firestore';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.userId) {
        try {
          setLoading(true);
          const userDocRef = doc(db, 'users', user.userId);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setProfile({
              displayName: userData?.displayName || '',
              email: userData?.email || '',
              phone: userData?.phone || '',
              profilePhotoURL: userData?.profilePhotoURL || '',
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.userId]);

  const updateProfile = async (data: any) => {
    setSaving(true);
    try {
      if (user?.userId) {
        const userDocRef = doc(db, 'users', user.userId);
        await updateDoc(userDocRef, {
          displayName: data.displayName,
          phone: data.phone,
        });
        
        setProfile(data);
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
    profile,
    loading,
    saving,
    updateProfile,
  };
};