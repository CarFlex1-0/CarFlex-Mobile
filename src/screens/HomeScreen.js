import React from 'react';
import { View } from 'react-native';
import { Text, YStack, Button } from 'tamagui';

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center">
      <YStack space="$4">
        <Text fontSize="$6">Welcome Home!</Text>
        <Button size="$4">Get Started</Button>
      </YStack>
    </View>
  );
} 