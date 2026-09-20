// src/theme/typography.ts

import { fonts } from './fonts';

export const typography = {
    sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
    },

    display: {
        fontFamily: fonts.extraBold,
        fontSize: 30,
        lineHeight: 38,
    },

    h1: {
        fontFamily: fonts.extraBold,
        fontSize: 24,
        lineHeight: 32,
    },

    h2: {
        fontFamily: fonts.bold,
        fontSize: 20,
        lineHeight: 28,
    },

    h3: {
        fontFamily: fonts.bold,
        fontSize: 18,
        lineHeight: 24,
    },

    title: {
        fontFamily: fonts.bold,
        fontSize: 16,
        lineHeight: 22,
    },

    body: {
        fontFamily: fonts.regular,
        fontSize: 16,
        lineHeight: 24,
    },

    bodySmall: {
        fontFamily: fonts.regular,
        fontSize: 14,
        lineHeight: 20,
    },

    label: {
        fontFamily: fonts.semibold,
        fontSize: 14,
        lineHeight: 20,
    },

    labelSmall: {
        fontFamily: fonts.semibold,
        fontSize: 12,
        lineHeight: 16,
    },

    button: {
        fontFamily: fonts.bold,
        fontSize: 16,
        lineHeight: 20,
    },

    caption: {
        fontFamily: fonts.regular,
        fontSize: 12,
        lineHeight: 16,
    },

    nav: {
        fontFamily: fonts.semibold,
        fontSize: 12,
        lineHeight: 16,
    },

    decorative: {
        fontFamily: fonts.decorative,
        fontSize: 26,
        lineHeight: 32,
    },
} as const;
