/**
 * BidWar.in Visual Design Tokens
 * Derived strictly from the official BidWar website (bidwar.in):
 * - Deep navy/blue foundation (#070D24, #0A1230, #0B1538)
 * - BidWar signature gold (#FFB800) as primary accent
 * - Crisp white typography with high-contrast hierarchy
 * - Subtle tech borders (#1A2C68, #132252)
 */

export const BIDWAR_THEME = {
  colors: {
    // Foundation Navy
    primaryDark: '#070D24',        // Deepest BidWar broadcast navy
    primary: '#0A1230',            // Primary container navy
    surface: '#0B1538',            // Elevated surface navy
    surfaceElevated: '#101E4D',    // Hovered / modal navy
    card: '#0D1944',               // Card background
    cardHover: '#13235A',          // Hovered card
    input: '#070E29',              // Form input background
    
    // Navy Borders
    borderSubtle: '#132252',       // Subtle dividers
    border: '#1A2C68',             // Default card/input borders
    borderFocus: '#FFB800',        // Active/focused borders (Gold)

    // Primary Accent: BidWar Gold
    gold: {
      light: '#FDE047',            // Bright highlight
      primary: '#FFB800',          // Signature BidWar gold
      hover: '#FBBF24',            // Hover state
      dark: '#D97706',             // Deep gold accent
      muted: 'rgba(255, 184, 0, 0.15)', // Subtle gold tint
      glow: 'rgba(255, 184, 0, 0.25)',  // Glow shadow
    },

    // Typography
    text: {
      white: '#FFFFFF',
      secondary: '#E2E8F0',
      muted: '#94A3B8',
      dim: '#64748B',
      gold: '#FFB800',
    }
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    standard: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
  }
} as const;
