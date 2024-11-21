import { StatusBar } from "expo-status-bar";
import "./global.css";
import { useFonts } from 'expo-font';
import { TamaguiProvider } from 'tamagui';
import { ToastProvider } from '@tamagui/toast'
import tamaguiConfig from './tamagui.config';
import { useEffect } from "react";
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      // can hide splash screen here if needed
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <TamaguiProvider config={tamaguiConfig}>
        <ToastProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </ToastProvider>
      </TamaguiProvider>
    </AuthProvider>
  );
}


