import React, { useState, useEffect } from 'react';
import { ScrollView, Image } from 'react-native';
import { Text, YStack, XStack, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { StripeProvider } from '@stripe/stripe-react-native';
import axiosInstance from '../../services/axiosInstance';
import { useAuth } from '../../contexts/AuthContext';
import GlassCard from '../../components/common/GlassCard';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import theme from '../../constants/theme';
import ScreenLayout from '../../components/common/ScreenLayout';
import { useCartStore } from '../../store/cartStore';

export default function CartScreen({ navigation }) {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const cartItems = cart.map(item => ({
        id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        status: item.status || 'available'
      }));

      console.log('Sending cart data:', cartItems);

      const response = await axiosInstance.post('/transactions/create-payment-intent', {
        cart: cartItems
      });
      
      if (response.data.clientSecret) {
        setClientSecret(response.data.clientSecret);
      } else {
        throw new Error(response.data.message || 'Failed to create payment intent');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to initialize checkout'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const cartItems = cart.map(item => ({
        prodId: item._id,
        quantity: item.quantity
      }));

      const response = await axiosInstance.post('/transactions/confirm-payment', {
        paymentIntentId: paymentIntent.id,
        buyerId: user._id,
        cart: cartItems,
        sellerId: cart[0].seller._id
      });

      if (response.data.success) {
        clearCart();
        navigation.navigate('OrderSuccess');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to process order'
      );
    }
  };

  if (cart.length === 0) {
    return (
      <ScreenLayout>
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$4"
        >
          <Ionicons
            name="cart-outline"
            size={64}
            color={theme.colors.text.secondary}
          />
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
            onPress={() => navigation.navigate("Marketplace")}
            marginTop="$6"
            icon={
              <Ionicons
                name="cart"
                size={20}
                color={theme.colors.primary.dark}
              />
            }
          >
            Go to Marketplace
          </Button>
        </YStack>
      </ScreenLayout>
    );
  }

  return (
    <StripeProvider
      publishableKey={process.env.STRIPE_PUBLISHABLE_KEY}
    >
      <ScreenLayout>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack space="$4" padding="$4">
            {/* Header */}
            <YStack space="$2">
              <Text
                color={theme.colors.text.accent}
                fontSize="$8"
                fontWeight="bold"
                style={{
                  textShadowColor: "rgba(0, 0, 0, 0.3)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}
              >
                Your Cart
              </Text>
              <Text color={theme.colors.text.primary} fontSize="$4" opacity={0.9}>
                {cart.length} items in cart
              </Text>
            </YStack>

            {/* Cart Items */}
            <YStack space="$4">
              {cart.map((item) => (
                <GlassCard key={item._id} padding={0} overflow="hidden">
                  <XStack space="$4">
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        width: 100,
                        height: "100%",
                        borderTopLeftRadius: theme.layout.radius.large,
                        borderBottomLeftRadius: theme.layout.radius.large,
                      }}
                      resizeMode="cover"
                    />
                    <YStack flex={1} padding="$4" space="$2">
                      <Text
                        color={theme.colors.text.primary}
                        fontSize="$5"
                        fontWeight="bold"
                      >
                        {item.name}
                      </Text>
                      <Text
                        color={theme.colors.text.accent}
                        fontSize="$4"
                        fontWeight="bold"
                      >
                        PKR.{item.price}
                      </Text>

                      <XStack
                        justifyContent="space-between"
                        alignItems="center"
                        marginTop="$2"
                      >
                        <XStack space="$2" alignItems="center">
                          <Button
                            size="$2"
                            circular
                            backgroundColor={theme.colors.glass.light}
                            onPress={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            icon={
                              <Ionicons
                                name="remove"
                                size={16}
                                color={theme.colors.text.primary}
                              />
                            }
                          />
                          <Text
                            color={theme.colors.text.primary}
                            fontSize="$4"
                            fontWeight="bold"
                          >
                            {item.quantity}
                          </Text>
                          <Button
                            size="$2"
                            circular
                            backgroundColor={theme.colors.glass.light}
                            onPress={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            icon={
                              <Ionicons
                                name="add"
                                size={16}
                                color={theme.colors.text.primary}
                              />
                            }
                          />
                        </XStack>

                        <Button
                          size="$2"
                          backgroundColor={theme.colors.glass.light}
                          color={theme.colors.text.primary}
                          onPress={() => removeFromCart(item._id)}
                          icon={
                            <Ionicons
                              name="trash"
                              size={16}
                              color={theme.colors.text.primary}
                            />
                          }
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
                <Text
                  color={theme.colors.text.primary}
                  fontSize="$6"
                  fontWeight="bold"
                >
                  Order Summary
                </Text>

                <XStack justifyContent="space-between">
                  <Text color={theme.colors.text.secondary} fontSize="$4">
                    Subtotal
                  </Text>
                  <Text
                    color={theme.colors.text.primary}
                    fontSize="$4"
                    fontWeight="bold"
                  >
                    PKR.{getTotalPrice().toFixed(2)}
                  </Text>
                </XStack>

                <XStack justifyContent="space-between">
                  <Text color={theme.colors.text.secondary} fontSize="$4">
                    Shipping
                  </Text>
                  <Text
                    color={theme.colors.text.primary}
                    fontSize="$4"
                    fontWeight="bold"
                  >
                    PKR.0.00
                  </Text>
                </XStack>

                <XStack
                  justifyContent="space-between"
                  paddingTop="$2"
                  borderTopWidth={1}
                  borderColor={theme.colors.glass.border}
                >
                  <Text
                    color={theme.colors.text.primary}
                    fontSize="$5"
                    fontWeight="bold"
                  >
                    Total
                  </Text>
                  <Text
                    color={theme.colors.text.accent}
                    fontSize="$5"
                    fontWeight="bold"
                  >
                    PKR.{getTotalPrice().toFixed(2)}
                  </Text>
                </XStack>

                {clientSecret ? (
                  <CheckoutForm 
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                  />
                ) : (
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
                )}
              </YStack>
            </GlassCard>
          </YStack>
        </ScrollView>
      </ScreenLayout>
    </StripeProvider>
  );
}
