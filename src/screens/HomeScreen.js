import React from 'react';
import { View } from 'react-native';
import { Text, YStack, Button } from 'tamagui';

export default function HomeScreen({ navigation }) {
  return (
    <View className="flex-1  bg-slate-700 justify-center items-center">
      <YStack space="$4">
        <Text fontSize="$6">Welcome Home!</Text>
        <Button
          size="$4"
          onPress={() => navigation.navigate('Login')}
        >
          Get Started
        </Button>
      </YStack>
    </View>
  );
} 