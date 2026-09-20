
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';

import { Breed } from '../types/dog';
import { theme } from '../theme/theme';
import { sizeBand } from '../utils/format';
import { Icon } from './Icon';

type BreedCardProps = {
  breed: Breed;
  group?: string;
  favorite: boolean;
  onFavorite: () => void;
  onPress: () => void;
};

export default function BreedCard({
  breed,
  group,
  favorite,
  onFavorite,
  onPress,
}: BreedCardProps) {
  const scale = useRef(
    new Animated.Value(1),
  ).current;

  const rotate = useRef(
    new Animated.Value(0),
  ).current;

  const attributes = breed.attributes;

  const image =
    attributes.images?.[0]?.medium ||
    attributes.images?.[0]?.thumb;

  useEffect(() => {
    if (!favorite) {
      scale.setValue(1);
      rotate.setValue(0);
      return;
    }

    scale.setValue(0.7);
    rotate.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.2,
          friction: 4,
          tension: 160,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 130,
          useNativeDriver: true,
        }),
      ]),

      Animated.sequence([
        Animated.timing(rotate, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [favorite, rotate, scale]);

  const rotateInterpolation = rotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.sm,
          marginBottom: theme.spacing.sm,
          flexDirection: 'row',
          gap: theme.spacing.sm,
          ...theme.cardStyle,
        },
        pressed && {
          opacity: 0.9,
          transform: [{ scale: 0.99 }],
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${attributes.name} details`}
    >
      <Image
        source={image ? { uri: image } : undefined}
        style={{
          width: 92,
          height: 92,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.cream,
        }}
        resizeMode="cover"
      />

      <View
        style={{
          flex: 1,
          paddingTop: 1,
        }}
      >
        <View
          style={{

            minHeight: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: theme.spacing.xs,
          }}
        >
          <Text
            style={{
              fontFamily: theme.fonts.semibold,
              fontSize: theme.typography.title.fontSize,
              lineHeight: theme.typography.title.lineHeight,
              flex: 1,
              color: theme.colors.text,
              letterSpacing: -0.15,
            }}
            numberOfLines={1}
          >
            {attributes.name}
          </Text>



          <Pressable
            hitSlop={8}
            onPress={event => {
              event.stopPropagation();
              onFavorite();
            }}
            accessibilityRole="button"
            accessibilityLabel={
              favorite
                ? `Remove ${attributes.name} from favorites`
                : `Add ${attributes.name} to favorites`
            }
            style={({ pressed }) => [
              {
                width: 34,
                height: 34,
                borderRadius: 17,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: favorite
                  ? theme.colors.sageLight
                  : theme.colors.cream,
              },
              pressed && {
                opacity: 0.7,
                transform: [{ scale: 0.92 }],
              },
            ]}
          >
            <Animated.View
              style={{
                width: 22,
                height: 22,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [
                  { scale },
                  { rotate: rotateInterpolation },
                ],
              }}
            >
              <Icon
                name="heart"
                size={favorite ? 18 : 20}
                color={
                  favorite
                    ? theme.colors.coral
                    : theme.colors.muted
                }
                filled={favorite}
                strokeWidth={2.2}
              />
            </Animated.View>
          </Pressable>
        </View>

        <Text
          style={{
            ...theme.typography.caption,
            color: theme.colors.muted,

          }}
          numberOfLines={1}
        >
          {group || sizeBand(breed)} ·{' '}
          {attributes.origin?.country ||
            'Origin unknown'}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            gap: theme.spacing.xs,
            marginTop: theme.spacing.sm,
            flexWrap: 'wrap',
          }}
        >
          <Text
            style={{
              ...theme.typography.labelSmall,
              fontSize: 10,
              lineHeight: 14,
              color: theme.colors.sage,
              backgroundColor: theme.colors.sageLight,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.radius.sm,
            }}
          >
            {attributes.coat?.length ||
              'coat unknown'}
          </Text>

          {attributes.hypoallergenic && (
            <Text
              style={{
                ...theme.typography.labelSmall,
                fontSize: 10,
                lineHeight: 14,
                color: theme.colors.sage,
                backgroundColor: theme.colors.sageLight,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.radius.sm,
              }}
            >
              hypoallergenic
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
