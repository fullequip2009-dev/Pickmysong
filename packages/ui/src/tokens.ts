/**
 * Pickmysong Design System — Tokens
 * Dark-premium aesthetic: black, purple, glass
 */

export const colors = {
  // Brand
  brand: '#a855f7',
  brandDark: '#7c3aed',
  brandLight: '#c084fc',

  // Background
  bg: '#000000',
  surface: '#0a0a0a',
  surface2: '#111111',
  surface3: '#1a1a1a',

  // Text
  text: '#ffffff',
  textMuted: '#9ca3af',
  textSubtle: '#6b7280',

  // Borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderActive: 'rgba(168, 85, 247, 0.5)',

  // State
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',

  // Transparent
  glass: 'rgba(255, 255, 255, 0.05)',
  glassHover: 'rgba(255, 255, 255, 0.10)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter',
    display: 'Inter',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
} as const;

export const shadows = {
  glow: '0 0 40px rgba(168, 85, 247, 0.3)',
  glowSm: '0 0 20px rgba(168, 85, 247, 0.2)',
  card: '0 4px 24px rgba(0, 0, 0, 0.4)',
} as const;

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Typography = typeof typography;
