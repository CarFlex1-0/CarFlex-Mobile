import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, YStack, Button, XStack } from 'tamagui';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../common/GlassCard';
import theme from '../../constants/theme';

export default function CheckoutForm({ clientSecret, onSuccess }) {
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodOptions: {
          card: {
            setupFutureUsage: 'off',
          },
        },
      });

      if (error) {
        console.error('Payment error:', error);
        setError(error.message);
      } else if (paymentIntent) {
        console.log('Payment success:', paymentIntent);
        if (paymentIntent.status === 'Succeeded') {
          await onSuccess(paymentIntent);
        } else {
          console.log('Payment status:', paymentIntent.status);
          setError(`Payment not completed. Status: ${paymentIntent.status}`);
        }
      }
    } catch (e) {
      console.error('Payment processing error:', e);
      setError('An unexpected error occurred during payment processing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack space="$4">
      <GlassCard padding="$4">
        <YStack space="$4">
          {/* Card Input Header */}
          <XStack space="$2" alignItems="center">
            <Ionicons name="card" size={24} color={theme.colors.text.primary} />
            <Text color={theme.colors.text.primary} fontSize="$5" fontWeight="bold">
              Card Details
            </Text>
          </XStack>

          {/* Card Input Field */}
          <View style={styles.cardFieldContainer}>
            <CardField
              postalCodeEnabled={false}
              style={styles.cardField}
              cardStyle={{
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
                borderColor: '#CCCCCC',
                borderWidth: 1,
                borderRadius: 12,
              }}
            />
          </View>

          {/* Security Note */}
          <XStack space="$2" alignItems="center" opacity={0.7}>
            <Ionicons 
              name="lock-closed" 
              size={16} 
              color={theme.colors.text.secondary} 
            />
            <Text 
              color={theme.colors.text.secondary} 
              fontSize="$3"
            >
              Your payment information is secure
            </Text>
          </XStack>
        </YStack>
      </GlassCard>

      {/* Error Message */}
      {error && (
        <YStack 
          backgroundColor={`${theme.colors.secondary.red}20`}
          padding="$3"
          borderRadius="$2"
        >
          <Text 
            color={theme.colors.secondary.red} 
            fontSize="$3" 
            textAlign="center"
          >
            {error}
          </Text>
        </YStack>
      )}

      {/* Pay Button */}
      <Button
        size="$5"
        backgroundColor={theme.colors.secondary.yellow}
        color={theme.colors.primary.dark}
        onPress={handlePayment}
        disabled={loading}
        pressStyle={{ opacity: 0.8 }}
        icon={
          loading ? null : 
          <Ionicons 
            name="shield-checkmark" 
            size={20} 
            color={theme.colors.primary.dark} 
          />
        }
      >
        {loading ? 'Processing Payment...' : 'Pay Securely Now'}
      </Button>

      {/* Accepted Cards */}
      <XStack justifyContent="center" space="$2" opacity={0.7}>
        <Ionicons name="card" size={20} color={theme.colors.text.secondary} />
        <Text color={theme.colors.text.secondary} fontSize="$3">
          We accept all major credit & debit cards
        </Text>
      </XStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  cardFieldContainer: {
    width: '100%',
    minHeight: 50,
    marginVertical: 8,
  },
  cardField: {
    width: '100%',
    height: 50,
  },
}); 