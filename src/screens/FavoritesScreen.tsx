
import React from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAllBreeds } from '../store/cacheSlice';
import {
  toggleFavorite,
  persistFavorites,
} from '../store/appSlice';

import { theme } from '../theme/theme';
import { Icon } from '../components/Icon';
import BreedCard from '../components/BreedCard';

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  const breeds = useAppSelector(selectAllBreeds);
  const favorites = useAppSelector(
    state => state.app.favorites,
  );

  const favoriteBreeds = breeds.filter(breed =>
    favorites.includes(breed.id),
  );

  const removeFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(
      favoriteId => favoriteId !== id,
    );

    dispatch(toggleFavorite(id));
    dispatch(persistFavorites(updatedFavorites) as never);
  };

  const handleExplorePress = () => {
    navigation.navigate('Explore' as never);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
        paddingTop: insets.top,
      }}
    >
      {/* HEADER */}
      <View
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.md,
          paddingBottom: theme.spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            flex: 1,
            marginRight: theme.spacing.md,
          }}
        >
          <Text
            style={{
              ...theme.typography.h3,
              fontFamily: theme.fonts.semibold,
              fontSize: 21,
              lineHeight: 27,
              color: theme.colors.text,
            }}
          >
            Saved breeds
          </Text>

          <Text
            style={{
              ...theme.typography.caption,
              fontFamily: theme.fonts.regular,
              color: theme.colors.muted,
              marginTop: theme.spacing.xs,
            }}
          >
            Your favourite dog breeds
          </Text>
        </View>

        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(214, 112, 91, 0.10)',
            borderWidth: 1,
            borderColor: 'rgba(214, 112, 91, 0.18)',
          }}
        >
          <Icon
            name="heartOutline"
            size={22}
            color={theme.colors.coral}
            strokeWidth={2}
          />
        </View>
      </View>

      {/* FAVORITE COUNT */}
      <View
        style={{
          marginHorizontal: theme.spacing.lg,
          marginBottom: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          borderRadius: 14,
          backgroundColor: 'rgba(255, 255, 255, 0.55)',
          borderWidth: 1,
          borderColor: 'rgba(47, 42, 39, 0.07)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            ...theme.typography.bodySmall,
            fontFamily: theme.fonts.regular,
            color: theme.colors.muted,
          }}
        >
          Total saved
        </Text>

        <Text
          style={{
            ...theme.typography.labelSmall,
            fontFamily: theme.fonts.semibold,
            fontSize: 14,
            color: theme.colors.text,
          }}
        >
          {favoriteBreeds.length}{' '}
          {favoriteBreeds.length === 1 ? 'breed' : 'breeds'}
        </Text>
      </View>

      {/* FAVORITES LIST */}
      <FlatList
        data={favoriteBreeds}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.sm,
          paddingBottom: insets.bottom + 90,
          flexGrow: favoriteBreeds.length === 0 ? 1 : 0,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: theme.spacing.sm,
            }}
          >
            <BreedCard
              breed={item}
              favorite
              onFavorite={() => removeFavorite(item.id)}
              onPress={() =>
                navigation.navigate('BreedDetail', {
                  id: item.id,
                })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 32,
              paddingBottom: 70,
            }}
          >
            {/* EMPTY STATE ICON */}
            <View
              style={{
                width: 104,
                height: 104,
                borderRadius: 52,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(214, 112, 91, 0.09)',
                borderWidth: 1,
                borderColor: 'rgba(214, 112, 91, 0.15)',
                marginBottom: theme.spacing.lg,
              }}
            >
              <Icon
                name="heartOutline"
                size={46}
                color={theme.colors.coral}
                strokeWidth={1.7}
              />
            </View>

            {/* EMPTY STATE TITLE */}
            <Text
              style={{
                ...theme.typography.h3,
                fontFamily: theme.fonts.semibold,
                fontSize: 20,
                lineHeight: 26,
                color: theme.colors.text,
                textAlign: 'center',
              }}
            >
              No favorites yet
            </Text>

            {/* EMPTY STATE DESCRIPTION */}
            <Text
              style={{
                ...theme.typography.bodySmall,
                fontFamily: theme.fonts.regular,
                fontSize: 14,
                lineHeight: 21,
                color: theme.colors.muted,
                textAlign: 'center',
                marginTop: theme.spacing.sm,
                maxWidth: 285,
              }}
            >
              Your favorite breeds will appear here. Explore
              the dog library and tap the heart icon to save
              the breeds you love.
            </Text>

            {/* EXPLORE BUTTON */}
            <Pressable
              onPress={handleExplorePress}
              style={({ pressed }) => ({
                marginTop: theme.spacing.lg,
                minWidth: 180,
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: 14,
                borderRadius: 16,
                backgroundColor: pressed
                  ? '#C45F4D'
                  : theme.colors.coral,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Icon
                name="search"
                size={18}
                color="#FFFFFF"
                strokeWidth={2}
              />

              <Text
                style={{
                  fontFamily: theme.fonts.semibold,
                  fontSize: 14,
                  color: '#FFFFFF',
                }}
              >
                Explore Breeds
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}
