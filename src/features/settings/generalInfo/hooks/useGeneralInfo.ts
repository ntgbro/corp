import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { db } from '../../../../config/firebase';
import { doc, getDoc, updateDoc } from '@react-native-firebase/firestore';

export const useGeneralInfo = () => {
  const { user } = useAuth();
  const [appInfo, setAppInfo] = useState({
    version: '1.0.0',
    build: '100',
    termsAccepted: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppInfo = async () => {
      if (user?.userId) {
        try {
          setLoading(true);
          const userDocRef = doc(db, 'users', user.userId);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // In a real app, we might store terms acceptance in the user document
            // For now, we'll use a default value
            setAppInfo({
              version: '1.0.0',
              build: '100',
              termsAccepted: true, // Default to accepted for now
            });
          }
        } catch (error) {
          console.error('Error fetching app info:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setAppInfo({
          version: '1.0.0',
          build: '100',
          termsAccepted: false,
        });
        setLoading(false);
      }
    };

    fetchAppInfo();
  }, [user?.userId]);

  const acceptTerms = async () => {
    try {
      if (user?.userId) {
        // In a real implementation, we would store this in the user document
        setAppInfo(prev => ({ ...prev, termsAccepted: true }));
        return { success: true };
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      throw error;
    }
  };

  const declineTerms = async () => {
    try {
      if (user?.userId) {
        // In a real implementation, we would store this in the user document
        setAppInfo(prev => ({ ...prev, termsAccepted: false }));
        return { success: true };
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    appInfo,
    loading,
    acceptTerms,
    declineTerms,
  };
};