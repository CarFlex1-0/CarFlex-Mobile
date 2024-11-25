import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, YStack, XStack, Button, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/common/GlassCard';
import theme from '../../constants/theme';
import ScreenLayout from '../../components/common/ScreenLayout';

export default function OBDSetupScreen({ navigation }) {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const startScan = () => {
    setScanning(true);
    // Simulated device discovery
    setTimeout(() => {
      setDevices([
        { id: '1', name: 'OBD-II Scanner Pro', address: '00:11:22:33:44:55', signal: 'Strong' },
        { id: '2', name: 'Car Scanner ELM327', address: '66:77:88:99:AA:BB', signal: 'Medium' },
        { id: '3', name: 'BlueDriver OBD2', address: 'CC:DD:EE:FF:00:11', signal: 'Strong' },
      ]);
      setScanning(false);
    }, 2000);
  };

  const connectToDevice = async (device) => {
    setConnecting(true);
    setSelectedDevice(device);
    // Simulated connection process
    setTimeout(() => {
      setConnecting(false);
      navigation.navigate('Dashboard');
    }, 2000);
  };

  return (
    <ScreenLayout>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <YStack space="$4" padding="$4">
          {/* Header */}
          <YStack space="$2">
            <Text 
              color={theme.colors.text.accent} 
              fontSize="$8" 
              fontWeight="bold"
              style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}
            >
              OBD Setup
            </Text>
            <Text color={theme.colors.text.primary} fontSize="$4" opacity={0.9}>
              Connect your vehicle's OBD scanner
            </Text>
          </YStack>

          {/* Setup Instructions */}
          <GlassCard padding="$4">
            <YStack space="$4">
              <Text color={theme.colors.text.primary} fontSize="$6" fontWeight="bold">
                Setup Guide
              </Text>
              {[
                'Plug in your OBD-II adapter',
                'Turn on your vehicle',
                'Enable Bluetooth on your phone',
                'Scan for available devices'
              ].map((step, index) => (
                <XStack key={index} space="$2" alignItems="center">
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: theme.colors.secondary.yellow,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text color={theme.colors.primary.dark} fontWeight="bold">
                      {index + 1}
                    </Text>
                  </View>
                  <Text color={theme.colors.text.primary} fontSize="$4">
                    {step}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </GlassCard>

          {/* Scan Button */}
          <Button
            size="$4"
            backgroundColor={theme.colors.secondary.yellow}
            color={theme.colors.primary.dark}
            onPress={startScan}
            disabled={scanning}
            icon={scanning ? 
              <Spinner color={theme.colors.primary.dark} /> : 
              <Ionicons name="bluetooth" size={20} color={theme.colors.primary.dark} />
            }
          >
            {scanning ? 'Scanning...' : 'Scan for Devices'}
          </Button>

          {/* Available Devices */}
          {devices.length > 0 && (
            <GlassCard padding="$4">
              <YStack space="$4">
                <Text color={theme.colors.text.primary} fontSize="$5" fontWeight="bold">
                  Available Devices
                </Text>
                {devices.map(device => (
                  <GlassCard
                    key={device.id}
                    padding="$4"
                    gradient={theme.colors.gradients.card}
                    pressStyle={{ opacity: 0.8 }}
                    onPress={() => connectToDevice(device)}
                  >
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack space="$1">
                        <Text color={theme.colors.text.primary} fontSize="$4" fontWeight="bold">
                          {device.name}
                        </Text>
                        <XStack space="$2" alignItems="center">
                          <Text color={theme.colors.text.secondary} fontSize="$3">
                            {device.address}
                          </Text>
                          <Text color={theme.colors.secondary.yellow} fontSize="$3">
                            • {device.signal} Signal
                          </Text>
                        </XStack>
                      </YStack>
                      {selectedDevice?.id === device.id ? (
                        connecting ? (
                          <Spinner color={theme.colors.secondary.yellow} />
                        ) : (
                          <Ionicons name="checkmark-circle" size={24} color={theme.colors.secondary.yellow} />
                        )
                      ) : (
                        <Button
                          size="$3"
                          backgroundColor={theme.colors.glass.light}
                          color={theme.colors.text.primary}
                          borderColor={theme.colors.glass.border}
                          borderWidth={1}
                          onPress={() => connectToDevice(device)}
                          icon={<Ionicons name="link" size={16} color={theme.colors.text.primary} />}
                        >
                          Connect
                        </Button>
                      )}
                    </XStack>
                  </GlassCard>
                ))}
              </YStack>
            </GlassCard>
          )}

          {/* Troubleshooting */}
          <GlassCard padding="$4">
            <YStack space="$3">
              <Text color={theme.colors.text.primary} fontSize="$5" fontWeight="bold">
                Troubleshooting
              </Text>
              {[
                'Make sure your OBD adapter is properly plugged in',
                'Ensure your vehicle\'s ignition is turned on',
                'Check if Bluetooth is enabled on your device'
              ].map((tip, index) => (
                <XStack key={index} space="$2" alignItems="center">
                  <Ionicons name="information-circle" size={20} color={theme.colors.secondary.yellow} />
                  <Text color={theme.colors.text.secondary} fontSize="$3" flex={1}>
                    {tip}
                  </Text>
                </XStack>
              ))}
              <Button
                size="$3"
                backgroundColor={theme.colors.glass.light}
                color={theme.colors.text.primary}
                borderColor={theme.colors.glass.border}
                borderWidth={1}
                onPress={() => {/* Add help documentation navigation */}}
                icon={<Ionicons name="help-circle" size={20} color={theme.colors.text.primary} />}
              >
                View Help Guide
              </Button>
            </YStack>
          </GlassCard>
        </YStack>
      </ScrollView>
    </ScreenLayout>
  );
} 