/**
 * Brand Color & Customization Config
 * Easy color customization for template system
 */

// ============================================
// BRAND COLORS - Customize Here
// ============================================
export const brandConfig = {
  // Primary Colors
  primary: '#1a1a1a',        // Background
  secondary: '#252526',      // Panels
  tertiary: '#2d2d2e',       // Cards
  
  // Accent Colors
  accent: '#81c784',         // Main accent (green)
  accentSecondary: '#64b5f6', // Secondary accent (blue)
  
  // Featured & Status
  featured: '#ff9800',       // Featured badge
  success: '#81c784',        // Success/apply
  info: '#64b5f6',          // Info
  warning: '#ffc107',        // Warning/effects
  danger: '#ff5722',         // Danger/delete
  
  // Text Colors
  textPrimary: '#ffffff',    // Main text
  textSecondary: '#c0c0c0',  // Secondary text
  textTertiary: '#808080',   // Tertiary/muted text
  
  // Borders & Dividers
  border: '#404040',         // Border color
  divider: '#2d2d2e',        // Divider color
  
  // Hover/Focus States
  hoverBackground: '#252526',
  focusBorder: '#81c784',
  
  // Gradients
  gradients: {
    blue: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
    purple: 'linear-gradient(135deg, #2c1a2e 0%, #4a235a 100%)',
    sunset: 'linear-gradient(135deg, #ff6b35 0%, #fdb833 100%)',
    accent: `linear-gradient(135deg, #1a3a3a 0%, #81c784 100%)`
  }
};

// ============================================
// TYPOGRAPHY CONFIG
// ============================================
export const typographyConfig = {
  fontFamily: {
    heading: 'Poppins, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'Courier Prime, monospace',
    accent: 'Playfair Display, serif'
  },
  
  fontSize: {
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
    body: 14,
    caption: 12,
    small: 11
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
};

// ============================================
// SPACING CONFIG
// ============================================
export const spacingConfig = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};

// ============================================
// TEMPLATE SYSTEM THEME
// ============================================
export const templateSystemTheme = {
  colors: brandConfig,
  typography: typographyConfig,
  spacing: spacingConfig,
  
  // Component-specific styles
  components: {
    card: {
      background: brandConfig.tertiary,
      border: `1px solid ${brandConfig.border}`,
      borderRadius: 8,
      padding: spacingConfig.lg,
      transition: 'all 0.3s ease'
    },
    
    button: {
      primary: {
        background: brandConfig.accent,
        color: '#000',
        borderRadius: 6
      },
      secondary: {
        background: brandConfig.secondary,
        color: brandConfig.textPrimary,
        borderRadius: 6
      }
    },
    
    input: {
      background: brandConfig.primary,
      color: brandConfig.textPrimary,
      border: `1px solid ${brandConfig.border}`,
      borderRadius: 6,
      padding: spacingConfig.md
    },
    
    modal: {
      background: brandConfig.secondary,
      overlayBackground: 'rgba(0, 0, 0, 0.7)'
    }
  }
};

// ============================================
// CUSTOM THEME BUILDER
// ============================================
export const createCustomTheme = (overrides = {}) => {
  return {
    ...templateSystemTheme,
    colors: {
      ...templateSystemTheme.colors,
      ...overrides
    }
  };
};

// ============================================
// CSS VARIABLES (For global styling)
// ============================================
export const getCSSVariables = (theme = templateSystemTheme) => ({
  '--primary-bg': theme.colors.primary,
  '--secondary-bg': theme.colors.secondary,
  '--tertiary-bg': theme.colors.tertiary,
  '--accent-color': theme.colors.accent,
  '--accent-secondary': theme.colors.accentSecondary,
  '--text-primary': theme.colors.textPrimary,
  '--text-secondary': theme.colors.textSecondary,
  '--text-tertiary': theme.colors.textTertiary,
  '--border-color': theme.colors.border,
  '--featured-color': theme.colors.featured
});

// ============================================
// APPLY THEME GLOBALLY
// ============================================
export const applyGlobalTheme = (theme = templateSystemTheme) => {
  const cssVars = getCSSVariables(theme);
  Object.entries(cssVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
};

// ============================================
// PRESET BRAND THEMES
// ============================================
export const brandThemes = {
  default: templateSystemTheme,
  
  corporate: createCustomTheme({
    accent: '#0d47a1',
    accentSecondary: '#1976d2',
    featured: '#ffd600'
  }),
  
  modern: createCustomTheme({
    accent: '#00bcd4',
    accentSecondary: '#009688',
    featured: '#ff5722'
  }),
  
  minimal: createCustomTheme({
    primary: '#f5f5f5',
    secondary: '#e0e0e0',
    accent: '#1976d2',
    textPrimary: '#212121',
    textSecondary: '#666666'
  }),
  
  vibrant: createCustomTheme({
    accent: '#ff6b6b',
    accentSecondary: '#4ecdc4',
    featured: '#ffd93d'
  })
};

// ============================================
// EXPORT ALL
// ============================================
export default {
  brandConfig,
  typographyConfig,
  spacingConfig,
  templateSystemTheme,
  createCustomTheme,
  getCSSVariables,
  applyGlobalTheme,
  brandThemes
};
