import React from 'react';
import { View, Image, Dimensions, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { Text, YStack, Button, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/common/GlassCard';
import theme from '../../constants/theme';
import ScreenLayout from '../../components/common/ScreenLayout';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ARDisplayScreen({ navigation, route }) {
  const carId = route.params?.carId;

  const carModels = {
    1: {
      name: "Toyota Corolla",
      type: "Sedan",
      image: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?q=80&w=2070&auto=format&fit=crop",
      specs: {
        engine: "1.8L 4-Cylinder",
        power: "169 hp",
        transmission: "CVT"
      }
    },
    2: {
      name: "Suzuki Swift",
      type: "Hatchback",
      image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2090&auto=format&fit=crop",
      specs: {
        engine: "1.2L 4-Cylinder",
        power: "82 hp",
        transmission: "5-Speed Manual"
      }
    },
    3: {
      name: "Honda Civic Type R",
      type: "Sports Sedan",
      image: "https://images.unsplash.com/photo-1679263422551-159662623af3?q=80&w=2070&auto=format&fit=crop",
      specs: {
        engine: "2.0L Turbo",
        power: "315 hp",
        transmission: "6-Speed Manual"
      }
    }
  };

  const selectedCar = carModels[carId];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary.dark }}>
      <StatusBar barStyle="light-content" />
      
      {/* Back Button */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: 20,
          padding: 8,
        }}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Main Image Container - Fixed at top */}
      <View style={{ height: height * 0.45, position: 'absolute', top: 0, left: 0, right: 0 }}>
        <Image
          source={{ uri: selectedCar.image }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent', theme.colors.primary.dark]}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={{ flex: 1, marginTop: height * 0.4 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Content Container */}
        <View style={{
          backgroundColor: theme.colors.primary.dark,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          minHeight: height * 0.6,
          padding: 20,
          paddingBottom: 40,
        }}>
          {/* Car Details */}
          <YStack space="$4">
            <YStack space="$2">
              <Text
                color={theme.colors.text.primary}
                fontSize={32}
                fontWeight="bold"
                letterSpacing={0.5}
              >
                {selectedCar.name}
              </Text>
              <Text
                color={theme.colors.secondary.yellow}
                fontSize={18}
              >
                {selectedCar.type}
              </Text>
            </YStack>

            {/* Specs Cards */}
            <XStack flexWrap="wrap" gap="$2" justifyContent="space-between">
              {Object.entries(selectedCar.specs).map(([key, value]) => (
                <GlassCard
                  key={key}
                  padding="$3"
                  width={(width - 60) / 3}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text
                    color={theme.colors.secondary.yellow}
                    fontSize={10}
                    textTransform="uppercase"
                    marginBottom={4}
                  >
                    {key}
                  </Text>
                  <Text
                    color="white"
                    fontSize={14}
                    fontWeight="bold"
                    textAlign="center"
                  >
                    {value}
                  </Text>
                </GlassCard>
              ))}
            </XStack>

            {/* Premium Message */}
            <GlassCard 
              marginTop="$6"
              padding="$4"
              alignItems="center"
              space="$3"
            >
              <View style={{
                backgroundColor: `${theme.colors.secondary.yellow}20`,
                padding: 12,
                borderRadius: 30,
                marginBottom: 8,
              }}>
                <Ionicons 
                  name="lock-closed" 
                  size={24} 
                  color={theme.colors.secondary.yellow}
                />
              </View>
              <Text
                color="white"
                fontSize={20}
                fontWeight="bold"
                textAlign="center"
              >
                Unlock AR Experience
              </Text>
              <Text
                color={theme.colors.text.secondary}
                fontSize={14}
                textAlign="center"
                marginBottom={8}
              >
                Get premium access to view this model in augmented reality
              </Text>
              <Button
                backgroundColor={theme.colors.secondary.yellow}
                color={theme.colors.primary.dark}
                size="$5"
                width="100%"
                onPress={() => navigation.navigate('Subscription')}
                pressStyle={{ opacity: 0.8 }}
                icon={<Ionicons name="star" size={18} color={theme.colors.primary.dark} />}
              >
                Upgrade to Premium
              </Button>
            </GlassCard>
          </YStack>
        </View>
      </ScrollView>
    </View>
  );
} 