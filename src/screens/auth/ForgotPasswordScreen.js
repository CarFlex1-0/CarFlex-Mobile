import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { height } = Dimensions.get("window");

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: "",
    message: "",
  });

  const showAlert = (title, message) => {
    setAlertConfig({ show: true, title, message });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showAlert("Validation Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/user/forgot-password", {
        email: email.toLowerCase().trim(),
      });
      showAlert(
        "Success",
        "Password reset email sent. Please check your inbox."
      );
      setEmail("");
    } catch (error) {
      showAlert(
        "Error",
        error.response?.data?.message || "Failed to send reset email"
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
                  fontSize="$8"
                  fontWeight="bold"
                  textAlign="center"
                >
                  Forgot Password
                </Text>
                <Text
                  color="white"
                  fontSize="$4"
                  textAlign="center"
                  opacity={0.8}
                >
                  Enter your email to reset password
                </Text>
              </YStack>

              <YStack space="$4" mb="$6">
                <YStack space="$2">
                  <Label htmlFor="forgot-email" paddingLeft="$2" color="white">
                    Email Address
                  </Label>
                  <Input
                    id="forgot-email"
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
                      fontSize="$2.5"
                      fontWeight="bold"
                      paddingLeft="$2"
                    >
                      {errors.email}
                    </Text>
                  )}
                </YStack>
              </YStack>

              <Button
                size="$4"
                backgroundColor="$yellow400"
                color="$gray900"
                pressStyle={{ opacity: 0.8 }}
                disabled={loading}
                onPress={handleSubmit}
                borderRadius="$4"
              >
                {loading ? (
                  <ActivityIndicator color="$gray900" />
                ) : (
                  "Send Reset Email"
                )}
              </Button>

              <XStack justifyContent="center" space="$2" mt="$4">
                <Text color="white">Remember your password?</Text>
                <Text
                  color="$yellow400"
                  fontWeight="bold"
                  onPress={() => navigation.navigate("Login")}
                  pressStyle={{ opacity: 0.8 }}
                >
                  Login
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
