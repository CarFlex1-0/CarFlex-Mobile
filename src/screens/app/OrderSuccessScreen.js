import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, Animated, Easing, View, ScrollView, RefreshControl } from 'react-native';
import { Text, YStack, Button } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/common/GlassCard';
import theme from '../../constants/theme';
import ScreenLayout from '../../components/common/ScreenLayout';
import { useCartStore } from '../../store/cartStore';

const { width } = Dimensions.get('window');

export default function OrderSuccessScreen({ navigation }) {
  // Create refs for animations to persist between renders
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;
  const { clearCart } = useCartStore();
  const [refreshing, setRefreshing] = useState(false);

  const animateCheckmark = () => {
    // Reset animation values
    checkmarkScale.setValue(0);
    checkmarkOpacity.setValue(0);

    // Run animations in sequence
    Animated.sequence([
      // First fade in
      Animated.timing(checkmarkOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      // Then scale up with bounce
      Animated.spring(checkmarkScale, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    clearCart();
    // Delay animation slightly to ensure component is mounted
    setTimeout(animateCheckmark, 100);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    animateCheckmark();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.secondary.yellow}
            colors={[theme.colors.secondary.yellow]}
            progressBackgroundColor={theme.colors.glass.light}
            progressViewOffset={20}
            title="Pull to refresh animation"
            titleColor={theme.colors.text.primary}
          />
        }
      >
        <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
          <GlassCard padding="$6" width={width * 0.9}>
            <YStack alignItems="center" space="$4">
              {/* Checkmark Container */}
              <Animated.View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: theme.colors.secondary.yellow,
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [{ scale: checkmarkScale }],
                  opacity: checkmarkOpacity,
                  marginBottom: 20,
                }}
              >
                <Ionicons 
                  name="checkmark-sharp" 
                  size={50} 
                  color={theme.colors.primary.dark}
                />
              </Animated.View>

              <Text
                color={theme.colors.text.primary}
                fontSize="$8"
                fontWeight="bold"
                textAlign="center"
              >
                Payment Successful!
              </Text>

              <Text
                color={theme.colors.text.secondary}
                fontSize="$4"
                textAlign="center"
              >
                Your order has been placed successfully
              </Text>

              <YStack space="$4" width="100%" marginTop="$6">
                <Button
                  size="$4"
                  backgroundColor={theme.colors.secondary.yellow}
                  color={theme.colors.primary.dark}
                  onPress={() => navigation.navigate('MainTabs', { screen: 'Dashboard' })}
                  icon={<Ionicons name="home" size={20} color={theme.colors.primary.dark} />}
                  pressStyle={{ opacity: 0.8 }}
                >
                  Go to Dashboard
                </Button>

                <Button
                  size="$4"
                  backgroundColor={theme.colors.glass.light}
                  color={theme.colors.text.primary}
                  onPress={() => navigation.navigate('MainTabs', { screen: 'Marketplace' })}
                  icon={<Ionicons name="cart" size={20} color={theme.colors.text.primary} />}
                  pressStyle={{ opacity: 0.8 }}
                >
                  Continue Shopping
                </Button>
              </YStack>
            </YStack>
          </GlassCard>
        </YStack>
      </ScrollView>
    </ScreenLayout>
  );
} 