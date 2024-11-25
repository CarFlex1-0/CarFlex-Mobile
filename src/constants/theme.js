import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  colors: {
    primary: {
      light: '#2563eb',
      main: '#1e3a8a',
      dark: '#1e1b4b',
      accent: '#312e81'
    },
    secondary: {
      yellow: '#fbbf24',
      yellowDark: '#b45309',
    },
    glass: {
      light: 'rgba(30, 58, 138, 0.15)',
      medium: 'rgba(30, 58, 138, 0.25)',
      dark: 'rgba(30, 58, 138, 0.35)',
      border: 'rgba(255, 255, 255, 0.1)'
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      accent: '#fbbf24'
    },
    gradients: {
      card: ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'],
      highlight: ['rgba(251, 191, 36, 0.1)', 'rgba(251, 191, 36, 0.05)'],
      overlay: ['transparent', 'rgba(0, 0, 0, 0.8)']
    }
  },
  shadows: {
    main: '0 4px 12px rgba(0, 0, 0, 0.1)',
    strong: '0 8px 20px rgba(0, 0, 0, 0.2)'
  },
  layout: {
    width,
    height,
    padding: 16,
    radius: {
      small: 8,
      medium: 12,
      large: 16
    }
  }
};

export default theme; 