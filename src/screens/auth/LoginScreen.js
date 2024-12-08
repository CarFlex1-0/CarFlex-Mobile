import React, { useState, useMemo, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Platform,
} from "react-native";
import {
  Text,
  YStack,
  Button,
  Input,
  XStack,
  Label,
  AlertDialog,
} from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { height, width } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: "",
    message: "",
  });
  const { login, loading, setLoading } = useAuth();

  const inputIds = useMemo(
    () => ({
      email: `login-email-${Date.now()}`,
      password: `login-password-${Date.now()}`,
    }),
    []
  );

  const showAlert = (title, message) => {
    setAlertConfig({ show: true, title, message });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      showAlert("Validation Error", "Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/user/login", {
        email: email.toLowerCase(),
        password,
      });

      if (response.data && response.data.success) {
        await login(response.data);
        showAlert("Success", "Login successful!");
        navigation.navigate("MainTabs");
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert(
        "Error", 
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let keyboardDidShow;
    let keyboardDidHide;

    const unsubscribe = navigation.addListener("focus", () => {
      setErrors({});

      keyboardDidShow = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
        (e) => {}
      );

      keyboardDidHide = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
        () => {}
      );
    });

    const blurSubscribe = navigation.addListener("blur", () => {
      keyboardDidShow?.remove();
      keyboardDidHide?.remove();
    });

    return () => {
      unsubscribe();
      blurSubscribe();
      keyboardDidShow?.remove();
      keyboardDidHide?.remove();
    };
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#1e3a8a", "#312e81", "#1e1b4b"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={Platform.OS === "ios" ? 100 : 20}
        enableResetScrollToCoords={false}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <YStack
              space="$4"
              px="$6"
              style={{
                paddingTop: height * 0.15,
                flex: 1,
                justifyContent: "center",
              }}
            >
              <YStack space="$2" mb="$6">
                <Text
                  color="$yellow400"
                  fontSize="$10"
                  fontWeight="bold"
                  textAlign="center"
                >
                  Welcome Back
                </Text>
                <Text
                  color="white"
                  fontSize="$4"
                  textAlign="center"
                  opacity={0.8}
                >
                  Sign in to continue your journey
                </Text>
              </YStack>

              <YStack space="$4" mb="$6">
                <YStack space="$2">
                  <Label htmlFor={inputIds.email} color="white">
                    Email Address
                  </Label>
                  <Input
                    id={inputIds.email}
                    size="$4"
                    borderWidth={2}
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setErrors({ ...errors, email: null });
                    }}
                    backgroundColor="$gray100"
                    borderColor={errors.email ? "$red8" : "$yellow400"}
                    focusStyle={{ borderColor: "$yellow500" }}
                  />
                  {errors.email && (
                    <Text
                      color="$red8"
                      fontSize="$4"
                      fontWeight="bold"
                      paddingLeft="$2"
                    >
                      {errors.email}
                    </Text>
                  )}
                </YStack>

                <YStack space="$2">
                  <Label htmlFor={inputIds.password} color="white">
                    Password
                  </Label>
                  <Input
                    id={inputIds.password}
                    size="$4"
                    borderWidth={2}
                    placeholder="Enter your password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setErrors({ ...errors, password: null });
                    }}
                    backgroundColor="$gray100"
                    borderColor={errors.password ? "$red8" : "$yellow400"}
                    focusStyle={{ borderColor: "$yellow500" }}
                  />
                  {errors.password && (
                    <Text
                      color="$red8"
                      fontSize="$4"
                      fontWeight="bold"
                      paddingLeft="$2"
                    >
                      {errors.password}
                    </Text>
                  )}
                </YStack>

                <XStack justifyContent="flex-end">
                  <Text
                    color="$yellow400"
                    fontSize="$3"
                    fontWeight="bold"
                    onPress={() => navigation.navigate("ForgotPassword")}
                    pressStyle={{ opacity: 0.8 }}
                  >
                    Forgot Password?
                  </Text>
                </XStack>
              </YStack>

              <Button
                size="$4"
                backgroundColor="$yellow400"
                color="$gray900"
                pressStyle={{ opacity: 0.8 }}
                disabled={loading}
                onPress={handleLogin}
                borderRadius="$4"
              >
                {loading ? <ActivityIndicator color="$gray900" /> : "Login"}
              </Button>

              <XStack justifyContent="center" space="$2" mt="$4">
                <Text color="white">Don't have an account?</Text>
                <Text
                  color="$yellow400"
                  fontWeight="bold"
                  onPress={() => navigation.navigate("Signup")}
                  pressStyle={{ opacity: 0.8 }}
                >
                  Sign Up
                </Text>
              </XStack>
            </YStack>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>

      <AlertDialog
        open={alertConfig.show}
        onOpenChange={(open) =>
          setAlertConfig((prev) => ({ ...prev, show: open }))
        }
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            bordered
            elevate
            key="content"
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
          >
            <YStack space>
              <AlertDialog.Title>{alertConfig.title}</AlertDialog.Title>
              <AlertDialog.Description>
                {alertConfig.message}
              </AlertDialog.Description>

              <XStack gap="$3" justifyContent="flex-end">
                <AlertDialog.Action asChild>
                  <Button
                    theme="active"
                    onPress={() =>
                      setAlertConfig((prev) => ({ ...prev, show: false }))
                    }
                  >
                    OK
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </LinearGradient>
  );
}
