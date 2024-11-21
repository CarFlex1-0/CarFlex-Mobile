import React, { useEffect } from "react";
import { Image, Dimensions } from "react-native";
import { Text, YStack } from "tamagui";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";

const { height, width } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const [loaded] = useFonts({
    Orbitron: require("../../assets/fonts/Orbitron-Regular.ttf"),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  if (!loaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={["#1e3a8a", "#312e81", "#1e1b4b"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        space="$8"
        padding="$6"
      >
        <YStack alignItems="center" scale={1.2}>
          <Text
            fontFamily="Orbitron"
            fontSize={64}
            color="white"
            textAlign="center"
            letterSpacing={2}
          >
            Car
            <Text
              fontFamily="Orbitron"
              fontSize={64}
              color="$red10"
              letterSpacing={2}
            >
              F
            </Text>
            lex
          </Text>
        </YStack>

        <Image
          source={require("../../assets/images/Fortuner.png")}
          style={{
            width: width * 0.9,
            height: height * 0.3,
            resizeMode: "contain",
            marginVertical: 40,
          }}
        />

        <Text
          fontFamily="Orbitron"
          fontSize={20}
          color="white"
          textAlign="center"
          opacity={0.9}
          maxWidth={width * 0.9}
          lineHeight={30}
          letterSpacing={1}
        >
          Change your Imagination into Reality
        </Text>
      </YStack>
    </LinearGradient>
  );
}
