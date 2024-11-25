import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Text, YStack, XStack, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/common/GlassCard';
import theme from '../../constants/theme';
import ScreenLayout from '../../components/common/ScreenLayout';

export default function ARDisplayScreen({ navigation, route }) {
  const [isARReady, setIsARReady] = useState(false);
  const carId = route.params?.carId;

  const carModels = {
    1: { 
      name: 'Tesla Model S', 
      type: 'Electric', 
      color: 'Red',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
      specs: {
        range: '405 miles',
        acceleration: '2.3s 0-60',
        topSpeed: '200 mph'
      }
    },
    2: { 
      name: 'BMW M4', 
      type: 'Sports', 
      color: 'Blue',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738',
      specs: {
        power: '503 hp',
        acceleration: '3.8s 0-60',
        topSpeed: '180 mph'
      }
    },
    3: { 
      name: 'Mercedes G-Wagon', 
      type: 'SUV', 
      color: 'Black',
      image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366',
      specs: {
        power: '416 hp',
        torque: '450 lb-ft',
        terrain: 'All-terrain'
      }
    }
  };

  const selectedCar = carModels[carId] || carModels[1];

  return (
    <ScreenLayout>
      {/* AR View Placeholder */}
      <GlassCard
        style={{
          height: '45%',
          margin: 16,
          marginBottom: 0
        }}
        gradient={theme.colors.gradients.cardDark}
      >
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Image
            source={{ uri: selectedCar.image }}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              opacity: 0.5,
              borderRadius: theme.layout.radius.large
            }}
            resizeMode="cover"
          />
          <Text 
            color={theme.colors.text.primary} 
            fontSize="$6" 
            fontWeight="bold"
            style={{ textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}
          >
            {isARReady ? 'AR Experience Ready' : 'Loading AR Experience...'}
          </Text>
        </YStack>
      </GlassCard>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack space="$4" padding="$4">
          {/* Car Info */}
          <GlassCard padding="$4">
            <YStack space="$4">
              <Text color={theme.colors.text.accent} fontSize="$7" fontWeight="bold">
                {selectedCar.name}
              </Text>
              <XStack space="$4" flexWrap="wrap">
                <Text color={theme.colors.text.primary} fontSize="$4">
                  Type: {selectedCar.type}
                </Text>
                <Text color={theme.colors.text.primary} fontSize="$4">
                  Color: {selectedCar.color}
                </Text>
              </XStack>
              
              {/* Specs */}
              <YStack space="$2" marginTop="$2">
                {Object.entries(selectedCar.specs).map(([key, value]) => (
                  <XStack key={key} justifyContent="space-between" alignItems="center">
                    <Text color={theme.colors.text.secondary} fontSize="$3" textTransform="capitalize">
                      {key}
                    </Text>
                    <Text color={theme.colors.text.primary} fontSize="$4" fontWeight="bold">
                      {value}
                    </Text>
                  </XStack>
                ))}
              </YStack>
            </YStack>
          </GlassCard>

          {/* AR Controls */}
          <GlassCard padding="$4">
            <YStack space="$4">
              <Text color={theme.colors.text.primary} fontSize="$5" fontWeight="bold">
                AR Controls
              </Text>
              
              <XStack space="$4" flexWrap="wrap">
                <Button
                  size="$4"
                  backgroundColor={theme.colors.secondary.yellow}
                  color={theme.colors.primary.dark}
                  icon={<Ionicons name="refresh" size={20} color="black" />}
                  onPress={() => setIsARReady(true)}
                  flex={1}
                >
                  Reset Position
                </Button>

                <Button
                  size="$4"
                  backgroundColor={theme.colors.glass.light}
                  color={theme.colors.text.primary}
                  icon={<Ionicons name="color-palette" size={20} color={theme.colors.text.primary} />}
                  flex={1}
                  borderColor={theme.colors.glass.border}
                  borderWidth={1}
                >
                  Change Color
                </Button>
              </XStack>

              <XStack space="$4" flexWrap="wrap">
                <Button
                  size="$4"
                  backgroundColor={theme.colors.glass.light}
                  color={theme.colors.text.primary}
                  icon={<Ionicons name="resize" size={20} color={theme.colors.text.primary} />}
                  flex={1}
                  borderColor={theme.colors.glass.border}
                  borderWidth={1}
                >
                  Scale Model
                </Button>

                <Button
                  size="$4"
                  backgroundColor={theme.colors.glass.light}
                  color={theme.colors.text.primary}
                  icon={<Ionicons name="camera" size={20} color={theme.colors.text.primary} />}
                  flex={1}
                  borderColor={theme.colors.glass.border}
                  borderWidth={1}
                >
                  Take Photo
                </Button>
              </XStack>
            </YStack>
          </GlassCard>

          {/* Instructions */}
          <GlassCard padding="$4">
            <YStack space="$3">
              <Text color={theme.colors.text.primary} fontSize="$5" fontWeight="bold">
                Instructions
              </Text>
              {[
                'Point your camera at a flat surface',
                'Move your phone slowly to scan the area',
                'Tap to place the car model',
                'Use pinch gestures to resize'
              ].map((instruction, index) => (
                <XStack key={index} space="$2" alignItems="center">
                  <Ionicons 
                    name="checkmark-circle" 
                    size={20} 
                    color={theme.colors.secondary.yellow} 
                  />
                  <Text color={theme.colors.text.secondary} fontSize="$3">
                    {instruction}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </GlassCard>
        </YStack>
      </ScrollView>
    </ScreenLayout>
  );
} 