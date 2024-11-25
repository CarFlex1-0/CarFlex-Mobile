import React, { useState } from 'react';
import { ScrollView, Image } from 'react-native';
import { Text, YStack, XStack, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/common/GlassCard';
import theme from '../../constants/theme';
import ScreenLayout from '../../components/common/ScreenLayout';

// Temporary mock cart data
const MOCK_CART = [
  {
    _id: '1',
    name: 'Performance Exhaust System',
    price: 599.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1600706432502-77a0e2e32771'
  },
  {
    _id: '2',
    name: 'LED Headlight Kit',
    price: 299.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1600705722908-bab2e7fef916'
  }
];

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState(MOCK_CART);
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const fetchCart = async () => {
    try {
      /* 
      BACKEND INTEGRATION:
      const response = await axiosInstance.get('/cart');

      Expected response:
      {
        items: Array<{
          product: Product,
          quantity: number
        }>,
        total: number,
        shippingCost: number
      }

      setCartItems(response.data.items);
      setCartTotal(response.data.total);
      setShippingCost(response.data.shippingCost);
      */
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      /* 
      BACKEND INTEGRATION:
      const response = await axiosInstance.put(`/cart/update`, {
        productId: itemId,
        quantity: newQuantity
      });

      Expected response:
      {
        success: boolean,
        cart: {
          items: Array<{
            product: Product,
            quantity: number
          }>,
          total: number
        }
      }
      */

      // Remove this when backend is ready
      if (newQuantity < 1) {
        removeItem(itemId);
        return;
      }
      setCartItems(items =>
        items.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = (itemId) => {
    setCartItems(items => items.filter(item => item._id !== itemId));
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      /* 
      BACKEND INTEGRATION:
      1. Create payment intent
      const response = await axiosInstance.post('/transactions/create-payment-intent', {
        cartItems,
        shippingDetails: {
          address: user.address,
          // Add other shipping details
        }
      });

      2. Navigate to checkout with payment intent
      navigation.navigate('Checkout', { 
        clientSecret: response.data.clientSecret,
        orderDetails: {
          items: cartItems,
          total: calculateTotal(),
          shipping: shippingCost
        }
      });
      */

      // Remove this when backend is ready
      setTimeout(() => {
        navigation.navigate('OrderSuccess');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <ScreenLayout>
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
          <Ionicons name="cart-outline" size={64} color={theme.colors.text.secondary} />
          <Text 
            color={theme.colors.text.primary} 
            fontSize="$6" 
            fontWeight="bold"
            textAlign="center"
            marginTop="$4"
          >
            Your cart is empty
          </Text>
          <Text 
            color={theme.colors.text.secondary} 
            fontSize="$4"
            textAlign="center"
            marginTop="$2"
          >
            Browse our marketplace to find amazing car parts
          </Text>
          <Button
            size="$4"
            backgroundColor={theme.colors.secondary.yellow}
            color={theme.colors.primary.dark}
            onPress={() => navigation.navigate('Marketplace')}
            marginTop="$6"
            icon={<Ionicons name="cart" size={20} color={theme.colors.primary.dark} />}
          >
            Go to Marketplace
          </Button>
        </YStack>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack space="$4" padding="$4">
          {/* Header */}
          <YStack space="$2">
            <Text 
              color={theme.colors.text.accent} 
              fontSize="$8" 
              fontWeight="bold"
              style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}
            >
              Your Cart
            </Text>
            <Text color={theme.colors.text.primary} fontSize="$4" opacity={0.9}>
              {cartItems.length} items in cart
            </Text>
          </YStack>

          {/* Cart Items */}
          <YStack space="$4">
            {cartItems.map(item => (
              <GlassCard
                key={item._id}
                padding={0}
                overflow="hidden"
              >
                <XStack space="$4">
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: 100,
                      height: '100%',
                      borderTopLeftRadius: theme.layout.radius.large,
                      borderBottomLeftRadius: theme.layout.radius.large
                    }}
                    resizeMode="cover"
                  />
                  <YStack flex={1} padding="$4" space="$2">
                    <Text color={theme.colors.text.primary} fontSize="$5" fontWeight="bold">
                      {item.name}
                    </Text>
                    <Text color={theme.colors.text.accent} fontSize="$4" fontWeight="bold">
                      ${item.price}
                    </Text>
                    
                    <XStack justifyContent="space-between" alignItems="center" marginTop="$2">
                      <XStack space="$2" alignItems="center">
                        <Button
                          size="$2"
                          circular
                          backgroundColor={theme.colors.glass.light}
                          onPress={() => updateQuantity(item._id, item.quantity - 1)}
                          icon={<Ionicons name="remove" size={16} color={theme.colors.text.primary} />}
                        />
                        <Text color={theme.colors.text.primary} fontSize="$4" fontWeight="bold">
                          {item.quantity}
                        </Text>
                        <Button
                          size="$2"
                          circular
                          backgroundColor={theme.colors.glass.light}
                          onPress={() => updateQuantity(item._id, item.quantity + 1)}
                          icon={<Ionicons name="add" size={16} color={theme.colors.text.primary} />}
                        />
                      </XStack>
                      
                      <Button
                        size="$2"
                        backgroundColor={theme.colors.glass.light}
                        color={theme.colors.text.primary}
                        onPress={() => removeItem(item._id)}
                        icon={<Ionicons name="trash" size={16} color={theme.colors.text.primary} />}
                      >
                        Remove
                      </Button>
                    </XStack>
                  </YStack>
                </XStack>
              </GlassCard>
            ))}
          </YStack>

          {/* Summary */}
          <GlassCard padding="$4">
            <YStack space="$4">
              <Text color={theme.colors.text.primary} fontSize="$6" fontWeight="bold">
                Order Summary
              </Text>
              
              <XStack justifyContent="space-between">
                <Text color={theme.colors.text.secondary} fontSize="$4">Subtotal</Text>
                <Text color={theme.colors.text.primary} fontSize="$4" fontWeight="bold">
                  ${calculateTotal().toFixed(2)}
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text color={theme.colors.text.secondary} fontSize="$4">Shipping</Text>
                <Text color={theme.colors.text.primary} fontSize="$4" fontWeight="bold">
                  $0.00
                </Text>
              </XStack>

              <XStack 
                justifyContent="space-between" 
                paddingTop="$2" 
                borderTopWidth={1} 
                borderColor={theme.colors.glass.border}
              >
                <Text color={theme.colors.text.primary} fontSize="$5" fontWeight="bold">
                  Total
                </Text>
                <Text color={theme.colors.text.accent} fontSize="$5" fontWeight="bold">
                  ${calculateTotal().toFixed(2)}
                </Text>
              </XStack>

              <Button
                size="$4"
                backgroundColor={theme.colors.secondary.yellow}
                color={theme.colors.primary.dark}
                onPress={handleCheckout}
                icon={<Ionicons name="card" size={20} color={theme.colors.primary.dark} />}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
            </YStack>
          </GlassCard>
        </YStack>
      </ScrollView>
    </ScreenLayout>
  );
} 