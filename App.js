import React, { useEffect } from "react";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "./tamagui.config";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { useFonts } from "expo-font";
import { ToastProvider } from "@tamagui/toast";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OBDProvider } from './src/context/OBDContext';

function AppContent() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
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
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TamaguiProvider config={tamaguiConfig}>
        <ToastProvider>
          <OBDProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </OBDProvider>
        </ToastProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
