import React from 'react';
import { SafeAreaView, StatusBar, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScreenLayout({ children }) {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight;

  return (
    <View style={{ flex: 1, backgroundColor: '#1e3a8a' }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={{ height: statusBarHeight }} />
      <LinearGradient
        colors={['#1e3a8a', '#312e81', '#1e1b4b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 10 : 0 }}>
          {children}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
} 