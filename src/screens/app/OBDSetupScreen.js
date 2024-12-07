import React, { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { Text, YStack, XStack, Button, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/common/GlassCard';
import theme from '../../constants/theme';
import ScreenLayout from '../../components/common/ScreenLayout';
import { useOBD } from '../../context/OBDContext';

// Predefined scenarios
const CARS = [
  'Toyota Corolla 2022',
  'Honda Civic 2023',
  'Suzuki Swift 2021',
  'Hyundai Elantra 2023',
  'Kia Forte 2022'
];

const SCENARIOS = {
  NORMAL_DRIVE: {
    name: 'Normal Drive',
    description: 'Simulates normal driving conditions',
    values: {
      rpm: 2000,
      speed: 60,
      temp: 90,
      fuel: 75
    }
  },
  IDLE: {
    name: 'Engine Idle',
    description: 'Simulates engine at idle',
    values: {
      rpm: 800,
      speed: 0,
      temp: 85,
      fuel: 80
    }
  },
  HIGHWAY: {
    name: 'Highway Drive',
    description: 'Simulates highway driving',
    values: {
      rpm: 3000,
      speed: 120,
      temp: 95,
      fuel: 65
    }
  },
  ACCELERATION: {
    name: 'Acceleration Test',
    description: '0-120 km/h acceleration simulation',
    values: {
      rpm: 1000,
      speed: 0,
      temp: 85,
      fuel: 70
    },
    isAcceleration: true  // Flag to identify acceleration scenario
  }
};

function OBDSetupContent({ navigation }) {
  const obd = useOBD();
  const [connecting, setConnecting] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showScenarios, setShowScenarios] = useState(false);
  const [detectedCar, setDetectedCar] = useState('');

  useEffect(() => {
    console.log('OBDSetupContent mounted');
    setLocalError(null);
    return () => {
      console.log('OBDSetupContent unmounting');
      if (obd.connected) {
        obd.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (obd.connected) {
      const randomCar = CARS[Math.floor(Math.random() * CARS.length)];
      setDetectedCar(randomCar);
    }
  }, [obd.connected]);

  console.log('Checking OBD context:', obd);

  const connectToOBD = async () => {
    console.log('Connect button pressed');
    setConnecting(true);
    setLocalError(null);
    
    try {
      const options = {
        port: 35000,
      };

      console.log('Calling connect with options:', options);
      const success = await obd.connect(options);
      console.log('Connect result:', success);
      
      if (success) {
        setShowScenarios(true);
      }
    } catch (err) {
      console.error('Connection error:', err);
      setLocalError('Connection failed: ' + (err.message || 'Unknown error'));
    } finally {
      setConnecting(false);
    }
  };

  const selectScenario = async (scenarioKey) => {
    console.log(`Selecting scenario: ${scenarioKey}`);
    try {
      const scenario = SCENARIOS[scenarioKey];
      if (scenario.isAcceleration) {
        // Handle acceleration scenario differently
        await obd.setAccelerationScenario();
      } else {
        await obd.setScenario(scenario.values);
      }
      setSelectedScenario(scenarioKey);
    } catch (err) {
      console.error('Scenario selection error:', err);
      setLocalError('Failed to set scenario: ' + (err.message || 'Unknown error'));
    }
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
            {detectedCar && obd.connected && (
              <Text color={theme.colors.text.primary} fontSize="$5" opacity={0.9}>
                Connected to: {detectedCar}
              </Text>
            )}
            <Text color={theme.colors.text.primary} fontSize="$4" opacity={0.9}>
              Connect to OBD Simulator
            </Text>
          </YStack>

          {/* Connect Button */}
          <Button
            size="$4"
            backgroundColor={obd.connected ? theme.colors.success : theme.colors.secondary.yellow}
            color={theme.colors.primary.dark}
            onPress={connectToOBD}
            disabled={connecting || obd.connected}
            icon={
              connecting ? <ActivityIndicator color={theme.colors.primary.dark} /> :
              obd.connected ? <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary.dark} /> :
              <Ionicons name="link" size={20} color={theme.colors.primary.dark} />
            }
          >
            {connecting ? 'Connecting...' : obd.connected ? 'Connected' : 'Connect to OBD'}
          </Button>

          {/* Scenarios Section */}
          {showScenarios && (
            <YStack space="$4">
              <Text color={theme.colors.text.primary} fontSize="$6" fontWeight="bold">
                Select Scenario
              </Text>
              {Object.entries(SCENARIOS).map(([key, scenario]) => (
                <GlassCard 
                  key={key}
                  padding="$4"
                  pressable
                  onPress={() => selectScenario(key)}
                  backgroundColor={selectedScenario === key ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}
                >
                  <YStack space="$2">
                    <Text color={theme.colors.text.primary} fontSize="$5" fontWeight="bold">
                      {scenario.name}
                    </Text>
                    <Text color={theme.colors.text.primary} fontSize="$3" opacity={0.8}>
                      {scenario.description}
                    </Text>
                  </YStack>
                </GlassCard>
              ))}
            </YStack>
          )}

          {/* Live Data Display */}
          {selectedScenario && (
            <GlassCard padding="$4">
              <YStack space="$4">
                <Text color={theme.colors.text.primary} fontSize="$6" fontWeight="bold">
                  Live Data
                </Text>
                <XStack flexWrap="wrap" justifyContent="space-between">
                  {Object.entries(obd.data).map(([key, value]) => (
                    <View key={key} style={{ width: '48%', marginBottom: 10 }}>
                      <Text color={theme.colors.text.primary} fontSize="$4" fontWeight="bold">
                        {key.toUpperCase()}
                      </Text>
                      <Text color={theme.colors.text.accent} fontSize="$5">
                        {value} {key === 'speed' ? 'km/h' : 
                               key === 'rpm' ? 'RPM' : 
                               key === 'temp' ? '°C' : '%'}
                      </Text>
                    </View>
                  ))}
                </XStack>
              </YStack>
            </GlassCard>
          )}

          {/* Error Message */}
          {(localError || obd.error) && (
            <Text color="red" fontSize="$4" textAlign="center">
              {localError || obd.error}
            </Text>
          )}
        </YStack>
      </ScrollView>
    </ScreenLayout>
  );
}

export default function OBDSetupScreen(props) {
  console.log('Rendering OBDSetupContent');
  return <OBDSetupContent {...props} />;
} 