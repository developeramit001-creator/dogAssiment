import React, { useEffect, useRef } from 'react';

import {
    ActivityIndicator,
    Animated,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Svg, {
    Circle,
    Ellipse,
    Path,
} from 'react-native-svg';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { theme } from '../theme/theme';
import { useAppSelector } from '../store/hooks';

// -----------------------------------------------------
// Images
// -----------------------------------------------------

const SPLASH_DOG_IMAGE = require('../images/splacescreen.jpeg');
// -----------------------------------------------------
// Props
// -----------------------------------------------------

type SplashScreenProps = {
    bootstrapReady: boolean;
};

// -----------------------------------------------------
// Line Dog Illustration
// -----------------------------------------------------

function LineDogIllustration() {
    return (
        <Svg
            width="190"
            height="190"
            viewBox="0 0 190 190"
            fill="none"
        >
            {/* Outer soft circle */}
            <Circle
                cx="95"
                cy="95"
                r="88"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeOpacity="0.6"
                strokeDasharray="5 8"
            />

            {/* Dog head outline */}
            <Path
                d="
          M57 76
          C48 55 52 35 66 25
          C75 18 84 24 89 38
          C94 34 101 34 107 38
          C113 24 125 18 134 26
          C148 38 150 57 141 77
          C151 89 153 108 145 124
          C137 142 119 151 95 151
          C71 151 53 142 45 124
          C37 108 41 89 57 76
        "
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Left ear */}
            <Path
                d="
          M62 49
          C45 43 35 53 39 70
          C42 82 49 91 59 94
        "
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Right ear */}
            <Path
                d="
          M128 49
          C145 43 155 53 151 70
          C148 82 141 91 131 94
        "
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Eyes */}
            <Ellipse
                cx="73"
                cy="91"
                rx="4"
                ry="5"
                fill="#FFFFFF"
            />

            <Ellipse
                cx="117"
                cy="91"
                rx="4"
                ry="5"
                fill="#FFFFFF"
            />

            {/* Muzzle */}
            <Path
                d="
          M76 111
          C82 103 108 103 114 111
          C122 123 113 137 95 137
          C77 137 68 123 76 111
        "
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Nose */}
            <Path
                d="
          M87 113
          C90 109 100 109 103 113
          C105 118 100 122 95 122
          C90 122 85 118 87 113
        "
                fill="#FFFFFF"
            />

            {/* Mouth */}
            <Path
                d="
          M95 122
          L95 127
          M95 127
          C89 132 84 130 81 127
          M95 127
          C101 132 106 130 109 127
        "
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Face detail */}
            <Path
                d="
          M95 43
          L95 62
          M88 56
          L95 62
          L102 56
        "
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.85"
            />
        </Svg>
    );
}

// -----------------------------------------------------
// Splash Screen
// -----------------------------------------------------

