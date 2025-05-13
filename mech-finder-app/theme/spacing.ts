// Base spacing unit (8px)
const BASE = 8;

export const spacing = {
  xs: BASE / 2, // 4px
  sm: BASE, // 8px
  md: BASE * 2, // 16px
  lg: BASE * 3, // 24px
  xl: BASE * 4, // 32px
  xxl: BASE * 6, // 48px
  xxxl: BASE * 8, // 64px
  
  // Specific spacing helpers
  screenHorizontal: BASE * 2, // 16px
  screenVertical: BASE * 2, // 16px
  cardPadding: BASE * 2, // 16px
  buttonPadding: BASE * 1.5, // 12px
  inputHeight: BASE * 6, // 48px
  iconSize: {
    small: BASE * 2, // 16px
    medium: BASE * 3, // 24px
    large: BASE * 4, // 32px
  },
  
  // Function to multiply the base unit
  multiply: (multiplier: number) => BASE * multiplier,
};