import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Text, YStack, XStack, Button, Input, Label } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/common/GlassCard';
import theme from '../../constants/theme';
import ScreenLayout from '../../components/common/ScreenLayout';

export default function CheckoutScreen({ route, navigation }) {
  // Add these states when implementing backend
  // const [clientSecret, setClientSecret] = useState(route.params?.clientSecret);
  // const [orderDetails, setOrderDetails] = useState(route.params?.orderDetails);
  // const [shippingAddress, setShippingAddress] = useState(null);
  // const [paymentStatus, setPaymentStatus] = useState('pending');

  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [errors, setErrors] = useState({});

  // Will be implemented when backend is ready
  const handlePayment = async () => {
    setLoading(true);
    try {
      /* 
      BACKEND INTEGRATION:
      1. Validate payment details
      if (!validatePaymentDetails()) {
        setLoading(false);
        return;
      }

      2. Confirm Stripe payment
      const { error, paymentIntent } = await stripe.confirmPayment(clientSecret, {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: {
            name: paymentDetails.name,
          },
        },
        return_url: `${YOUR_DOMAIN}/order-success`,
      });

      3. Handle payment result
      if (error) {
        setErrors({ payment: error.message });
        return;
      }

      4. Create order in backend
      const orderResponse = await axiosInstance.post('/orders/create', {
        paymentIntentId: paymentIntent.id,
        items: orderDetails.items,
        total: orderDetails.total,
        shipping: orderDetails.shipping,
        shippingAddress,
      });

      Expected response:
      {
        success: boolean,
        order: {
          _id: string,
          status: string,
          items: Array<{
            product: Product,
            quantity: number
          }>,
          total: number,
          createdAt: Date
        }
      }
      */

      // Simulate payment processing
      setTimeout(() => {
        navigation.navigate('OrderSuccess');
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
      setErrors({ payment: 'Payment failed. Please try again.' });
    }
  };

  // Add validation function for payment details
  const validatePaymentDetails = () => {
    const newErrors = {};
    
    if (!paymentDetails.name) {
      newErrors.name = 'Name is required';
    }

    if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length < 16) {
      newErrors.cardNumber = 'Valid card number is required';
    }

    if (!paymentDetails.expiry || !paymentDetails.expiry.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiry = 'Valid expiry date (MM/YY) is required';
    }

    if (!paymentDetails.cvc || paymentDetails.cvc.length < 3) {
      newErrors.cvc = 'Valid CVC is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <ScreenLayout>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <YStack space="$4" padding="$4">
          {/* Header */}
          <YStack space="$2">
            <Text 
              color={theme.colors.text.accent} 
              fontSize="$8" 
              fontWeight="bold"
              className="text-shadow"
            >
              Checkout
            </Text>
            <Text 
              color={theme.colors.text.primary} 
              fontSize="$4" 
              opacity={0.9}
              className="mb-4"
            >
              Complete your purchase
            </Text>
          </YStack>

          {/* Payment Form */}
          <GlassCard padding="$4">
            <YStack space="$4">
              <Text 
                color={theme.colors.text.primary} 
                fontSize="$6" 
                fontWeight="bold"
                className="mb-2"
              >
                Payment Details
              </Text>

              {/* Card Name */}
              <YStack space="$2">
                <Label htmlFor="cardName" color={theme.colors.text.primary}>
                  Name on Card
                </Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={paymentDetails.name}
                  onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, name: text }))}
                  backgroundColor={theme.colors.glass.light}
                  borderColor={theme.colors.glass.border}
                  color={theme.colors.text.primary}
                  className="h-12 rounded-xl"
                />
              </YStack>

              {/* Card Number */}
              <YStack space="$2">
                <Label htmlFor="cardNumber" color={theme.colors.text.primary}>
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={paymentDetails.cardNumber}
                  onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, cardNumber: text }))}
                  backgroundColor={theme.colors.glass.light}
                  borderColor={theme.colors.glass.border}
                  color={theme.colors.text.primary}
                  className="h-12 rounded-xl"
                />
              </YStack>

              {/* Expiry and CVC */}
              <XStack space="$4">
                <YStack space="$2" flex={1}>
                  <Label htmlFor="expiry" color={theme.colors.text.primary}>
                    Expiry Date
                  </Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={paymentDetails.expiry}
                    onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, expiry: text }))}
                    backgroundColor={theme.colors.glass.light}
                    borderColor={theme.colors.glass.border}
                    color={theme.colors.text.primary}
                    className="h-12 rounded-xl"
                  />
                </YStack>

                <YStack space="$2" flex={1}>
                  <Label htmlFor="cvc" color={theme.colors.text.primary}>
                    CVC
                  </Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={paymentDetails.cvc}
                    onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, cvc: text }))}
                    backgroundColor={theme.colors.glass.light}
                    borderColor={theme.colors.glass.border}
                    color={theme.colors.text.primary}
                    className="h-12 rounded-xl"
                  />
                </YStack>
              </XStack>
            </YStack>
          </GlassCard>

          {/* Payment Button */}
          <Button
            size="$5"
            backgroundColor={theme.colors.secondary.yellow}
            color={theme.colors.primary.dark}
            onPress={handlePayment}
            disabled={loading}
            icon={<Ionicons name="card" size={24} color={theme.colors.primary.dark} />}
            className="mt-4 rounded-xl"
          >
            {loading ? 'Processing Payment...' : 'Pay Now'}
          </Button>

          {/* Security Note */}
          <XStack 
            space="$2" 
            alignItems="center" 
            justifyContent="center"
            className="mt-4"
          >
            <Ionicons name="lock-closed" size={16} color={theme.colors.text.secondary} />
            <Text 
              color={theme.colors.text.secondary} 
              fontSize="$3"
              textAlign="center"
            >
              Secure payment powered by Stripe
            </Text>
          </XStack>
        </YStack>
      </ScrollView>
    </ScreenLayout>
  );
} 