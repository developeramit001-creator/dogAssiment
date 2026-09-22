import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme/theme';
import FilterBottomSheet from '../components/FilterBottomSheet';
import { setFilters } from '../store/appSlice';

import { useAppDispatch, useAppSelector } from '../store/hooks';

import { selectAllBreeds, selectAllGroups } from '../store/cacheSlice';

import { toggleFavorite, persistFavorites } from '../store/appSlice';

import { syncAll } from '../store/syncService';

import { Icon } from '../components/Icon';
import BreedCard from '../components/BreedCard';
import { OfflineBanner } from '../components/UI';
import ShimmerPlaceholder from '../components/ShimmerPlaceholder';

import { Breed } from '../types/dog';
import { sizeBand } from '../utils/format';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type GroupedItem =
  | {
    type: 'header';
    key: string;
    group: string;
  }
  | {
    type: 'breed';
    key: string;
    breed: Breed;
    group: string;
  };

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const nav = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  const breeds = useAppSelector(selectAllBreeds);
  const groups = useAppSelector(selectAllGroups);

  const { favorites, filters } = useAppSelector(state => state.app);

  const { online, syncing, error } = useAppSelector(state => state.sync);

  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Filter State start :------------

  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  const currentFilters = useAppSelector(state => state.app.filters);
  // Filter State end :------------

  // First sync: skeleton only.
  // Later syncs: existing data stays visible with a subtle indeterminate bar.
  const hasLoadedData = breeds.length > 0;
  const isSyncing = refreshing || syncing;
  const showSyncProgress = hasLoadedData && isSyncing;

  const progressAnimation = useRef(new Animated.Value(0)).current;

  const progressTranslateX = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 360],
  });

  useEffect(() => {
    if (!showSyncProgress) {
      progressAnimation.stopAnimation();
      progressAnimation.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
      progressAnimation.stopAnimation();
      progressAnimation.setValue(0);
    };
  }, [showSyncProgress, progressAnimation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(q.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [q]);

  const groupMap = useMemo(() => {
    return new Map(groups.map(group => [group.id, group.attributes.name]));
  }, [groups]);

  const filtered = useMemo(() => {
    return breeds.filter(breed => {
      const attributes = breed.attributes;

      const searchableText = [
        attributes.name,
        ...(attributes.other_names || []),
      ]
        .join(' ')
        .toLowerCase();

      if (debounced && !searchableText.includes(debounced)) {
        return false;
      }

      const groupName = groupMap.get(
        breed.relationships?.group?.data?.id || '',
      );

      if (
        filters.groups.length > 0 &&
        !filters.groups.includes(groupName || '')
      ) {
        return false;
      }

      if (
        filters.sizes.length > 0 &&
        !filters.sizes.includes(sizeBand(breed))
      ) {
        return false;
      }

      if (
        filters.coats.length > 0 &&
        !filters.coats.includes(attributes.coat?.length || '')
      ) {
        return false;
      }

      if (
        filters.hypoallergenic !== null &&
        attributes.hypoallergenic !== filters.hypoallergenic
      ) {
        return false;
      }

      if (filters.traitKey) {
        const traitValue = attributes.traits?.[filters.traitKey];

        if (typeof traitValue !== 'number' || traitValue < filters.traitMin) {
          return false;
        }
      }

      return true;
    });
  }, [breeds, groupMap, debounced, filters]);

  const grouped = useMemo<GroupedItem[]>(() => {
    const groupedMap = new Map<string, Breed[]>();

    filtered.forEach(breed => {
      const groupName =
        groupMap.get(breed.relationships?.group?.data?.id || '') || 'Other';

      if (!groupedMap.has(groupName)) {
        groupedMap.set(groupName, []);
      }

      groupedMap.get(groupName)!.push(breed);
    });

    return Array.from(groupedMap.entries()).flatMap(([group, items]) => [
      {
        type: 'header' as const,
        key: `header-${group}`,
        group,
      },
      ...items.map(breed => ({
        type: 'breed' as const,
        key: breed.id,
        breed,
        group,
      })),
    ]);
  }, [filtered, groupMap]);

  const handleFavorite = (id: string) => {
    dispatch(toggleFavorite(id));

    const nextFavorites = favorites.includes(id)
      ? favorites.filter(favoriteId => favoriteId !== id)
      : [...favorites, id];

    dispatch(persistFavorites(nextFavorites) as never);
  };

  const refresh = async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    try {
      await syncAll();
    } catch (refreshError) {
      console.warn('Refresh failed:', refreshError);
    } finally {
      setRefreshing(false);
    }
  };

  const openFilters = () => {
    nav.navigate('Filter');
  };

  const openBreedDetail = (id: string) => {
    nav.navigate('BreedDetail', { id });
  };

  const activeFilterCount =
    currentFilters.groups.length +
    currentFilters.sizes.length +
    currentFilters.coats.length +
    (currentFilters.hypoallergenic !== null ? 1 : 0) +
    (currentFilters.traitKey !== null ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
        paddingTop: insets.top,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      {showSyncProgress && (
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Updating dog library"
          style={{
            height: 4,
            width: '100%',
            backgroundColor: theme.colors.peach,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              height: 4,
              width: 120,
              backgroundColor: theme.colors.coral,
              borderRadius: 4,
              transform: [
                {
                  translateX: progressTranslateX,
                },
              ],
            }}
          />
        </View>
      )}

      <View
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              ...theme.typography.h1,
              fontFamily: theme.fonts.extraBold,
              fontSize: 25,
              lineHeight: 31,
              letterSpacing: -0.5,
              color: theme.colors.text,
            }}
          >
            Paw
            <Text
              style={{
                fontFamily: theme.fonts.extraBold,
                color: theme.colors.coral,
              }}
            >
              Buddy
            </Text>
          </Text>

          <Text
            style={{
              ...theme.typography.caption,
              fontFamily: theme.fonts.regular,
              color: theme.colors.muted,
              marginTop: theme.spacing.xs,
            }}
          >
            {breeds.length
              ? `${breeds.length} breeds on your device`
              : 'Building your dog library…'}
          </Text>
        </View>

        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            ...theme.cardStyle,
          }}
        >
          <Icon
            name={online ? 'wifi' : 'offline'}
            size={17}
            color={online ? theme.colors.sage : theme.colors.danger}
          />
        </View>
      </View>

      {showSyncProgress && (
        <View
          style={{
            marginHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.cream,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 9,
              height: 9,
              borderRadius: 5,
              backgroundColor: theme.colors.coral,
            }}
          />

          <View
            style={{
              flex: 1,
              marginLeft: theme.spacing.sm,
            }}
          >
            <Text
              style={{
                ...theme.typography.labelSmall,
                fontFamily: theme.fonts.semibold,
                color: theme.colors.text,
              }}
            >
              Refreshing dog library
            </Text>

            <Text
              style={{
                ...theme.typography.caption,
                fontFamily: theme.fonts.regular,
                color: theme.colors.muted,
                marginTop: 1,
              }}
            >
              Updating breeds and images…
            </Text>
          </View>
        </View>
      )}

      <OfflineBanner online={online} />

      {error && (
        <View
          style={{
            marginHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.sm,
            padding: theme.spacing.md,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.cream,
            borderWidth: 1,
            borderColor: theme.colors.peach,
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}
        >
          {/* Info Icon */}
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
            <Icon name="info" size={17} color={theme.colors.coralDark} />
          </View>

          {/* Error Message */}
          <Text
            style={{
              ...theme.typography.caption,
              fontFamily: theme.fonts.regular,
              flex: 1,
              color: theme.colors.inkSoft,
            }}
          >
            {error}
          </Text>

          {/* Retry Button */}
          <Pressable
            onPress={refresh}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Retry synchronization"
            style={({ pressed }) => ({
              minHeight: 34,
              paddingHorizontal: theme.spacing.md,
              borderRadius: theme.radius.sm,
              borderWidth: 1,
              borderColor: theme.colors.coral,
              backgroundColor: pressed
                ? theme.colors.peach
                : theme.colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Text
              style={{
                ...theme.typography.labelSmall,
                fontFamily: theme.fonts.semibold,
                color: theme.colors.coralDark,
              }}
            >
              Retry
            </Text>
          </Pressable>
        </View>
      )}

      <View
        style={{
          marginHorizontal: theme.spacing.md,
          marginBottom: theme.spacing.sm,
          height: 46,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingHorizontal: theme.spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
        }}
      >
        <Icon name="search" size={19} color={theme.colors.muted} />

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search breeds or other names…"
          placeholderTextColor={theme.colors.muted}
          style={{
            ...theme.typography.bodySmall,
            fontFamily: theme.fonts.regular,
            flex: 1,
            color: theme.colors.text,
            paddingVertical: 0,
          }}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel="Search dog breeds"
        />

        {q.length > 0 && (
          <Pressable
            onPress={() => setQ('')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Icon name="close" size={19} color={theme.colors.muted} />
          </Pressable>
        )}
      </View>

      <View
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.sm,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}
        >
          <Pressable
            onPress={() => setFilterSheetVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={
              hasActiveFilters
                ? `${activeFilterCount} filters active`
                : 'Open filters'
            }
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: theme.radius.md,
              backgroundColor: hasActiveFilters
                ? theme.colors.coral
                : theme.colors.surface,
              borderWidth: 1,
              borderColor: hasActiveFilters
                ? theme.colors.coral
                : theme.colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Icon
              name="filter"
              size={20}
              color={hasActiveFilters ? theme.colors.white : theme.colors.text}
              strokeWidth={2.2}
            />

            {hasActiveFilters && (
              <View
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  minWidth: 20,
                  height: 20,
                  paddingHorizontal: 4,
                  borderRadius: 10,
                  backgroundColor: theme.colors.coralDark,
                  borderWidth: 2,
                  borderColor: theme.colors.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: theme.fonts.bold,
                    color: theme.colors.white,
                    lineHeight: 12,
                  }}
                >
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </Pressable>

          {hasActiveFilters && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 7,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.cream,
                borderWidth: 1,
                borderColor: theme.colors.peach,
                gap: 5,
              }}
            >
              <Icon
                name="check"
                size={14}
                color={theme.colors.coralDark}
                strokeWidth={2.5}
              />

              <Text
                style={{
                  ...theme.typography.caption,
                  fontFamily: theme.fonts.semibold,
                  color: theme.colors.coralDark,
                }}
              >
                Filters active
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{
            ...theme.typography.caption,
            fontFamily: theme.fonts.regular,
            color: theme.colors.muted,
          }}
        >
          {filtered.length} results
        </Text>
      </View>

      {!breeds.length && syncing ? (
        <View
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.xs,
          }}
        >
          {[1, 2, 3, 4].map(item => (
            <ShimmerPlaceholder
              key={item}
              height={112}
              borderRadius={theme.radius.lg}
              style={{
                marginBottom: theme.spacing.sm,
              }}
            />
          ))}
        </View>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={item => item.key}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <Text
                  style={{
                    ...theme.typography.h3,
                    fontFamily: theme.fonts.semibold,
                    fontSize: 14,
                    lineHeight: 20,
                    color: theme.colors.sage,
                    marginTop: theme.spacing.md,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  {item.group}
                </Text>
              );
            }

            return (
              <BreedCard
                breed={item.breed}
                group={item.group}
                favorite={favorites.includes(item.breed.id)}
                onFavorite={() => handleFavorite(item.breed.id)}
                onPress={() => openBreedDetail(item.breed.id)}
              />
            );
          }}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: insets.bottom + 90,
          }}
          refreshControl={
            !isSyncing ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={theme.colors.coral}
                colors={[theme.colors.coral]}
                progressBackgroundColor={theme.colors.surface}
              />
            ) : undefined
          }
          ListEmptyComponent={
            <View
              style={{
                alignItems: 'center',
                paddingTop: 75,
                paddingHorizontal: theme.spacing.xl,
              }}
            >
              <Icon name="paw" size={42} color={theme.colors.peach} />

              <Text
                style={{
                  ...theme.typography.h2,
                  fontFamily: theme.fonts.bold,
                  fontSize: 18,
                  lineHeight: 25,
                  color: theme.colors.text,
                  marginTop: theme.spacing.sm,
                }}
              >
                No breeds found
              </Text>

              <Text
                style={{
                  ...theme.typography.bodySmall,
                  fontFamily: theme.fonts.regular,
                  textAlign: 'center',
                  color: theme.colors.muted,
                  marginTop: theme.spacing.xs,
                }}
              >
                Try another search or clear your filters.
              </Text>
            </View>
          }
        />
      )}

      <FilterBottomSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        groups={groups}
        currentFilters={currentFilters}
        onApply={filters => {
          dispatch(setFilters(filters));
        }}
      />
    </KeyboardAvoidingView>
  );
}
