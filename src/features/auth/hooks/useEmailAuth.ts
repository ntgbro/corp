import { useState, useCallback } from 'react';
import { authService } from '../../../services/firebase/auth/authService';

import type { AuthResult, GoogleSignInResult } from '../../../services/firebase/auth/authService';

export interface UseEmailAuthReturn {
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string, name: string) => Promise<AuthResult>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  googleSignIn: () => Promise<GoogleSignInResult>;
  googleSignOut: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useEmailAuth = (): UseEmailAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.loginWithEmail(email, password);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.signupWithEmail(email, password, name);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.forgotPassword(email);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Forgot password failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const googleSignIn = useCallback(async (): Promise<GoogleSignInResult> => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.googleSignIn();
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Google Sign-In failed';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const googleSignOut = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await authService.googleSignOut();
    } catch (err: any) {
      const errorMessage = err.message || 'Google Sign-Out failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
    } catch (err: any) {
      const errorMessage = err.message || 'Sign out failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    login,
    signup,
    forgotPassword,
    googleSignIn,
    googleSignOut,
    signOut,
    loading,
    error,
  };
}