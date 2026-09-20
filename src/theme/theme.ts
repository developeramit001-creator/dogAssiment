import { colors } from './colors';
import { fonts } from './fonts';
import { typography } from './typography';

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
} as const;

export const radius = {
    sm: 10,
    md: 16,
    lg: 22,
    xl: 28,
} as const;

export const cardStyle = {
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
} as const;

export const theme = {
    colors,
    fonts,
    typography,
    spacing,
    radius,
    cardStyle,
} as const;

export type Theme = typeof theme;
