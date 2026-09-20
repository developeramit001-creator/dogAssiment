
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { theme } from '../theme/theme';
import { useAppSelector } from '../store/hooks';

const SPLASH_DOG_IMAGE =
    'https://images.dogapi.dog/ohf04zsgh911n30j53gsn5hu9o79';

export default function SplashScreen() {
    const insets = useSafeAreaInsets();

    const pulse = useRef(new Animated.Value(0.96)).current;

    const syncing = useAppSelector(state => state.sync.syncing);
    const progress = useAppSelector(state => state.sync.progress);
    const error = useAppSelector(state => state.sync.error);

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 0.96,
                    duration: 900,
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
            {/* Brand */}
            <View style={styles.topRow}>
                <View style={styles.brandMark}>
                    <Text style={styles.brandMarkText}>🐾</Text>
                </View>

                <Text style={styles.topLabel}>PAWBUDDY</Text>
            </View>

            {/* Center Content */}
            <View style={styles.centerContent}>
                <Animated.View
                    style={[
                        styles.imageContainer,
                        {
                            transform: [{ scale: pulse }],
                        },
                    ]}
                >
                    <Image
                        source={{ uri: SPLASH_DOG_IMAGE }}
                        resizeMode="cover"
                        style={styles.image}
                    />

                    <View style={styles.imageBadge}>
                        <Text style={styles.imageBadgeText}>🐶</Text>
                    </View>
                </Animated.View>

                <Text style={styles.title}>
                    Your dog world is getting ready
                </Text>

                <Text style={styles.subtitle}>
                    Preparing your breed library so you can explore
                    even when you are offline.
                </Text>

                {/* Sync Status */}
                <View style={styles.statusRow}>
                    <ActivityIndicator
                        size="small"
                        color={colors.coral}
                    />

                    <Text style={styles.statusText}>
                        {syncing
                            ? `Syncing your library ${percentage}%`
                            : 'Loading your library'}
                    </Text>
                </View>

                {/* Progress Bar */}
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

                {/* Error / Cache Message */}
                {!!error && (
                    <Text style={styles.errorText}>
                        Using available cached data. Almost there…
                    </Text>
                )}
            </View>

            {/* Footer */}
            <Text style={styles.footerText}>
                Made for dog lovers • PawBuddy
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.bg,
        paddingHorizontal: 24,
    },

    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    brandMark: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cream,
    },

    brandMarkText: {
        fontSize: 23,
    },

    topLabel: {
        color: colors.text,
        fontSize: 13,
        letterSpacing: 2,
        fontFamily: theme.fonts.extraBold,
    },

    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageContainer: {
        width: 238,
        height: 238,
        borderRadius: 119,
        overflow: 'hidden',
        backgroundColor: colors.cream,
        borderWidth: 10,
        borderColor: colors.surface,
        elevation: 8,
        shadowColor: colors.shadow,
        shadowOpacity: 0.2,
        shadowRadius: 18,
        shadowOffset: {
            width: 0,
            height: 8,
        },
    },

    image: {
        width: '100%',
        height: '100%',
    },

    imageBadge: {
        position: 'absolute',
        right: 8,
        bottom: 8,
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
    },

    imageBadgeText: {
        fontSize: 28,
    },

    title: {
        marginTop: 32,
        color: colors.text,
        fontSize: 27,
        lineHeight: 34,
        textAlign: 'center',
        fontFamily: theme.fonts.extraBold,
    },

    subtitle: {
        marginTop: 12,
        maxWidth: 320,
        color: colors.muted,
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        fontFamily: theme.fonts.regular,
    },

    statusRow: {
        marginTop: 28,
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
        marginTop: 14,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: colors.border,
    },

    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: colors.coral,
    },

    errorText: {
        marginTop: 12,
        color: colors.muted,
        fontSize: 12,
        textAlign: 'center',
        fontFamily: theme.fonts.regular,
    },

    footerText: {
        color: colors.muted,
        fontSize: 12,
        textAlign: 'center',
        fontFamily: theme.fonts.regular,
    },
});
