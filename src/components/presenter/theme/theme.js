import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Create a theme instance
const createProPresenterTheme = (mode = 'dark', primaryColor = '#9147FF') => {
  const isDark = mode === 'dark';
  
  // Base theme with mode-dependent colors
  const baseTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#9147FF',  // Twitch purple
        light: '#B07AFF',
        dark: '#7B2CFF',
        contrastText: '#FFFFFF'
      },
      secondary: {
        main: '#00C6FF',  // Bright cyan
        light: '#5CDBFF',
        dark: '#0099CC',
        contrastText: '#0A0A0A'
      },
      background: {
        default: '#0E0E10',  // Deep black
        paper: '#1F1F23',    // Slightly lighter black
        paperElevated: '#26262C' // For elevated surfaces
      },
      text: {
        primary: '#EFEFF1',  // Off-white
        secondary: '#ADADB8', // Muted text
        disabled: '#7D7D8A'   // Disabled text
      },
      divider: '#2D2D35',     // Slightly lighter than paper
      action: {
        active: isDark ? '#FFFFFF' : 'rgba(0, 0, 0, 0.54)',
        hover: 'rgba(255, 255, 255, 0.08)',
        selected: 'rgba(145, 71, 255, 0.16)',
        disabled: 'rgba(255, 255, 255, 0.3)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)'
      },
      success: {
        main: '#00B36B',     // Bright green
        light: '#33C285',
        dark: '#008F5A',
        contrastText: '#FFFFFF'
      },
      error: {
        main: '#FF4D4D',     // Bright red
        light: '#FF7070',
        dark: '#E53E3E',
        contrastText: '#FFFFFF'
      },
      warning: {
        main: '#FFB84D',     // Amber
        light: '#FFC670',
        dark: '#E69A2E',
        contrastText: '#0A0A0A'
      },
      info: {
        main: '#4D9EFF',     // Bright blue
        light: '#70B1FF',
        dark: '#2D7BFF',
        contrastText: '#FFFFFF'
      }
    },
    typography: {
      fontFamily: '"DM Sans", "Roboto", sans-serif',
      h1: { 
        fontSize: '2.5rem', 
        fontWeight: 700,
        letterSpacing: '-0.5px',
        lineHeight: 1.2,
      },
      h2: { 
        fontSize: '2rem', 
        fontWeight: 700,
        letterSpacing: '-0.4px',
        lineHeight: 1.2,
      },
      h3: { 
        fontSize: '1.75rem', 
        fontWeight: 700,
        letterSpacing: '-0.3px',
        lineHeight: 1.2,
      },
      h4: { 
        fontSize: '1.5rem', 
        fontWeight: 600,
        letterSpacing: '-0.2px',
        lineHeight: 1.2,
      },
      h5: { 
        fontSize: '1.25rem', 
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h6: { 
        fontSize: '1.125rem', 
        fontWeight: 600,
        lineHeight: 1.2,
      },
      body1: { 
        fontSize: '1rem', 
        lineHeight: 1.6,
        fontWeight: 400
      },
      body2: { 
        fontSize: '0.875rem', 
        lineHeight: 1.5,
        fontWeight: 400
      },
      button: { 
        fontWeight: 600, 
        textTransform: 'none',
        letterSpacing: '0.3px',
        fontSize: '0.875rem',
      },
      caption: {
        color: '#ADADB8',
        fontSize: '0.75rem',
        lineHeight: 1.4
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.5,
      }
    },
    shape: {
      borderRadius: 4,
    },
    spacing: 8,
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
    zIndex: {
      mobileStepper: 1000,
      speedDial: 1050,
      appBar: 1100,
      drawer: 1200,
      modal: 1300,
      snackbar: 1400,
      tooltip: 1500,
    },
  });

  // Custom theme overrides
  return createTheme({
    ...baseTheme,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            fontWeight: 600,
            padding: '8px 16px',
            textTransform: 'none',
            transition: 'all 0.2s',
            '&.MuiButton-contained': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                transform: 'translateY(-1px)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }
            },
            '&.MuiButton-outlined': {
              borderWidth: '1.5px',
              '&:hover': {
                borderWidth: '1.5px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)'
              }
            },
            '&.MuiButton-text': {
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)'
              }
            }
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: baseTheme.shape.borderRadius * 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#0E0E10',
            color: '#EFEFF1',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#1F1F23',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#3A3A3D',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#4A4A4F',
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'rgba(15, 15, 17, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
            color: '#EFEFF1',
            '& .MuiToolbar-root': {
              minHeight: '56px',
              '@media (min-width: 600px)': {
                minHeight: '56px',
              },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#1A1A1F',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            width: 280,
            boxSizing: 'border-box',
            '& .MuiListItemButton-root': {
              borderRadius: '8px',
              margin: '4px 8px',
              '&.Mui-selected': {
                backgroundColor: 'rgba(145, 71, 255, 0.16)',
                '&:hover': {
                  backgroundColor: 'rgba(145, 71, 255, 0.2)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            },
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            padding: baseTheme.spacing(2, 3, 1.5, 3),
            borderBottom: `1px solid ${baseTheme.palette.divider}`,
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: baseTheme.spacing(3),
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: baseTheme.spacing(2, 3),
            borderTop: `1px solid ${baseTheme.palette.divider}`,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
          fullWidth: true,
        },
      },
      MuiSelect: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            '&.Mui-checked': {
              color: baseTheme.palette.primary.main,
            },
            '&.Mui-checked + .MuiSwitch-track': {
              backgroundColor: baseTheme.palette.primary.main,
              opacity: 0.5,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            backgroundColor: '#1F1F23',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused': {
              backgroundColor: '#26262C',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9147FF',
                borderWidth: '2px',
              },
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF4D4D',
            },
          },
          input: {
            padding: '12px 14px',
            '&::placeholder': {
              color: '#7D7D8A',
              opacity: 1,
            },
          },
          notchedOutline: {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  });
};

// Default theme (light mode)
const defaultTheme = createProPresenterTheme('light');

// Dark theme
const darkTheme = createProPresenterTheme('dark');

// High contrast theme
const highContrastTheme = createProPresenterTheme('light', '#0066cc');

// Export themes
const themes = {
  light: defaultTheme,
  dark: darkTheme,
  highContrast: highContrastTheme,
};

export { createProPresenterTheme, themes };
export default createProPresenterTheme;
