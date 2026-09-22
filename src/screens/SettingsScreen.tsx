import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '../components/UI';
import { theme } from '../theme/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: theme.spacing.sm,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border ?? '#EDE7E2',
        }}
      >
        <Text
          style={{
            flex: 1,
            color: theme.colors.muted,
            ...theme.typography.bodySmall,
            fontFamily: theme.fonts.regular,
          }}
        >
          {label}
        </Text>

        <Text
          style={{
            flex: 1,
            textAlign: 'right',
            color: theme.colors.text,
            ...theme.typography.bodySmall,
            fontFamily: theme.fonts.semibold,
          }}
        >
          {value}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
      }}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingHorizontal: theme.spacing.md,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* HEADER */}
      <View
        style={{
          paddingTop: theme.spacing.md,
          paddingBottom: theme.spacing.lg,
        }}
      >
        <Text
          style={{
            color: theme.colors.text,
            ...theme.typography.h1,
            fontFamily: theme.fonts.semibold,
          }}
        >
          Settings
        </Text>

        <Text
          style={{
            marginTop: theme.spacing.xs,
            color: theme.colors.muted,
            ...theme.typography.bodySmall,
            fontFamily: theme.fonts.regular,
          }}
        >
          Manage your app preferences and application information.
        </Text>
      </View>

      {/* APP INFORMATION */}
      <Card>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFF0E9',
            }}
          >
            <Text
              style={{
                fontSize: 25,
              }}
            >
              🐾
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              marginLeft: theme.spacing.sm,
            }}
          >
            <Text
              style={{
                color: theme.colors.text,
                ...theme.typography.h3,
                fontFamily: theme.fonts.semibold,
              }}
            >
              PawBuddy
            </Text>

            <Text
              style={{
                marginTop: 2,
                color: theme.colors.muted,
                ...theme.typography.caption,
                fontFamily: theme.fonts.regular,
              }}
            >
              Dog Breed Explorer
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor: '#E8F6ED',
            }}
          >
            <Text
              style={{
                color: '#287A49',
                fontSize: 11,
                fontFamily: theme.fonts.semibold,
              }}
            >
              ACTIVE
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: theme.colors.muted,
            ...theme.typography.bodySmall,
            fontFamily: theme.fonts.regular,
            lineHeight: 21,
          }}
        >
          Explore dog breeds and breed groups with online and offline support.
          Your downloaded data remains available even when you have no internet
          connection.
        </Text>
      </Card>

      {/* APPLICATION DETAILS */}
      <View
        style={{
          marginTop: theme.spacing.lg,
        }}
      >
        <Text
          style={{
            marginBottom: theme.spacing.sm,
            color: theme.colors.text,
            ...theme.typography.h3,
            fontFamily: theme.fonts.semibold,
          }}
        >
          Application Details
        </Text>

        <Card>
          <InfoRow label="Application" value="PawBuddy" />
          <InfoRow label="Framework" value="React Native CLI" />
          <InfoRow label="Language" value="TypeScript" />
          <InfoRow label="State Management" value="Redux Toolkit" />
          <InfoRow label="API & Cache" value="RTK Query" />
          <InfoRow label="Local Storage" value="SQLite" />
          <InfoRow label="Navigation" value="React Navigation" />
          <InfoRow label="Architecture" value="Offline First" />
        </Card>
      </View>

      {/* FOOTER */}
      <View
        style={{
          alignItems: 'center',
          paddingVertical: theme.spacing.lg,
        }}
      >
        <Text
          style={{
            color: theme.colors.muted,
            ...theme.typography.caption,
            fontFamily: theme.fonts.regular,
            textAlign: 'center',
          }}
        >
          PawBuddy • Built for Tripare AI Assignment
        </Text>

        <Text
          style={{
            marginTop: 4,
            color: theme.colors.muted,
            ...theme.typography.caption,
            fontFamily: theme.fonts.regular,
          }}
        >
          React Native CLI • Offline Ready
        </Text>
      </View>
    </ScrollView>
  );
}