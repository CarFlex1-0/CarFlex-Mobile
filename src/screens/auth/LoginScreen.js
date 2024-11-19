import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, YStack, Button, Input, XStack } from 'tamagui';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 bg-white p-4">
      <YStack space="$4" className="mt-20">
        <Text fontSize="$8" fontWeight="bold" className="text-center mb-10">
          Welcome Back
        </Text>

        <Input
          size="$4"
          borderWidth={2}
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          className="bg-gray-50"
        />

        <Input
          size="$4"
          borderWidth={2}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="bg-gray-50"
        />

        <Button
          size="$4"
          theme="blue"
          onPress={() => navigation.navigate('Home')}
          className="mt-4"
        >
          Login
        </Button>

        <XStack justifyContent="center" space="$2">
          <Text>Don't have an account?</Text>
          <Text
            color="$blue10"
            onPress={() => navigation.navigate('Signup')}
          >
            Sign Up
          </Text>
        </XStack>
      </YStack>
    </View>
  );
} 