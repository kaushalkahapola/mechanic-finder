import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');
      
      console.log('Auth check - Token:', token, 'Role:', role);
      
      if (token) {
        if (role === 'mechanic') {
          console.log('Redirecting to mechanic dashboard');
          router.push('/mechanic/dashboard');
        } else if (role === 'vehicle_owner') {
          console.log('Redirecting to vehicle dashboard');
          router.push('/vehicle/dashboard');
        } else {
          console.log('Unknown role, redirecting to signin');
          router.push('/auth/signin');
        }
      } else {
        console.log('No token found, redirecting to signin');
        router.push('/auth/signin');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      router.push('/auth/signin');
    } finally {
      setIsLoading(false);
      // Hide splash screen after auth check
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 500);
    }
  };

  if (isLoading) {
    return null; // Show splash screen while checking auth
  }

  return null; // This component will redirect, so return null
}