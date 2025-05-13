import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors, darkColors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isDark: false,
  colors,
  spacing,
  typography,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');

  // Determine if dark mode is active
  const isDark = 
    theme === 'system' 
      ? systemColorScheme === 'dark'
      : theme === 'dark';

  // Use appropriate colors based on the theme
  const activeColors = isDark ? darkColors : colors;

  const contextValue = {
    theme,
    isDark,
    colors: activeColors,
    spacing,
    typography,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};