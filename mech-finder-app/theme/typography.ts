import { TextStyle } from 'react-native';

type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const createTypography = (scale = 1): Record<string, TextStyle> => ({
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32 * scale,
    lineHeight: 38 * scale,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 28 * scale,
    lineHeight: 34 * scale,
    letterSpacing: -0.5,
  },
  h3: {
    fontFamily: fontFamily.semibold,
    fontSize: 24 * scale,
    lineHeight: 29 * scale,
    letterSpacing: -0.5,
  },
  h4: {
    fontFamily: fontFamily.semibold,
    fontSize: 20 * scale,
    lineHeight: 24 * scale,
    letterSpacing: -0.5,
  },
  subtitle1: {
    fontFamily: fontFamily.medium,
    fontSize: 18 * scale,
    lineHeight: 22 * scale,
    letterSpacing: -0.25,
  },
  subtitle2: {
    fontFamily: fontFamily.medium,
    fontSize: 16 * scale,
    lineHeight: 20 * scale,
    letterSpacing: -0.25,
  },
  body1: {
    fontFamily: fontFamily.regular,
    fontSize: 16 * scale,
    lineHeight: 24 * scale,
    letterSpacing: 0,
  },
  body2: {
    fontFamily: fontFamily.regular,
    fontSize: 14 * scale,
    lineHeight: 21 * scale,
    letterSpacing: 0,
  },
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: 16 * scale,
    lineHeight: 24 * scale,
    letterSpacing: 0.25,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12 * scale,
    lineHeight: 16 * scale,
    letterSpacing: 0.4,
  },
  overline: {
    fontFamily: fontFamily.medium,
    fontSize: 10 * scale,
    lineHeight: 14 * scale,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export const typography = createTypography();