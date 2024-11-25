import React, { useState } from 'react';
import { ScrollView, Image, Dimensions } from 'react-native';
import { Text, YStack, XStack, Button, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../components/common/GlassCard';
import theme from '../../constants/theme';
import ScreenLayout from '../../components/common/ScreenLayout';

const { width, height } = Dimensions.get('window');

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  const addToCart = async () => {
    try {
      // Add to cart logic will be implemented when backend is ready
      // For now, just navigate to cart
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image with Gradient Overlay */}
        <YStack>
          <Image
            source={{ uri: product.image }}
            style={{
              width: width,
              height: height * 0.4,
            }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', theme.colors.primary.main]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
            }}
          />
        </YStack>

        <YStack space="$4" padding="$4" marginTop="-$8">
          {/* Product Info Card */}
          <GlassCard padding="$4">
            <YStack space="$2">
              <Text color={theme.colors.text.primary} fontSize="$7" fontWeight="bold">
                {product.name}
              </Text>
              
              <XStack justifyContent="space-between" alignItems="center">
                <Text color={theme.colors.text.accent} fontSize="$6" fontWeight="bold">
                  ${product.price}
                </Text>
                <XStack space="$2" alignItems="center">
                  <Ionicons name="star" size={20} color={theme.colors.secondary.yellow} />
                  <Text color={theme.colors.text.primary} fontSize="$4">
                    {product.rating}
                  </Text>
                </XStack>
              </XStack>

              <Text color={theme.colors.text.secondary} fontSize="$4" marginTop="$2">
                {product.description}
              </Text>
            </YStack>
          </GlassCard>

          {/* Specifications Card */}
          <GlassCard padding="$4">
            <YStack space="$4">
              <Text color={theme.colors.text.primary} fontSize="$5" fontWeight="bold">
                Specifications
              </Text>
              
              <XStack justifyContent="space-between">
                <YStack space="$3" flex={1}>
                  <SpecItem 
                    icon="bookmark" 
                    label="Brand" 
                    value={product.brand} 
                  />
                  <SpecItem 
                    icon="apps" 
                    label="Category" 
                    value={product.category} 
                  />
                </YStack>
                
                <YStack space="$3" flex={1}>
                  <SpecItem 
                    icon="cube" 
                    label="Stock" 
                    value={`${product.stock} units`} 
                  />
                  <SpecItem 
                    icon="checkmark-circle" 
                    label="Status" 
                    value={product.status} 
                  />
                </YStack>
              </XStack>
            </YStack>
          </GlassCard>

          {/* Quantity Selection */}
          <GlassCard padding="$4">
            <YStack space="$4">
              <Text color={theme.colors.text.primary} fontSize="$5" fontWeight="bold">
                Quantity
              </Text>
              
              <XStack justifyContent="space-between" alignItems="center">
                <Button
                  size="$4"
                  circular
                  backgroundColor={theme.colors.glass.light}
                  onPress={() => quantity > 1 && setQuantity(q => q - 1)}
                  icon={<Ionicons name="remove" size={24} color={theme.colors.text.primary} />}
                />
                
                <Text 
                  color={theme.colors.text.primary} 
                  fontSize="$6" 
                  fontWeight="bold"
                  marginHorizontal="$4"
                >
                  {quantity}
                </Text>
                
                <Button
                  size="$4"
                  circular
                  backgroundColor={theme.colors.glass.light}
                  onPress={() => quantity < product.stock && setQuantity(q => q + 1)}
                  icon={<Ionicons name="add" size={24} color={theme.colors.text.primary} />}
                />
              </XStack>
            </YStack>
          </GlassCard>

          {/* Add to Cart Button */}
          <Button
            size="$5"
            backgroundColor={theme.colors.secondary.yellow}
            color={theme.colors.primary.dark}
            onPress={addToCart}
            icon={<Ionicons name="cart" size={24} color={theme.colors.primary.dark} />}
            pressStyle={{ opacity: 0.8 }}
          >
            Add to Cart - ${(product.price * quantity).toFixed(2)}
          </Button>
        </YStack>
      </ScrollView>
    </ScreenLayout>
  );
}

// Helper component for specifications
function SpecItem({ icon, label, value }) {
  return (
    <XStack space="$2" alignItems="center">
      <Ionicons name={icon} size={20} color={theme.colors.secondary.yellow} />
      <YStack>
        <Text color={theme.colors.text.secondary} fontSize="$3">
          {label}
        </Text>
        <Text color={theme.colors.text.primary} fontSize="$4" fontWeight="bold">
          {value}
        </Text>
      </YStack>
    </XStack>
  );
} 