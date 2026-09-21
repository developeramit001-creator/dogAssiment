import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from 'react-native';

import { theme } from '../theme/theme';
import { Icon } from './Icon';

export function Loading({
  label = 'Loading…',
}: {
  label?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.bg,
      }}
    >
      <Icon
        name="paw"
        size={46}
        color={theme.colors.coral}
      />

      <ActivityIndicator
        color={theme.colors.coral}
        style={{
          marginTop: theme.spacing.md,
        }}
      />

      <Text
        style={{
          marginTop: theme.spacing.sm,
          color: theme.colors.muted,
          fontFamily: theme.fonts.semibold,
          fontSize: theme.typography.bodySmall.fontSize,
          lineHeight: theme.typography.bodySmall.lineHeight,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export function OfflineBanner({
  online,
}: {
  online: boolean;
}) {
  if (online) return null;

  return (
    <View
      style={{
        marginHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.sm,
        padding: theme.spacing.sm,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.cream,
        borderWidth: 1,
        borderColor: theme.colors.peach,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
      }}
    >
      {/* Offline Icon Container */}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: theme.colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon
          name="offline"
          size={17}
          color={theme.colors.coralDark}
          strokeWidth={2.2}
        />
      </View>

      {/* Offline Message */}
      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.semibold,
            fontSize: theme.typography.labelSmall.fontSize,
            lineHeight: theme.typography.labelSmall.lineHeight,
          }}
        >
          You're offline
        </Text>

        <Text
          style={{
            marginTop: 2,
            color: theme.colors.muted,
            fontFamily: theme.fonts.regular,
            fontSize: theme.typography.labelSmall.fontSize,
            lineHeight: theme.typography.labelSmall.lineHeight,
          }}
        >
          Cached data is available
        </Text>
      </View>

      {/* Offline Status */}
      <View
        style={{
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: 5,
          borderRadius: theme.radius.sm,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.peach,
        }}
      >
        <Text
          style={{
            color: theme.colors.coralDark,
            fontFamily: theme.fonts.semibold,
            fontSize: 11,
            lineHeight: 14,
          }}
        >
          Offline
        </Text>
      </View>
    </View>
  );
}

export function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
      }}
    >
      {children}
    </View>
  );
}

export function Button({
  title,
  onPress,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({pressed}) => ({
        height: 52,
        borderRadius: theme.radius.md,
        backgroundColor: secondary
          ? theme.colors.cream
          : theme.colors.coral,
        alignItems: 'center',
        justifyContent: 'center',

        // Press feedback
        opacity: pressed ? 0.8 : 1,
        transform: [
          {
            scale: pressed ? 0.97 : 1,
          },
        ],
      })}
    >
      <Text
        style={{
          color: secondary
            ? theme.colors.coralDark
            : theme.colors.white,
          fontFamily: theme.fonts.bold,
          fontSize: theme.typography.button.fontSize,
          lineHeight: theme.typography.button.lineHeight,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <Text
      style={{
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
        fontSize: theme.typography.h3.fontSize,
        lineHeight: theme.typography.h3.lineHeight,
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.sm,
      }}
    >
      {title}
    </Text>
  );
}

export function Scale({
  value,
  max = 5,
}: {
  value: number;
  max?: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: theme.spacing.xs,
      }}
    >
      {Array.from({ length: max }, (_, i) => (
        <View
          key={i}
          style={{
            height: 7,
            flex: 1,
            maxWidth: 28,
            borderRadius: theme.radius.sm,
            backgroundColor:
              i < Math.round(value)
                ? theme.colors.coral
                : theme.colors.border,
          }}
        />
      ))}
    </View>
  );
}
