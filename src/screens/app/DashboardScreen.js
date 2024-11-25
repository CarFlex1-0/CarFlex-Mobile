import React, { useState } from "react";
import { ScrollView, View, Dimensions, Image } from "react-native";
import { Text, YStack, XStack, Button, Card, Progress } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import GlassCard from "../../components/common/GlassCard";
import theme from "../../constants/theme";
import ScreenLayout from "../../components/common/ScreenLayout";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");

export default function DashboardScreen({ navigation }) {
  const [obdConnected, setObdConnected] = useState(false);
  const [fontsLoaded] = useFonts({
    Orbitron: require("../../../assets/fonts/Orbitron-Regular.ttf"),
  });

  const performanceData = {
    speed: { value: "75", max: "220", unit: "km/h" },
    rpm: { value: "3500", max: "8000", unit: "RPM" },
    temp: { value: "90", max: "120", unit: "°C" },
    fuel: { value: "75", max: "100", unit: "%" },
  };

  const carModels = [
    {
      id: 1,
      name: "Tesla Model S",
      type: "Electric",
      status: "Ready",
      image: "https://images.unsplash.com/photo-1617788138017-80ad40651399",
      price: "$89,990",
    },
    {
      id: 2,
      name: "BMW M4",
      type: "Sports",
      status: "Processing",
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738",
      price: "$74,900",
    },
    {
      id: 3,
      name: "Mercedes G-Wagon",
      type: "SUV",
      status: "Ready",
      image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366",
      price: "$139,900",
    },
  ];

  console.log("Rendering OBD Status Card with styles:", {
    cardBackground: theme.colors.glass.light,
    viewBackground: "transparent",
    padding: "$4",
  });

  return (
    <ScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Welcome Section */}
        <YStack space="$4" px="$6" marginTop="$6" marginBottom="$4">
          <Text
            color={theme.colors.text.accent}
            fontSize="$6"
            style={{
              fontFamily: "Orbitron",
              textShadowColor: "rgba(0, 0, 0, 0.3)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
              textAlign: "center", // Centering the text
            }}
            className="text-center"
          >
            Welcome Back
          </Text>
          <Text
            textAlign="center"
            color={theme.colors.text.primary}
            fontSize="$4"
            opacity={0.9}
          >
            Monitor your vehicle's performance
          </Text>
        </YStack>

        <YStack space="$4" px="$4">
          {/* OBD Status Card */}
          <GlassCard>
            <XStack
              justifyContent="space-between"
              alignItems="center"
              padding="$4"
              gap="$4"
              style={{ backgroundColor: "transparent" }}
            >
              <View style={{ backgroundColor: "transparent" }}>
                <Text
                  color={theme.colors.text.primary}
                  fontSize="$6"
                  fontWeight="bold"
                >
                  OBD Status
                </Text>
                <Text color={theme.colors.text.secondary} fontSize="$3">
                  {obdConnected ? "Connected & Monitoring" : "Setup Required"}
                </Text>
              </View>
              <Button
                size="$4"
                backgroundColor={
                  obdConnected
                    ? theme.colors.secondary.yellow
                    : theme.colors.glass.accent
                }
                color={
                  obdConnected
                    ? theme.colors.primary.dark
                    : theme.colors.text.primary
                }
                onPress={() => navigation.navigate("OBDSetup")}
                padding="$2"
                icon={
                  obdConnected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={theme.colors.primary.dark}
                    />
                  ) : (
                    <Ionicons
                      name="construct"
                      size={20}
                      color={theme.colors.text.primary}
                    />
                  )
                }
              >
                {obdConnected ? "Connected" : "Setup OBD"}
              </Button>
            </XStack>

            {obdConnected && (
              <View
                padding="$4"
                paddingTop={0}
                style={{ backgroundColor: "transparent" }}
              >
                {Object.entries(performanceData).map(([key, data]) => (
                  <View
                    key={key}
                    marginTop="$4"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <XStack justifyContent="space-between" marginBottom="$2">
                      <Text
                        color={theme.colors.text.primary}
                        fontSize="$3"
                        textTransform="capitalize"
                      >
                        {key}
                      </Text>
                      <Text
                        color={theme.colors.text.accent}
                        fontSize="$3"
                        fontWeight="bold"
                      >
                        {data.value}
                        {data.unit}
                      </Text>
                    </XStack>
                    <Progress
                      value={parseInt(data.value)}
                      backgroundColor={theme.colors.glass.medium}
                    >
                      <Progress.Indicator
                        animation="bouncy"
                        backgroundColor={theme.colors.secondary.yellow}
                      />
                    </Progress>
                  </View>
                ))}
              </View>
            )}
          </GlassCard>

          {/* AR Models Section */}
          <Text
            textAlign="center"
            color={theme.colors.text.primary}
            fontSize="$4"
            opacity={0.9}
          >
            Go through our curated AR models
          </Text>
          <GlassCard padding="$6" gradient={theme.colors.gradients.cardDark}>
            <Text
              color={theme.colors.text.primary}
              fontSize="$6"
              fontWeight="bold"
              marginBottom="$6"
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.3)",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
                textAlign: "center",
              }}
            >
              AR Models
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {carModels.map((car) => (
                <GlassCard
                  key={car.id}
                  scale={0.98}
                  hoverStyle={{ scale: 1 }}
                  pressStyle={{ scale: 0.96 }}
                  onPress={() =>
                    navigation.navigate("ARDisplay", { carId: car.id })
                  }
                  marginRight="$4"
                  width={width * 0.7}
                  overflow="hidden"
                  padding={0}
                >
                  <Image
                    source={{ uri: car.image }}
                    style={{
                      width: "100%",
                      height: 220, // Increased height from 180
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "50%",
                      padding: 16,
                    }}
                  >
                    <YStack space="$2" style={{ marginTop: "auto" }}>
                      <Text color="white" fontSize="$5" fontWeight="bold">
                        {car.name}
                      </Text>
                      <XStack
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Text color={theme.colors.text.secondary} fontSize="$3">
                          {car.type}
                        </Text>
                        <Text
                          color={theme.colors.text.accent}
                          fontSize="$4"
                          fontWeight="bold"
                        >
                          {car.price}
                        </Text>
                      </XStack>
                    </YStack>
                  </LinearGradient>
                </GlassCard>
              ))}
            </ScrollView>
          </GlassCard>
        </YStack>
      </ScrollView>
    </ScreenLayout>
  );
}
