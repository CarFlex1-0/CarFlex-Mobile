import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import theme from "../constants/theme";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";

// App Screens
import DashboardScreen from "../screens/app/DashboardScreen";
import OBDSetupScreen from "../screens/app/OBDSetupScreen";
import ARDisplayScreen from "../screens/app/ARDisplayScreen";
import MarketplaceScreen from "../screens/app/MarketplaceScreen";
import CartScreen from "../screens/app/CartScreen";
import ProductDetailsScreen from "../screens/app/ProductDetailsScreen";
import CheckoutScreen from "../screens/app/CheckoutScreen";
import OrderSuccessScreen from "../screens/app/OrderSuccessScreen";
import OrderHistoryScreen from "../screens/app/OrderHistoryScreen";
// import ProfileScreen from '../screens/app/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Dashboard":
              iconName = focused ? "speedometer" : "speedometer-outline";
              break;
            case "Marketplace":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "Cart":
              iconName = focused ? "basket" : "basket-outline";
              break;
            case "Orders":
              iconName = focused ? "list" : "list-outline";
              break;
          }

          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? `${theme.colors.secondary.yellow}20` : 'transparent',
                padding: 8,
                borderRadius: 12,
                width: size * 2,
                height: size * 2,
              }}
            >
              <Ionicons name={iconName} size={size} color={focused ? theme.colors.secondary.yellow : color} />
            </View>
          );
        },
        tabBarStyle: {
          backgroundColor: theme.colors.primary.main,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.secondary.yellow,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -4,
        },
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Marketplace" 
        component={MarketplaceScreen}
        options={{
          tabBarLabel: 'Shop',
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrderHistoryScreen}
        options={{
          tabBarLabel: 'Orders',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Auth Stack */}
      <Stack.Group>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Group>

      {/* App Stack */}
      <Stack.Group>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="OBDSetup" component={OBDSetupScreen} />
        <Stack.Screen name="ARDisplay" component={ARDisplayScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
