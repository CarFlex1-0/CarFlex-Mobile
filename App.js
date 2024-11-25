import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { useFonts } from 'expo-font';
import { TamaguiProvider } from 'tamagui';
import { ToastProvider } from '@tamagui/toast'
import tamaguiConfig from './tamagui.config';
import { useEffect } from "react";
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
    <SafeAreaProvider>
      <TamaguiProvider config={tamaguiConfig}>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
          <StatusBar style="auto" />
        </AuthProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}


