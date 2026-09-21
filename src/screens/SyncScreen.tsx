import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { resetSyncState, setBootstrapReady } from '../store/syncSlice';
import { Button, Card, OfflineBanner } from '../components/UI';
import { clearAll } from '../database';
import { clearCache } from '../store/cacheSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { syncAll } from '../store/syncService';
import { theme } from '../theme/theme';
import { formatDate } from '../utils/format';
import { clearOfflineAppData } from '../store/appSlice';

export default function SyncScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const dispatch = useAppDispatch();
  const syncState = useAppSelector(state => state.sync);

  const [clearing, setClearing] = useState(false);

  const progress = Math.min(
    Math.max(Number(syncState.progress) || 0, 0),
    1,
  );

  const progressPercentage = Math.round(progress * 100);

  const statusColor = syncState.online
    ? theme.colors.sage
    : theme.colors.danger;

  const statusBackground = syncState.online
    ? 'rgba(126, 161, 126, 0.12)'
    : 'rgba(214, 91, 91, 0.10)';

  const isBusy = syncState.syncing || clearing;

  const refresh = () => {
    if (isBusy) {
      return;
    }

    syncAll();
  };

  const handleClearOfflineData = () => {
    if (isBusy || clearing) return;

    Alert.alert(
      'Clear offline data?',
      'Downloaded data will be cleared. Your favorites will remain safe.',
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

              // Clear SQLite database
              await clearAll();

              // Clear Redux cache
              dispatch(clearCache());
// Reset Sync Center values
dispatch(resetSyncState());
              // Clear onboarding/settings only
              // Favorites will remain safe
              await dispatch(clearOfflineAppData() as never);

              // IMPORTANT:
              // Do not change bootstrapReady.
              // User will stay on the same Sync tab.
              // Current app mein directly Explore tab par jao

              Alert.alert(
                'Data Cleared',
                'Offline data cleared successfully. Your favorites are safe.',
              );
            } catch (error) {
              console.error('Clear offline data error:', error);

              Alert.alert(
                'Unable to Clear',
                'Something went wrong while clearing offline data.',
              );
            } finally {
              setClearing(false);
            }
          },
        },
      ],
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
        paddingTop: insets.top,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* HEADER */}
        <View
          style={{
            paddingTop: theme.spacing.md,
            paddingBottom: theme.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.fonts.semibold,
                  fontSize: 24,
                  lineHeight: 30,
                  letterSpacing: -0.35,
                }}
              >
                Sync Center
              </Text>

              <Text
                style={{
                  marginTop: 5,
                  color: theme.colors.muted,
                  ...theme.typography.caption,
                  fontFamily: theme.fonts.regular,
                  lineHeight: 18,
                }}
              >
                Keep your dog library updated and available offline.
              </Text>
            </View>

            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFF0E8',
                marginLeft: theme.spacing.sm,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                }}
              >
                🐾
              </Text>
            </View>
          </View>
        </View>

        {/* NETWORK STATUS */}
        <OfflineBanner online={syncState.online} />

        {/* LIBRARY STATUS */}
        <View
          style={{
            marginTop: theme.spacing.md,
          }}
        >
          <Card>
            {/* CARD HEADER */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: theme.spacing.md,
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.semibold,
                    fontSize: 17,
                    lineHeight: 22,
                  }}
                >
                  Library status
                </Text>

                <Text
                  style={{
                    marginTop: 3,
                    color: theme.colors.muted,
                    ...theme.typography.caption,
                    fontFamily: theme.fonts.regular,
                  }}
                >
                  Current local library information
                </Text>
              </View>

              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: statusBackground,
                }}
              >
                <Text
                  style={{
                    color: statusColor,
                    ...theme.typography.labelSmall,
                    fontFamily: theme.fonts.semibold,
                    fontSize: 10,
                    letterSpacing: 0.4,
                  }}
                >
                  {syncState.online ? 'CONNECTED' : 'OFFLINE'}
                </Text>
              </View>
            </View>

            {/* CACHED BREEDS */}
            <View
              style={{
                paddingVertical: theme.spacing.sm,
              }}
            >
              <Text
                style={{
                  color: theme.colors.muted,
                  ...theme.typography.caption,
                  fontFamily: theme.fonts.regular,
                }}
              >
                Cached breeds
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                  marginTop: 2,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.coral,
                    fontFamily: theme.fonts.semibold,
                    fontSize: 36,
                    lineHeight: 44,
                  }}
                >
                  {syncState.cachedCount}
                </Text>

                <Text
                  style={{
                    marginLeft: 9,
                    color: theme.colors.muted,
                    ...theme.typography.bodySmall,
                    fontFamily: theme.fonts.regular,
                    fontSize: 12,
                  }}
                >
                  breeds saved on this device
                </Text>
              </View>
            </View>

            {/* DIVIDER */}
            <View
              style={{
                height: 1,
                backgroundColor: 'rgba(47, 42, 39, 0.08)',
                marginVertical: theme.spacing.md,
              }}
            />

            {/* LAST SYNC */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: theme.spacing.md,
              }}
            >
              <Text
                style={{
                  color: theme.colors.muted,
                  ...theme.typography.bodySmall,
                  fontFamily: theme.fonts.regular,
                }}
              >
                Last synced
              </Text>

              <Text
                style={{
                  maxWidth: '62%',
                  textAlign: 'right',
                  color: theme.colors.text,
                  ...theme.typography.labelSmall,
                  fontFamily: theme.fonts.semibold,
                }}
              >
                {formatDate(syncState.lastSync)}
              </Text>
            </View>

            {/* CONNECTION */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: theme.spacing.md,
              }}
            >
              <Text
                style={{
                  color: theme.colors.muted,
                  ...theme.typography.bodySmall,
                  fontFamily: theme.fonts.regular,
                }}
              >
                Connection
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: statusColor,
                  }}
                />

                <Text
                  style={{
                    marginLeft: 7,
                    color: statusColor,
                    ...theme.typography.labelSmall,
                    fontFamily: theme.fonts.semibold,
                  }}
                >
                  {syncState.online ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>

            {/* SYNC PROGRESS */}
            {syncState.syncing && (
              <View
                style={{
                  marginBottom: theme.spacing.md,
                  padding: theme.spacing.md,
                  borderRadius: 16,
                  backgroundColor: 'rgba(126, 161, 126, 0.10)',
                  borderWidth: 1,
                  borderColor: 'rgba(126, 161, 126, 0.15)',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.sage}
                    />

                    <Text
                      style={{
                        marginLeft: 8,
                        color: theme.colors.sage,
                        ...theme.typography.labelSmall,
                        fontFamily: theme.fonts.semibold,
                      }}
                    >
                      Syncing library
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: theme.colors.sage,
                      ...theme.typography.labelSmall,
                      fontFamily: theme.fonts.semibold,
                    }}
                  >
                    {progressPercentage}%
                  </Text>
                </View>

                <View
                  style={{
                    height: 8,
                    borderRadius: 999,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(126, 161, 126, 0.18)',
                  }}
                >
                  <View
                    style={{
                      width: `${progressPercentage}%`,
                      height: '100%',
                      borderRadius: 999,
                      backgroundColor: theme.colors.sage,
                    }}
                  />
                </View>

                <Text
                  style={{
                    marginTop: 9,
                    color: theme.colors.muted,
                    ...theme.typography.caption,
                    fontFamily: theme.fonts.regular,
                  }}
                >
                  Updating dog breeds and images...
                </Text>
              </View>
            )}

            {/* ERROR MESSAGE */}
            {syncState.error && (
              <View
                style={{
                  marginBottom: theme.spacing.md,
                  padding: theme.spacing.md,
                  borderRadius: 15,
                  backgroundColor: 'rgba(214, 91, 91, 0.08)',
                  borderWidth: 1,
                  borderColor: 'rgba(214, 91, 91, 0.16)',
                }}
              >
                <Text
                  style={{
                    marginBottom: 4,
                    color: theme.colors.danger,
                    ...theme.typography.labelSmall,
                    fontFamily: theme.fonts.semibold,
                  }}
                >
                  Sync failed
                </Text>

                <Text
                  style={{
                    color: theme.colors.danger,
                    ...theme.typography.caption,
                    fontFamily: theme.fonts.regular,
                    lineHeight: 18,
                  }}
                >
                  {syncState.error}
                </Text>
              </View>
            )}

            {/* SYNC BUTTON */}
            <Button
              title={syncState.syncing ? 'Syncing...' : 'Sync now'}
              onPress={refresh}
            />

            {/* CLEAR OFFLINE DATA */}
            <View
              style={{
                marginTop: theme.spacing.md,
                padding: theme.spacing.md,
                borderRadius: 18,
                backgroundColor: '#FFF8F5',
                borderWidth: 1,
                borderColor: '#F5E1D9',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 13,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FCE8E2',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 19,
                    }}
                  >
                    🗑️
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
                    Offline storage
                  </Text>

                  <Text
                    style={{
                      marginTop: 2,
                      color: theme.colors.muted,
                      ...theme.typography.caption,
                      fontFamily: theme.fonts.regular,
                    }}
                  >
                    Remove locally saved data
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  marginTop: theme.spacing.sm,
                  color: theme.colors.muted,
                  ...theme.typography.caption,
                  fontFamily: theme.fonts.regular,
                  lineHeight: 19,
                }}
              >
                Clear the local SQLite database and Redux cache from this
                device. You can download the library again using Sync Now.
              </Text>

            <Pressable
  onPress={handleClearOfflineData}
  disabled={isBusy}
  style={{
    minHeight: 50,
    marginTop: theme.spacing.md,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',

    // Clear disabled and enabled background
    backgroundColor: isBusy ? '#E5E5E5' : '#FFF0ED',

    borderWidth: 1,
    borderColor: isBusy ? '#CFCFCF' : '#F1CFC5',

    // Disabled state clearly visible
    opacity: isBusy ? 0.8 : 1,
  }}
