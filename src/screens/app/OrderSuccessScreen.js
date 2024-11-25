import React, { useEffect } from 'react';
import { Dimensions, Animated, Easing } from 'react-native';
import { Text, YStack, XStack, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/common/GlassCard';
import theme from '../../constants/theme';
import ScreenLayout from '../../components/common/ScreenLayout';

const { width } = Dimensions.get('window');

// Helper component for order details
function XStackDetail({ label, value }) {
  return (
    <XStack 
      justifyContent="space-between" 
      alignItems="center"
      paddingVertical="$2"
      borderBottomWidth={1}
      borderBottomColor={theme.colors.glass.border}
      className="w-full"
    >
      <Text 
        color={theme.colors.text.secondary} 
        fontSize="$3"
        className="flex-1"
      >
        {label}
      </Text>
      <Text 
        color={theme.colors.text.primary} 
        fontSize="$4" 
        fontWeight="bold"
        className="flex-shrink-0"
      >
        {value}
      </Text>
    </XStack>
  );
}

export default function OrderSuccessScreen({ route, navigation }) {
  // Add these states when implementing backend
  // const [orderDetails, setOrderDetails] = useState(null);
  // const [loading, setLoading] = useState(true);

  // Animation values
  const checkmarkScale = new Animated.Value(0);
  const checkmarkOpacity = new Animated.Value(0);

  useEffect(() => {
    /* 
    BACKEND INTEGRATION:
    const fetchOrderDetails = async () => {
      try {
        // Get order ID from route params or payment intent
        const orderId = route.params?.orderId;
        const response = await axiosInstance.get(`/orders/${orderId}`);

        Expected response:
        {
          order: {
            _id: string,
            items: Array<{
              product: Product,
              quantity: number
            }>,
            total: number,
            status: string,
            shippingAddress: Object,
            createdAt: Date,
            estimatedDelivery: Date
          }
        }

        setOrderDetails(response.data.order);
      } catch (error) {
        console.error('Error fetching order details:', error);
        // Handle error - maybe navigate back to cart
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
    */

    // Animate checkmark
    Animated.sequence([
      Animated.timing(checkmarkScale, {
        toValue: 1.2,
        duration: 400,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.spring(checkmarkScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(checkmarkOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Helper function to format dates
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ScreenLayout>
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <GlassCard 
          padding="$6"
          width={width * 0.9}
          className="items-center"
        >
          {/* Animated Checkmark */}
          <Animated.View
            style={{
              transform: [{ scale: checkmarkScale }],
              opacity: checkmarkOpacity,
              backgroundColor: theme.colors.secondary.yellow,
              borderRadius: 50,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <Ionicons 
              name="checkmark" 
              size={48} 
              color={theme.colors.primary.dark}
            />
          </Animated.View>

          <Text 
            color={theme.colors.text.primary}
            fontSize="$8"
            fontWeight="bold"
            textAlign="center"
            className="mb-2"
          >
            Order Successful!
          </Text>

          <Text
            color={theme.colors.text.secondary}
            fontSize="$4"
            textAlign="center"
            className="mb-6"
          >
            Your order has been placed successfully
          </Text>

          {/* Order Details */}
          <YStack space="$2" width="100%" className="mb-6">
            <XStackDetail 
              label="Order Number"
              value="#ORD123456"
            />
            <XStackDetail 
              label="Order Date"
              value={new Date().toLocaleDateString()}
            />
            <XStackDetail 
              label="Estimated Delivery"
              value={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            />
          </YStack>

          {/* Action Buttons - Updated navigation */}
          <YStack space="$3" width="100%">
            <Button
              size="$4"
              backgroundColor={theme.colors.secondary.yellow}
              color={theme.colors.primary.dark}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Dashboard' })}
              icon={<Ionicons name="home" size={20} color={theme.colors.primary.dark} />}
              className="rounded-xl"
            >
              Back to Home
            </Button>

            <Button
              size="$4"
              backgroundColor={theme.colors.glass.light}
              color={theme.colors.text.primary}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Marketplace' })}
              icon={<Ionicons name="cart" size={20} color={theme.colors.text.primary} />}
              borderColor={theme.colors.glass.border}
              borderWidth={1}
              className="rounded-xl"
            >
              Continue Shopping
            </Button>
          </YStack>
        </GlassCard>
      </YStack>
    </ScreenLayout>
  );
} 