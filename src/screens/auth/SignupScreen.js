import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, YStack, Button, Input, XStack } from 'tamagui';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 bg-white p-4">
      <YStack space="$4" className="mt-20">
        <Text fontSize="$8" fontWeight="bold" className="text-center mb-10">
          Create Account
        </Text>

        <Input
          size="$4"
          borderWidth={2}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          className="bg-gray-50"
        />

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
          Sign Up
        </Button>

        <XStack justifyContent="center" space="$2">
          <Text>Already have an account?</Text>
          <Text
            color="$blue10"
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Text>
        </XStack>
      </YStack>
    </View>
  );
} 