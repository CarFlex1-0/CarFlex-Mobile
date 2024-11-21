import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  ScrollView,
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

export default function SignupScreen({ navigation }) {
  const scrollViewRef = useRef(null);
  const inputIds = useMemo(
    () => ({
      firstName: `signup-firstName-${Date.now()}`,
      lastName: `signup-lastName-${Date.now()}`,
      email: `signup-email-${Date.now()}`,
      password: `signup-password-${Date.now()}`,
    }),
    []
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
    const nameRegex = /^[a-zA-Z\s]{2,30}$/;

    // First Name validation
    if (!firstName) newErrors.firstName = "First name is required";
    else if (!nameRegex.test(firstName))
      newErrors.firstName =
        "First name should be 2-30 characters long and contain only letters";

    // Last Name validation
    if (!lastName) newErrors.lastName = "Last name is required";
    else if (!nameRegex.test(lastName))
      newErrors.lastName =
        "Last name should be 2-30 characters long and contain only letters";

    // Email validation
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";

    // Password validation
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      showAlert("Validation Error", "Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/user/register", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password,
      });
      showAlert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      // console.error("❌ Signup error:", error);
      showAlert(
        "Error",
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let keyboardDidShow;
    let keyboardDidHide;

    const unsubscribe = navigation.addListener("focus", () => {
      // console.log("🎯 SignupScreen focused");
      setErrors({});

      keyboardDidShow = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
        (e) => {
          // console.log("🎹 Keyboard showing:", {
          //   keyboardHeight: e.endCoordinates.height,
          //   screenName: "SignupScreen",
          // });
        }
      );

      keyboardDidHide = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
        () => {
          // console.log("🎹 Keyboard hiding - SignupScreen");
        }
      );
    });

    const blurSubscribe = navigation.addListener("blur", () => {
      // console.log("👋 SignupScreen blurred");
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

  const handleFocus = (inputY) => {
    const offset = Platform.OS === "ios" ? 180 : 120;
    scrollViewRef.current?.getScrollResponder()?.scrollTo({
      y: inputY - offset,
      animated: true,
    });
  };

  return (
    <LinearGradient
      colors={["#1e3a8a", "#312e81", "#1e1b4b"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 50 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={Platform.OS === "ios" ? 150 : 30}
        enableResetScrollToCoords={false}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        // onKeyboardDidShow={(frames) => {
        //   console.log("Keyboard frame:", frames);
        // }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <YStack
              space="$4"
              px="$6"
              style={{
                paddingTop: Platform.select({
                  ios: height * 0.1,
                  android: height * 0.05,
                }),
                minHeight: height * 0.9,
                justifyContent: "center",
              }}
            >
              <YStack space="$2" mb="$3">
                <Text
                  color="$yellow400"
                  fontSize="$8"
                  fontWeight="bold"
                  textAlign="center"
                >
                  Create Account
                </Text>
              </YStack>

              <YStack space="$4" mb="$6">
                <YStack space="$2">
                  <Label
                    htmlFor={inputIds.firstName}
                    paddingLeft="$2"
                    color="white"
                  >
                    First Name
                  </Label>
                  <Input
                    id={inputIds.firstName}
                    size="$4"
                    borderWidth={2}
                    placeholder="Enter your first name"
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      setErrors({ ...errors, firstName: null });
                    }}
                    backgroundColor="$gray100"
                    borderColor={errors.firstName ? "$red8" : "$yellow400"}
                    focusStyle={{ borderColor: "$yellow500" }}
                    onFocus={() => handleFocus(150)}
                  />
                  {errors.firstName && (
                    <Text
                      color="$red8"
                      fontSize="$2"
                      fontWeight="bold"
                      paddingLeft="$2"
                    >
                      {errors.firstName}
                    </Text>
                  )}
                </YStack>

                <YStack space="$2">
                  <Label
                    htmlFor={inputIds.lastName}
                    paddingLeft="$2"
                    color="white"
                  >
                    Last Name
                  </Label>
                  <Input
                    id={inputIds.lastName}
                    size="$4"
                    borderWidth={2}
                    placeholder="Enter your last name"
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      setErrors({ ...errors, lastName: null });
                    }}
                    backgroundColor="$gray100"
                    borderColor={errors.lastName ? "$red8" : "$yellow400"}
                    focusStyle={{ borderColor: "$yellow500" }}
                    onFocus={() => handleFocus(250)}
                  />
                  {errors.lastName && (
                    <Text
                      color="$red8"
                      fontSize="$2.5"
                      fontWeight="bold"
                      paddingLeft="$2"
                    >
                      {errors.lastName}
                    </Text>
                  )}
                </YStack>

                <YStack space="$2">
                  <Label
                    htmlFor={inputIds.email}
                    paddingLeft="$2"
                    color="white"
                  >
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
                    onFocus={() => handleFocus(350)}
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

                <YStack space="$2">
                  <Label
                    htmlFor={inputIds.password}
                    paddingLeft="$2"
                    color="white"
                  >
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
                    onFocus={() => handleFocus(450)}
                  />
                  {errors.password && (
                    <Text
                      color="$red8"
                      fontSize="$2.5"
                      fontWeight="bold"
                      paddingLeft="$2"
                    >
                      {errors.password}
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
                onPress={handleSignup}
                borderRadius="$4"
              >
                {loading ? (
                  <ActivityIndicator color="$gray900" />
                ) : (
                  "Create Account"
                )}
              </Button>

              <XStack justifyContent="center" space="$2" mt="$1">
                <Text color="white">Already have an account?</Text>
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
