// Professional Dark Theme - Better than ProPresenter/EasyWorship
export const colors = {
  // Primary backgrounds
  bg: {
    primary: '#0d0d0f',      // Deep black
    secondary: '#141418',    // Panel background
    tertiary: '#1a1a1f',     // Card background
    elevated: '#1f1f24',     // Elevated surfaces
    hover: '#252529',        // Hover state
    active: '#2a2a30',       // Active/selected state
  },
  
  // Borders
  border: {
    subtle: '#1f1f24',
    default: '#2a2a30',
    strong: '#3a3a42',
    focus: '#0088ff',
  },
  
  // Text
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b8',
    tertiary: '#707078',
    muted: '#505058',
    accent: '#0088ff',
  },
  
  // Accent colors
  accent: {
    primary: '#0088ff',      // Blue
    primaryHover: '#0099ff',
    secondary: '#00cc88',    // Green/success
    warning: '#ffaa00',      // Orange
    danger: '#ff4444',       // Red
    purple: '#8855ff',       // Purple accent
  },
  
  // Status colors
  status: {
    live: '#ff3333',
    online: '#00cc66',
    offline: '#666666',
  },
  
  // Gradients
  gradients: {
    subtle: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)',
    glow: 'linear-gradient(180deg, rgba(0,136,255,0.1) 0%, transparent 100%)',
    overlay: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
  }
};

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.3)',
  md: '0 4px 12px rgba(0,0,0,0.4)',
  lg: '0 8px 24px rgba(0,0,0,0.5)',
  xl: '0 16px 48px rgba(0,0,0,0.6)',
  glow: '0 0 20px rgba(0,136,255,0.3)',
  inner: 'inset 0 1px 2px rgba(0,0,0,0.3)',
};

export const transitions = {
  fast: 'all 0.15s ease',
  normal: 'all 0.25s ease',
  slow: 'all 0.4s ease',
  spring: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

// Common component styles
export const componentStyles = {
  // Glass effect panel
  glassPanel: {
    backgroundColor: 'rgba(20, 20, 24, 0.85)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${colors.border.subtle}`,
    borderRadius: radius.lg,
  },
  
  // Toolbar button
  toolbarButton: {
    color: colors.text.secondary,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: radius.sm,
    transition: transitions.fast,
    '&:hover': {
      backgroundColor: colors.bg.hover,
      color: colors.text.primary,
    },
    '&.active': {
      backgroundColor: colors.bg.active,
      color: colors.accent.primary,
    },
  },
  
  // Primary button
  primaryButton: {
    backgroundColor: colors.accent.primary,
    color: '#ffffff',
    fontWeight: 600,
    borderRadius: radius.md,
    textTransform: 'none',
    boxShadow: shadows.md,
    transition: transitions.fast,
    '&:hover': {
      backgroundColor: colors.accent.primaryHover,
      boxShadow: shadows.glow,
      transform: 'translateY(-1px)',
    },
  },
  
  // Input field
  inputField: {
    '& .MuiInputBase-root': {
      backgroundColor: colors.bg.tertiary,
      color: colors.text.primary,
      borderRadius: radius.md,
      transition: transitions.fast,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border.default,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border.strong,
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.accent.primary,
      borderWidth: '1px',
    },
  },
  
  // Card/panel
  card: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: radius.lg,
    border: `1px solid ${colors.border.subtle}`,
    overflow: 'hidden',
    transition: transitions.normal,
    '&:hover': {
      borderColor: colors.border.default,
      boxShadow: shadows.md,
    },
  },
  
  // Slide thumbnail
  slideThumbnail: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.md,
    border: `2px solid transparent`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: transitions.fast,
    '&:hover': {
      borderColor: colors.border.strong,
      transform: 'scale(1.02)',
    },
    '&.selected': {
      borderColor: colors.accent.primary,
      boxShadow: shadows.glow,
    },
  },
  
  // Menu/Dropdown
  menu: {
    '& .MuiPaper-root': {
      backgroundColor: colors.bg.elevated,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius.lg,
      boxShadow: shadows.xl,
      backdropFilter: 'blur(12px)',
    },
    '& .MuiMenuItem-root': {
      color: colors.text.secondary,
      transition: transitions.fast,
      '&:hover': {
        backgroundColor: colors.bg.hover,
        color: colors.text.primary,
      },
    },
  },
  
  // Dialog
  dialog: {
    '& .MuiDialog-paper': {
      backgroundColor: colors.bg.secondary,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius.xl,
      boxShadow: shadows.xl,
    },
  },
};

// Animation keyframes (for use with @keyframes)
export const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideUp: {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.7 },
  },
  glow: {
    '0%, 100%': { boxShadow: '0 0 5px rgba(0,136,255,0.3)' },
    '50%': { boxShadow: '0 0 20px rgba(0,136,255,0.5)' },
  },
};

export default { colors, shadows, transitions, radius, componentStyles, keyframes };
