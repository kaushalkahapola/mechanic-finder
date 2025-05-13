import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  useEffect(() => {
    // Hide splash screen after a delay
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 1000);
  }, []);

  // Redirect to the auth flow - in a real app this would check for token existence
  return <Redirect href="/auth/login" />;
}