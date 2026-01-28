// Design System: 60-30-10 Color Rule
// 60% - Background (Black/Dark)
// 30% - Accent Colors (Calm Blue, Green, Purple)
// 10% - Text/Highlights (White)

export const colors = {
  // 60% - Backgrounds
  background: {
    primary: '#0a0a0a',      // Main background
    secondary: '#1a1a1a',    // Cards, elevated surfaces
    tertiary: '#252525',     // Subtle elevation
  },

  // 30% - Accent Colors (Calm, desaturated)
  accent: {
    blue: '#5b9bd5',         // Calm blue
    green: '#52a586',        // Muted green
    purple: '#8b7fc7',       // Soft purple
  },

  // 10% - Text and Highlights
  text: {
    primary: '#ffffff',      // Main text
    secondary: '#a0a0a0',    // Secondary text
    tertiary: '#6b7280',     // Tertiary text, placeholders
  },

  // Semantic Colors (using accent colors)
  status: {
    success: '#52a586',      // Green
    warning: '#d4a55b',      // Muted orange
    error: '#c77f7f',        // Muted red
    info: '#5b9bd5',         // Blue
  },

  // Priority Colors (calm, not fully saturated)
  priority: {
    urgent: '#c77f7f',       // Muted red
    high: '#d4a55b',         // Muted orange
    medium: '#5b9bd5',       // Calm blue
    low: '#6b7280',          // Gray
  },

  // Borders and Dividers
  border: {
    primary: '#2a2a2a',
    secondary: '#353535',
  },
};

// Helper to get accent color by index or type
export const getAccentColor = (index: number): string => {
  const accentColors = [colors.accent.blue, colors.accent.green, colors.accent.purple];
  return accentColors[index % accentColors.length];
};
