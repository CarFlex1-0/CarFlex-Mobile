import { StatusBar } from "expo-status-bar";
import "./global.css";
import { useFonts } from 'expo-font';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { useEffect } from "react";
import AppNavigator from './src/navigation/AppNavigator';

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
    <TamaguiProvider config={tamaguiConfig}>
      <AppNavigator />
      <StatusBar style="auto" />
    </TamaguiProvider>
  );
}


