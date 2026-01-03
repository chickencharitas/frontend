import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createProPresenterTheme } from '../components/presenter/theme/theme';

// Create theme context
export const ThemeContext = createContext();

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');
  
  // Load saved theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setMode(savedTheme);
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    localStorage.setItem('theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Create theme based on current mode
  const theme = useMemo(() => createProPresenterTheme(mode), [mode]);

  // Theme context value
  const contextValue = useMemo(() => ({
    mode,
    toggleTheme,
    theme
  }), [mode, theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Default export for backward compatibility
const ThemeProviderCustom = ThemeProvider;
export default ThemeProviderCustom;