export default function SplashScreen({
    bootstrapReady,
}: SplashScreenProps) {
    const insets = useSafeAreaInsets();

    const pulse = useRef(
        new Animated.Value(0.97),
    ).current;

    const syncing = useAppSelector(
        state => state.sync.syncing,
    );

    const progress = useAppSelector(
        state => state.sync.progress,
    );

    const error = useAppSelector(
        state => state.sync.error,
    );

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 1100,
                    useNativeDriver: true,
                }),

                Animated.timing(pulse, {
                    toValue: 0.97,
                    duration: 1100,
                    useNativeDriver: true,
                }),
            ]),
        );

        animation.start();

        return () => {
            animation.stop();
            pulse.stopAnimation();
        };
    }, [pulse]);

    const percentage = Math.round(
        Math.max(0, Math.min(1, progress)) * 100,
    );

    const isLoading = !bootstrapReady;

    return (
        <View
            style={[
                styles.root,
                {
                    paddingTop: insets.top + 24,
                    paddingBottom: insets.bottom + 24,
                },
            ]}
        >
            {/* --------------------------------------------- */}
            {/* Header */}
            {/* --------------------------------------------- */}

            <View style={styles.header}>
                <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>🐾</Text>
                </View>

                <View>
                    <Text style={styles.brandName}>
                        PAWBUDDY
                    </Text>

                    <Text style={styles.brandSubtitle}>
                        YOUR DOG WORLD
                    </Text>
                </View>
            </View>

            {/* --------------------------------------------- */}
            {/* Main Content */}
            {/* --------------------------------------------- */}

            <View style={styles.centerContent}>
                <Animated.View
                    style={[
                        styles.imageWrapper,
                        {
                            transform: [
                                {
                                    scale: pulse,
                                },
                            ],
                        },
                    ]}
                >
                    {/* Dog Image */}
                    <Image
                        source={SPLASH_DOG_IMAGE}
                        resizeMode="cover"
                        style={styles.dogImage}
                    />

                    {/* Soft Image Overlay */}
                    <View style={styles.imageOverlay} />

                    {/* Line Dog Over Image */}
                    <View style={styles.lineDogWrapper}>
                        <LineDogIllustration />
                    </View>

                    {/* Small Badge */}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>🐾</Text>
                    </View>
                </Animated.View>

                <Text style={styles.heading}>
                    Every dog has a story.
                </Text>

                <Text style={styles.description}>
                    Discover amazing breeds, save your
                    favourites and explore your dog world
                    even when you are offline.
                </Text>

                {/* ----------------------------------------- */}
                {/* Loading / Completed State */}
                {/* ----------------------------------------- */}

                {isLoading ? (
                    <>
                        <View style={styles.statusRow}>
                            <ActivityIndicator
                                size="small"
                                color={colors.coral}
                            />

                            <Text style={styles.statusText}>
                                {syncing
                                    ? `Syncing library ${percentage}%`
                                    : 'Preparing your library'}
                            </Text>
                        </View>

                        <View style={styles.progressTrack}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${percentage}%`,
                                    },
                                ]}
                            />
                        </View>
                    </>
                ) : (
                    <View style={styles.completedRow}>
                        <View style={styles.checkCircle}>
                            <Text style={styles.checkText}>✓</Text>
                        </View>

                        <View style={styles.completedContent}>
                            <Text style={styles.completedTitle}>
                                Your library is ready
                            </Text>

                            <Text style={styles.completedSubtitle}>
                                Taking you to the next step...
                            </Text>
                        </View>
                    </View>
                )}

                {!!error && (
                    <Text style={styles.errorText}>
                        Using available cached data.
                    </Text>
                )}
            </View>

            {/* --------------------------------------------- */}
            {/* Footer */}
            {/* --------------------------------------------- */}

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Made with love for dog lovers
                </Text>

                <Text style={styles.footerBrand}>
                    🐾 PawBuddy
                </Text>
            </View>
        </View>
    );
}

// -----------------------------------------------------
// Styles
// -----------------------------------------------------

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.bg,
        paddingHorizontal: 24,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    logoCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: colors.cream,
        borderWidth: 1,
        borderColor: colors.border,
    },

    logoText: {
        fontSize: 24,
    },

    brandName: {
        color: colors.text,
        fontSize: 14,
        letterSpacing: 2.5,
        fontFamily: theme.fonts.extraBold,
    },

    brandSubtitle: {
        marginTop: 3,
        color: colors.muted,
        fontSize: 9,
        letterSpacing: 1.5,
        fontFamily: theme.fonts.semibold,
    },

    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    imageWrapper: {
        width: 270,
        height: 270,
        borderRadius: 135,

        overflow: 'hidden',

        backgroundColor: colors.cream,
        borderWidth: 9,
        borderColor: colors.surface,

        elevation: 10,

        shadowColor: colors.shadow,
        shadowOpacity: 0.22,
        shadowRadius: 20,

        shadowOffset: {
            width: 0,
            height: 10,
        },
    },

    dogImage: {
        width: '100%',
        height: '100%',
    },

    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(25, 25, 25, 0.12)',
    },

    lineDogWrapper: {
        ...StyleSheet.absoluteFillObject,

        alignItems: 'center',
        justifyContent: 'center',
    },

    badge: {
        position: 'absolute',
        right: 8,
        bottom: 8,

        width: 58,
        height: 58,
        borderRadius: 29,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: colors.surface,
        borderWidth: 4,
        borderColor: colors.cream,
    },

    badgeText: {
        fontSize: 27,
    },

    heading: {
        marginTop: 34,

        color: colors.text,
        fontSize: 28,
        lineHeight: 35,

        textAlign: 'center',
        fontFamily: theme.fonts.extraBold,
    },

    description: {
        maxWidth: 325,
        marginTop: 13,

        color: colors.muted,
        fontSize: 15,
        lineHeight: 23,

        textAlign: 'center',
        fontFamily: theme.fonts.regular,
    },

    statusRow: {
        marginTop: 30,

        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },

    statusText: {
        color: colors.inkSoft,
        fontSize: 13,
        fontFamily: theme.fonts.semibold,
    },

    progressTrack: {
        width: '100%',
        maxWidth: 320,
        height: 6,

        marginTop: 15,

        overflow: 'hidden',
        borderRadius: 3,

        backgroundColor: colors.border,
    },

    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: colors.coral,
    },

    completedRow: {
        marginTop: 30,

        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,

        paddingHorizontal: 18,
        paddingVertical: 13,

        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    checkCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: colors.cream,
    },

    checkText: {
        color: colors.coral,
        fontSize: 18,
        fontFamily: theme.fonts.extraBold,
    },

    completedContent: {
        flex: 1,
    },

    completedTitle: {
        color: colors.text,
        fontSize: 13,
        fontFamily: theme.fonts.semibold,
    },

    completedSubtitle: {
        marginTop: 3,
        color: colors.muted,
        fontSize: 11,
        fontFamily: theme.fonts.regular,
    },

    errorText: {
        marginTop: 12,

        color: colors.muted,
        fontSize: 12,

        textAlign: 'center',
        fontFamily: theme.fonts.regular,
    },

    footer: {
        alignItems: 'center',
        gap: 5,
    },

    footerText: {
        color: colors.muted,
        fontSize: 11,
        fontFamily: theme.fonts.regular,
    },

    footerBrand: {
        color: colors.inkSoft,
        fontSize: 12,
        fontFamily: theme.fonts.semibold,
    },
});