>
  {clearing ? (
    <>
      <ActivityIndicator
        size="small"
        color="#888888"
      />

      <Text
        style={{
          marginLeft: 8,
          color: '#888888',
          ...theme.typography.bodySmall,
          fontFamily: theme.fonts.semibold,
        }}
      >
        Clearing data...
      </Text>
    </>
  ) : (
    <>
      <Text
        style={{
          fontSize: 16,
          opacity: isBusy ? 0.5 : 1,
        }}
      >
        🗑️
      </Text>

      <Text
        style={{
          marginLeft: 8,

          // Grey when disabled, danger color otherwise
          color: isBusy ? '#888888' : theme.colors.danger,

          ...theme.typography.bodySmall,
          fontFamily: theme.fonts.semibold,
        }}
      >
        {isBusy ? 'Please wait...' : 'Clear Offline Data'}
      </Text>
    </>
  )}
</Pressable>
            </View>
          </Card>
        </View>

        {/* OFFLINE-FIRST INFORMATION */}
        <View
          style={{
            marginTop: theme.spacing.md,
          }}
        >
          <Card>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: theme.spacing.sm,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 13,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(126, 161, 126, 0.12)',
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: theme.colors.sage,
                  }}
                >
                  ✓
                </Text>
              </View>

              <Text
                style={{
                  flex: 1,
                  marginLeft: theme.spacing.sm,
                  color: theme.colors.text,
                  fontFamily: theme.fonts.semibold,
                  fontSize: 16,
                }}
              >
                Offline-first experience
              </Text>
            </View>

            <Text
              style={{
                color: theme.colors.muted,
                ...theme.typography.bodySmall,
                fontFamily: theme.fonts.regular,
                lineHeight: 21,
              }}
            >
              Your dog library is stored locally on this device. Cached
              information remains available without an internet connection.
              When you are online, use Sync Now to refresh the library.
            </Text>
          </Card>
        </View>

        {/* FOOTER */}

      </ScrollView>
    </View>
  );
}
