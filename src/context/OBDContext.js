import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import { WS_URL } from '@env';

const OBDContext = createContext(null);

// Add these constants at the top
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export function OBDProvider({ children }) {
  console.log('OBDProvider initializing...');
  console.log('WebSocket URL:', WS_URL);

  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    speed: 0,
    rpm: 0,
    temp: 0,
    fuel: 0,
  });

  // Add interval ID state for cleanup
  const [dataInterval, setDataInterval] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.log('OBDProvider mounted');
    return () => {
      console.log('OBDProvider unmounting...');
      if (client) {
        client.close();
      }
      if (dataInterval) {
        clearInterval(dataInterval);
      }
    };
  }, [client, dataInterval]);

  const parseOBDData = (response) => {
    try {
      // Basic parsing of OBD responses
      // Remove whitespace and split by lines
      const lines = response.trim().split('\n');
      
      lines.forEach(line => {
        // Remove spaces and convert to uppercase
        const cleanLine = line.replace(/\s/g, '').toUpperCase();
        
        // Parse different OBD PIDs
        if (cleanLine.startsWith('41')) { // 41 is the response prefix for current data
          const pid = cleanLine.substring(2, 4);
          const value = parseInt(cleanLine.substring(4), 16); // Convert hex to decimal
          
          switch (pid) {
            case '0C': // RPM
              setData(prev => ({
                ...prev,
                rpm: Math.round(value / 4)
              }));
              break;
            case '0D': // Speed
              setData(prev => ({
                ...prev,
                speed: value
              }));
              break;
            case '05': // Engine coolant temperature
              setData(prev => ({
                ...prev,
                temp: value - 40 // OBD returns temp + 40°C
              }));
              break;
            case '2F': // Fuel level
              setData(prev => ({
                ...prev,
                fuel: Math.round((value * 100) / 255) // Convert to percentage
              }));
              break;
            default:
              console.log('Unhandled PID:', pid);
          }
        }
      });
    } catch (err) {
      console.error('Error parsing OBD data:', err);
      // Don't throw error to prevent crashing, just log it
    }
  };

  const connect = async (options) => {
    console.log('Attempting to connect with options:', options);
    
    if (client) {
      console.log('Cleaning up existing connection');
      client.close();
      setClient(null);
    }

    try {
      console.log('Creating new WebSocket connection');
      
      return new Promise((resolve, reject) => {
        try {
          const wsUrl = WS_URL || 'ws://192.168.1.74:8080';
          console.log('Connecting to WebSocket URL:', wsUrl);
          
          const connectWithRetry = (retryAttempt = 0) => {
            const ws = new WebSocket(wsUrl);
            
            ws.onopen = () => {
              console.log('WebSocket Connected');
              setRetryCount(0);
              
              // Send initial ELM327 commands with proper error handling
              const sendCommand = (command) => {
                return new Promise((cmdResolve) => {
                  try {
                    ws.send(command);
                    cmdResolve();
                  } catch (err) {
                    console.error(`Failed to send command ${command}:`, err);
                    cmdResolve(); // Continue even if command fails
                  }
                });
              };

              // Sequential commands with proper delays
              Promise.resolve()
                .then(() => sendCommand('ATZ\r'))
                .then(() => new Promise(resolve => setTimeout(resolve, 300)))
                .then(() => sendCommand('ATE0\r'))
                .then(() => new Promise(resolve => setTimeout(resolve, 300)))
                .then(() => sendCommand('ATL0\r'))
                .then(() => {
                  setConnected(true);
                  setError(null);
                  resolve(true);
                })
                .catch(err => {
                  console.error('Error during initialization sequence:', err);
                  reject(err);
                });
            };

            ws.onmessage = (event) => {
              try {
                const response = event.data.toString().trim();
                console.log('Received from OBD:', response);
                
                try {
                  const jsonData = JSON.parse(response);
                  if (jsonData.error) {
                    console.error('Proxy error:', jsonData.error);
                    setError('Connection error: ' + jsonData.error);
                    return;
                  }
                } catch {
                  // Not JSON, treat as normal OBD data
                  if (response.includes('ELM327')) {
                    console.log('ELM327 identified');
                  } else if (response === 'OK') {
                    console.log('Command acknowledged');
                  } else {
                    parseOBDData(response);
                  }
                }
              } catch (err) {
                console.error('Error processing message:', err);
              }
            };

            ws.onerror = (err) => {
              console.error('WebSocket error:', err);
              setError('Connection error: ' + (err.message || 'Unknown error'));
              
              if (retryAttempt < MAX_RETRIES) {
                console.log(`Retrying connection (${retryAttempt + 1}/${MAX_RETRIES})...`);
                setTimeout(() => connectWithRetry(retryAttempt + 1), RETRY_DELAY);
              } else {
                setConnected(false);
                reject(new Error(`Failed to connect after ${MAX_RETRIES} attempts`));
              }
            };

            ws.onclose = (event) => {
              console.log('WebSocket closed:', event);
              setConnected(false);
              setClient(null);
              
              // Only attempt reconnect if not manually disconnected
              if (!event.wasClean && retryAttempt < MAX_RETRIES) {
                console.log(`Connection closed unexpectedly. Retrying (${retryAttempt + 1}/${MAX_RETRIES})...`);
                setTimeout(() => connectWithRetry(retryAttempt + 1), RETRY_DELAY);
              }
              
              if (dataInterval) {
                clearInterval(dataInterval);
                setDataInterval(null);
              }
            };

            setClient(ws);
          };

          connectWithRetry();

        } catch (err) {
          console.error('Error creating WebSocket connection:', err);
          setError('WebSocket connection error: ' + err.message);
          reject(err);
        }
      });
    } catch (err) {
      console.error('Failed to create OBD connection:', err);
      setError('Failed to connect to OBD simulator: ' + err.message);
      return false;
    }
  };

  const disconnect = () => {
    console.log('Disconnecting OBD...');
    if (client) {
      client.close();
      setClient(null);
      setConnected(false);
    }
    if (dataInterval) {
      clearInterval(dataInterval);
      setDataInterval(null);
    }
  };

  // New function to set and simulate scenarios
  const setScenario = async (scenarioValues) => {
    console.log('Setting scenario with values:', scenarioValues);
    
    // Clear existing interval if any
    if (dataInterval) {
      clearInterval(dataInterval);
    }

    // Create new interval to simulate data changes
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = { ...prevData };
        
        // Add some random variation to make it more realistic
        Object.keys(scenarioValues).forEach(key => {
          const baseValue = scenarioValues[key];
          const variation = Math.random() * (baseValue * 0.1) - (baseValue * 0.05);
          newData[key] = Math.round(baseValue + variation);
        });

        return newData;
      });
    }, 1000);

    setDataInterval(interval);

    // Set initial values immediately
    setData(scenarioValues);
  };

  const setAccelerationScenario = async () => {
    console.log('Setting acceleration scenario');
    
    if (dataInterval) {
      clearInterval(dataInterval);
    }

    let currentSpeed = 0;
    let currentRPM = 800;
    const targetSpeed = 120;
    const accelerationInterval = 100; // Update every 100ms
    
    const interval = setInterval(() => {
      if (currentSpeed >= targetSpeed) {
        clearInterval(interval);
        return;
      }

      // Simulate realistic acceleration
      currentSpeed += 2; // Increase speed by 2 km/h per 100ms
      currentRPM = Math.min(6000, 800 + (currentSpeed * 30)); // RPM increases with speed

      setData(prevData => ({
        ...prevData,
        speed: Math.min(currentSpeed, targetSpeed),
        rpm: currentRPM,
        temp: Math.min(95, prevData.temp + 0.1), // Gradually increase temperature
        fuel: Math.max(65, prevData.fuel - 0.1)  // Gradually decrease fuel
      }));
    }, accelerationInterval);

    setDataInterval(interval);

    // Set initial values
    setData({
      speed: 0,
      rpm: 800,
      temp: 85,
      fuel: 70
    });
  };

  const contextValue = {
    client,
    connected,
    error,
    data,
    connect,
    disconnect,
    setScenario,
    setAccelerationScenario
  };

  return (
    <OBDContext.Provider value={contextValue}>
      {children}
    </OBDContext.Provider>
  );
}

export function useOBD() {
  const context = useContext(OBDContext);
  if (context === undefined) {
    throw new Error('useOBD must be used within an OBDProvider');
  }
  return context;
} 