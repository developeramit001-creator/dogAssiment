import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '../components/UI';
import { clearAll } from '../database';
import { clearCache } from '../store/cacheSlice';
import { useAppDispatch } from '../store/hooks';
import { theme } from '../theme/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [clearing, setClearing] = useState(false);

  const handleClearCache = () => {
    if (clearing) {
      return;
    }

    Alert.alert(
      'Clear offline data?',
      'This will permanently remove all locally stored dog breeds and groups from your device. You can download the data again when you are online.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              setClearing(true);

              // Clear local SQLite database
              await clearAll();

              // Clear Redux cache state
              dispatch(clearCache());

              Alert.alert(
                'Cache Cleared',
                'All offline data has been removed successfully.',
              );
            } catch (error) {
              console.error('Clear offline cache error:', error);

              Alert.alert(
                'Unable to Clear',
                'Something went wrong while clearing offline data. Please try again.',
              );
            } finally {
              setClearing(false);
            }
          },
        },
      ],
    );
  };

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
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
        paddingTop: insets.top,
        paddingHorizontal: theme.spacing.md,
      }}
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
          Manage your app preferences and offline data.
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

      {/* OFFLINE DATA */}
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
          Offline Data
        </Text>

        <Card>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 13,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#EAF5EF',
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                🗄️
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
                  ...theme.typography.bodySmall,
                  fontFamily: theme.fonts.semibold,
                }}
              >
                Local database storage
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  color: theme.colors.muted,
                  ...theme.typography.caption,
                  fontFamily: theme.fonts.regular,
                  lineHeight: 18,
                }}
              >
                Your downloaded dog breed and group data is stored locally on
                your device for offline access.
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.border ?? '#EDE7E2',
              marginVertical: theme.spacing.md,
            }}
          />

          <Text
            style={{
              color: theme.colors.muted,
              ...theme.typography.caption,
              fontFamily: theme.fonts.regular,
              lineHeight: 18,
            }}
          >
            Clearing offline data will remove locally saved records. Your data
            can be downloaded again through the sync option when you are
            connected to the internet.
          </Text>

          <Pressable
            onPress={handleClearCache}
            disabled={clearing}
            style={{
              minHeight: 52,
              marginTop: theme.spacing.md,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              backgroundColor: clearing
                ? '#F8DCD6'
                : '#FFF0ED',
              borderWidth: 1,
              borderColor: '#F6D0C8',
              opacity: clearing ? 0.75 : 1,
            }}
          >
            {clearing ? (
              <>
                <ActivityIndicator
                  size="small"
                  color={theme.colors.danger}
                />

                <Text
                  style={{
                    marginLeft: 8,
                    color: theme.colors.danger,
                    fontFamily: theme.fonts.semibold,
                    ...theme.typography.bodySmall,
                  }}
                >
                  Clearing data...
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 17,
                  }}
                >
                  🗑️
                </Text>

                <Text
                  style={{
                    marginLeft: 8,
                    color: theme.colors.danger,
                    fontFamily: theme.fonts.semibold,
                    ...theme.typography.bodySmall,
                  }}
                >
                  Clear Offline Cache
                </Text>
              </>
            )}
          </Pressable>
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
    </View>
  );
}
