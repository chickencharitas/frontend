// src/theme.js
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5A67D8",
      light: "#7F9BFF",
      dark: "#3C4EB8",
    },
    secondary: {
      main: "#6B46C1",
      light: "#9F7AEA",
      dark: "#553C9A"
    },
    background: {
      default: "#f4f6fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a202c",
      secondary: "#4a5568",
    },
    divider: "#e2e8f0",
    success: { main: "#38A169" },
    error: { main: "#E53E3E" },
    warning: { main: "#DD6B20" },
    info: { main: "#3182CE" },
  },

  typography: {
    fontFamily: '"DM Sans", "Roboto", sans-serif',
    h1: { fontSize: "2.8rem", fontWeight: 700 },
    h2: { fontSize: "2.2rem", fontWeight: 700 },
    h3: { fontSize: "1.8rem", fontWeight: 600 },
    h4: { fontSize: "1.4rem", fontWeight: 600 },
    h5: { fontSize: "1.2rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 500 },
    body1: { fontSize: "1rem", fontWeight: 400 },
    body2: { fontSize: "0.875rem", fontWeight: 400 },
    button: { fontWeight: 600, textTransform: "none" }
  },

  shape: { borderRadius: 12 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f4f6fb",
          color: "#1a202c"
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "none",
          backgroundColor: "#ffffff",
          boxShadow: "none"
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          color: "#1a202c"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0,0,0,0.12)'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.28)' }
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true
      }
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: 'rgba(0,0,0,0.6)' }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: { '& svg': { color: 'rgba(0,0,0,0.6)' } }
      }
    }
  }
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7F9BFF",
      light: "#A8B9FF",
      dark: "#5A67D8",
    },
    secondary: {
      main: "#9F7AEA",
      light: "#B8A5F5",
      dark: "#6B46C1"
    },
    background: {
      default: "#0f1419",
      paper: "#1a1f2e",
    },
    text: {
      primary: "#e2e8f0",
      secondary: "#cbd5e0",
    },
    divider: "#2d3748",
    success: { main: "#48bb78" },
    error: { main: "#f56565" },
    warning: { main: "#ed8936" },
    info: { main: "#4299e1" },
  },

  typography: {
    fontFamily: '"DM Sans", "Roboto", sans-serif',
    h1: { fontSize: "2.8rem", fontWeight: 700 },
    h2: { fontSize: "2.2rem", fontWeight: 700 },
    h3: { fontSize: "1.8rem", fontWeight: 600 },
    h4: { fontSize: "1.4rem", fontWeight: 600 },
    h5: { fontSize: "1.2rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 500 },
    body1: { fontSize: "1rem", fontWeight: 400 },
    body2: { fontSize: "0.875rem", fontWeight: 400 },
    button: { fontWeight: 600, textTransform: "none" }
  },

  shape: { borderRadius: 12 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0f1419",
          color: "#e2e8f0"
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: "#1a1f2e",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "none",
          backgroundColor: "#1a1f2e",
          boxShadow: "none"
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1a1f2e",
          color: "#e2e8f0"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(224,224,224,0.18)'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(224,224,224,0.6)'
          },
          '& .MuiInputBase-input': { color: '#e0e0e0' }
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true
      }
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: 'rgba(224,224,224,0.9)' }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: { '& svg': { color: 'rgba(224,224,224,0.9)' } }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: { backgroundColor: '#1a1f2e', color: '#e0e0e0' }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { color: '#e0e0e0', '&:hover': { backgroundColor: 'rgba(224,224,224,0.04)' } }
      }
    }
  }
});

export default lightTheme;
