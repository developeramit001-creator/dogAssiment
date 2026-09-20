
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { theme } from '../theme/theme';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAllBreeds } from '../store/cacheSlice';
import { toggleFavorite, persistFavorites } from '../store/appSlice';
import { useGetBreedByIdQuery } from '../api/dogApi';
import { refreshBreed } from '../store/syncService';

import { CachedImage } from '../components/CachedImage';
import { Card, Scale } from '../components/UI';
import { Icon } from '../components/Icon';

import { rangeText, traitKeys, traitLabels } from '../utils/format';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'BreedDetail'
>;

type BreedImage = {
  id?: string | number;
  large?: string;
  medium?: string;
  thumb?: string;
  url?: string;
  attribution?: {
    author?: string;
    license?: string;
  };
};

type BreedAttributes = {
  name: string;
  description?: string;
  images?: BreedImage[];
  origin?: {
    country?: string;
    region?: string;
    era?: string;
  };
  life?: unknown;
  male_weight?: unknown;
  female_weight?: unknown;
  male_height?: unknown;
  female_height?: unknown;
  hypoallergenic?: boolean;
  coat?: {
    type?: string;
    length?: string;
    colors?: string[];
  };
  other_names?: string[];
  recognized_by?: string[];
  traits?: Record<string, unknown> & {
    temperament?: string[];
  };
};

type Breed = {
  id: string;
  attributes: BreedAttributes;
};

export default function BreedDetailScreen({
  route,
  navigation,
}: Props) {
  const dispatch = useAppDispatch();

  const cachedBreed = useAppSelector(selectAllBreeds).find(
    item => item.id === route.params.id,
  ) as Breed | undefined;

  const favorites = useAppSelector(
    state => state.app.favorites,
  );

  const { data, isFetching, isError, refetch } =
    useGetBreedByIdQuery({
      id: route.params.id,
    });

  const breed = (data?.data || cachedBreed) as
    | Breed
    | undefined;

  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Traits' | 'Gallery'
  >('Overview');

  const favoriteScale = useRef(
    new Animated.Value(1),
  ).current;

  const favoriteRotate = useRef(
    new Animated.Value(0),
  ).current;

  useEffect(() => {
    if (data?.data) {
      refreshBreed(route.params.id).catch(() => { });
    }
  }, [data?.data, route.params.id]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable !== false) {
        refetch();
        refreshBreed(route.params.id).catch(() => { });
      }
    });

    return unsubscribe;
  }, [refetch, route.params.id]);

  if (!breed) {
    return (
      <SafeAreaView
        // edges={['top', 'bottom']}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: theme.spacing.xl,
          backgroundColor: theme.colors.bg,
        }}>
        <View
          style={{
            width: 64,
            height: 64,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.lg,
            borderRadius: 32,
            backgroundColor: theme.colors.cream,
          }}>
          <Icon
            name="paw"
            size={28}
            color={theme.colors.coralDark}
          />
        </View>

        <Text
          style={{
            fontSize: 21,
            fontFamily: theme.fonts.semibold,
            color: theme.colors.text,
          }}>
          Breed unavailable
        </Text>

        <Text
          style={{
            marginTop: theme.spacing.sm,
            textAlign: 'center',
            fontSize: 13,
            lineHeight: 20,
            fontFamily: theme.fonts.regular,
            color: theme.colors.muted,
          }}>
          This breed is not available in your offline cache.
        </Text>

        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
            marginTop: theme.spacing.xl,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.coral,
            opacity: pressed ? 0.7 : 1,
          })}>
          <Icon
            name="back"
            size={18}
            color={theme.colors.white}
          />

          <Text
            style={{
              fontSize: 13,
              fontFamily: theme.fonts.semibold,
              color: theme.colors.white,
            }}>
            Go Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const attributes = breed.attributes;
  const isFavorite = favorites.includes(breed.id);

  const animateFavorite = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(favoriteScale, {
          toValue: 0.78,
          duration: 90,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.spring(favoriteScale, {
          toValue: 1,
          friction: 4,
          tension: 160,
          useNativeDriver: true,
        }),
      ]),

      Animated.sequence([
        Animated.timing(favoriteRotate, {
          toValue: 1,
          duration: 120,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(favoriteRotate, {
          toValue: 0,
          duration: 180,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleFavorite = () => {
    animateFavorite();

    const nextFavorites = isFavorite
      ? favorites.filter(id => id !== breed.id)
      : [...favorites, breed.id];

    dispatch(toggleFavorite(breed.id));

    dispatch(persistFavorites(nextFavorites) as never);
  };

  const favoriteRotation = favoriteRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-12deg'],
  });

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              refetch();
              refreshBreed(route.params.id).catch(() => { });
            }}
            tintColor={theme.colors.coral}
            colors={[theme.colors.coral]}
          />
        }
        contentContainerStyle={{
          paddingBottom: theme.spacing.xxl,
        }}>
        {/* Hero Section */}
        <View
          style={{
            height: 300,
            position: 'relative',
            backgroundColor: theme.colors.cream,
          }}>
          <CachedImage
            uri={
              attributes.images?.[0]?.large ||
              attributes.images?.[0]?.medium
            }
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: theme.colors.cream,
            }}
          />

          {/* Back Button */}
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={({ pressed }) => ({
              position: 'absolute',
              top: theme.spacing.lg,
              left: theme.spacing.lg,
              width: 46,
              height: 46,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 23,
              backgroundColor: 'rgba(255,255,255,0.94)',
              borderWidth: 1,
              borderColor: 'rgba(233,222,213,0.8)',
              opacity: pressed ? 0.7 : 1,
            })}>
            <Icon
              name="back"
              size={25}
              color={theme.colors.text}
              strokeWidth={2.3}
            />
          </Pressable>

          {/* Animated Favorite Button */}
          <Pressable
            onPress={handleFavorite}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite
                ? 'Remove from favorites'
                : 'Add to favorites'
            }
            style={({ pressed }) => ({
              position: 'absolute',
              top: theme.spacing.lg,
              right: theme.spacing.lg,
              width: 46,
              height: 46,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 23,
              backgroundColor: 'rgba(255,255,255,0.94)',
              borderWidth: 1,
              borderColor: 'rgba(233,222,213,0.8)',
              opacity: pressed ? 0.7 : 1,
            })}>
            <Animated.View
              style={{
                transform: [
                  {
                    scale: favoriteScale,
                  },
                  {
                    rotate: favoriteRotation,
                  },
                ],
              }}>
              <Icon
                name="heart"
                size={25}
                color={
                  isFavorite
                    ? theme.colors.coral
                    : theme.colors.text
                }
                filled={isFavorite}
                strokeWidth={2.2}
              />
            </Animated.View>
          </Pressable>
        </View>

        {/* Main Content */}
        <View
          style={{
            marginTop: -24,
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.xl,
            paddingBottom: theme.spacing.lg,
            borderTopLeftRadius: theme.radius.xl,
            borderTopRightRadius: theme.radius.xl,
            backgroundColor: theme.colors.bg,
          }}>
          {/* Breed Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: theme.spacing.sm,
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 30,
                  lineHeight: 36,
                  fontFamily: theme.fonts.semibold,
                  color: theme.colors.text,
                }}>
                {attributes.name}
              </Text>

              <Text
                style={{
                  marginTop: 5,
                  fontSize: 13,
                  fontFamily: theme.fonts.semibold,
                  color: theme.colors.sage,
                }}>
                {[
                  attributes.origin?.country,
                  attributes.origin?.region,
                ]
                  .filter(Boolean)
                  .join(' · ') || 'Origin not listed'}
              </Text>
            </View>

            {isFavorite && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingHorizontal: 9,
                  paddingVertical: 7,
                  borderRadius: theme.radius.sm,
                  backgroundColor: theme.colors.cream,
                  borderWidth: 1,
                  borderColor: theme.colors.peach,
                }}>
                <Icon
                  name="heart"
                  size={14}
                  color={theme.colors.coralDark}
                  filled
                />

                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: theme.fonts.semibold,
                    color: theme.colors.coralDark,
                  }}>
                  Favorite
                </Text>
              </View>
            )}
          </View>

          {/* Sync Status */}
          {isFetching && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginTop: theme.spacing.sm,
              }}>
              <Icon
                name="sync"
                size={14}
                color={theme.colors.muted}
              />

              <Text
                style={{
                  fontSize: 11,
                  fontFamily: theme.fonts.regular,
                  color: theme.colors.muted,
                }}>
                Refreshing breed details...
              </Text>
            </View>
          )}

          {/* Error / Cached Data Banner */}
          {isError && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.sm,
                marginTop: theme.spacing.md,
                padding: theme.spacing.md,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.cream,
                borderWidth: 1,
                borderColor: theme.colors.peach,
              }}>
              <Icon
                name="info"
                size={16}
                color={theme.colors.coralDark}
              />

              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontFamily: theme.fonts.regular,
                  color: theme.colors.inkSoft,
                }}>
                Showing cached breed information.
              </Text>
            </View>
          )}

          {/* Tabs */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: theme.spacing.xl,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            }}>
            {(['Overview', 'Traits', 'Gallery'] as const).map(
              tab => {
                const selected = activeTab === tab;

                return (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    accessibilityRole="tab"
                    accessibilityState={{
                      selected,
                    }}
                    style={({ pressed }) => ({
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: 13,
                      borderBottomWidth: 3,
                      borderBottomColor: selected
                        ? theme.colors.coral
                        : 'transparent',
                      opacity: pressed ? 0.65 : 1,
                    })}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: selected
                          ? theme.fonts.semibold
                          : theme.fonts.semibold,
                        color: selected
                          ? theme.colors.coralDark
                          : theme.colors.muted,
                      }}>
                      {tab}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>

          {/* Tab Content */}
          {activeTab === 'Overview' ? (
            <Overview attributes={attributes} />
          ) : activeTab === 'Traits' ? (
            <Traits attributes={attributes} />
          ) : (
            <Gallery
              breedName={attributes.name}
              images={attributes.images || []}
              onOpen={() =>
                navigation.navigate('Gallery', {
                  id: breed.id,
                })
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* Overview                                                                   */
/* -------------------------------------------------------------------------- */

function Overview({
  attributes,
}: {
  attributes: BreedAttributes;
}) {
  return (
    <View>
      <Text
        style={{
          marginTop: theme.spacing.xl,
          marginBottom: theme.spacing.md,
          fontSize: 20,
          lineHeight: 27,
          fontFamily: theme.fonts.semibold,
          color: theme.colors.text,
        }}>
        About this breed
      </Text>

      <Text
        style={{
          fontSize: 15,
          lineHeight: 24,
          fontFamily: theme.fonts.regular,
          color: theme.colors.muted,
        }}>
        {attributes.description || 'No description available.'}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          marginVertical: theme.spacing.lg,
        }}>
        <Stat
          title="Life span"
          value={`${rangeText(attributes.life)} years`}
        />

        <Stat
          title="Male weight"
          value={`${rangeText(attributes.male_weight)} kg`}
        />

        <Stat
          title="Female weight"
          value={`${rangeText(attributes.female_weight)} kg`}
        />

        <Stat
          title="Male height"
          value={`${rangeText(attributes.male_height)} cm`}
        />

        <Stat
          title="Female height"
          value={`${rangeText(attributes.female_height)} cm`}
        />

        <Stat
          title="Hypoallergenic"
          value={attributes.hypoallergenic ? 'Yes' : 'No'}
        />
      </View>

      <Card>
        <Text
          style={{
            marginBottom: 6,
            fontSize: 15,
            fontFamily: theme.fonts.semibold,
            color: theme.colors.text,
          }}>
          Origin
        </Text>

        <Text
          style={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: theme.fonts.regular,
            color: theme.colors.muted,
          }}>
          {[
            attributes.origin?.era,
            attributes.origin?.region,
            attributes.origin?.country,
          ]
            .filter(Boolean)
            .join(' · ') || 'Not listed'}
        </Text>
      </Card>

      <Card>
        <Text
          style={{
            marginBottom: 6,
            fontSize: 15,
            fontFamily: theme.fonts.semibold,
            color: theme.colors.text,
          }}>
          Coat
        </Text>

        <Text
          style={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: theme.fonts.regular,
            color: theme.colors.muted,
          }}>
          {[
            attributes.coat?.type,
            attributes.coat?.length,
          ]
            .filter(Boolean)
            .join(' · ') || 'Not listed'}
        </Text>

        {!!attributes.coat?.colors?.length && (
          <Text
            style={{
              marginTop: 4,
              fontSize: 13,
              lineHeight: 20,
              fontFamily: theme.fonts.regular,
              color: theme.colors.muted,
            }}>
            {attributes.coat.colors.join(', ')}
          </Text>
        )}
      </Card>

      <Card>
        <Text
          style={{
            marginBottom: 6,
            fontSize: 15,
            fontFamily: theme.fonts.semibold,
            color: theme.colors.text,
          }}>
          Also known as
        </Text>

        <Text
          style={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: theme.fonts.regular,
            color: theme.colors.muted,
          }}>
          {attributes.other_names?.join(', ') ||
            'No other names listed'}
        </Text>
      </Card>

      <Card>
        <Text
          style={{
            marginBottom: 8,
            fontSize: 15,
            fontFamily: theme.fonts.semibold,
            color: theme.colors.text,
          }}>
          Recognized by
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 7,
          }}>
          {attributes.recognized_by?.map(organization => (
            <View
              key={organization}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 7,
                borderRadius: theme.radius.sm,
                backgroundColor: theme.colors.sageLight,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: theme.fonts.semibold,
                  color: theme.colors.sage,
                }}>
                {organization}
              </Text>
            </View>
          ))}

          {!attributes.recognized_by?.length && (
            <Text
              style={{
                fontSize: 13,
                fontFamily: theme.fonts.regular,
                color: theme.colors.muted,
              }}>
              Not listed
            </Text>
          )}
        </View>
      </Card>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat                                                                       */
/* -------------------------------------------------------------------------- */

function Stat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <View
      style={{
        width: '48%',
        minHeight: 76,
        justifyContent: 'center',
        padding: 13,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}>
      <Text
        style={{
          fontSize: 11,
          fontFamily: theme.fonts.regular,
          color: theme.colors.muted,
        }}>
        {title}
      </Text>

      <Text
        style={{
          marginTop: 5,
          fontSize: 14,
          fontFamily: theme.fonts.semibold,
          color: theme.colors.text,
        }}>
        {value}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Traits                                                                     */
/* -------------------------------------------------------------------------- */

function Traits({
  attributes,
}: {
  attributes: BreedAttributes;
}) {
  const traits = attributes.traits || {};
  const temperament = traits.temperament || [];

  return (
    <View>
      <Text
        style={{
          marginTop: theme.spacing.xl,
          marginBottom: theme.spacing.md,
          fontSize: 20,
          lineHeight: 27,
          fontFamily: theme.fonts.semibold,
          color: theme.colors.text,
        }}>
        Personality & lifestyle
      </Text>

      {temperament.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}>
          {temperament.map(item => (
            <View
              key={item}
              style={{
                paddingHorizontal: 11,
                paddingVertical: 8,
                borderRadius: theme.radius.sm,
                backgroundColor: theme.colors.cream,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: theme.fonts.semibold,
                  color: theme.colors.text,
                }}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      )}

      {traitKeys.map(key => {
        const value = traits[key];

        if (typeof value !== 'number') {
          return null;
        }

        const score =
          key === 'exercise_minutes'
            ? Math.min(5, Math.round(value / 30))
            : value;

        return (
          <View
            key={key}
            style={{
              paddingVertical: 13,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontFamily: theme.fonts.semibold,
                  color: theme.colors.text,
                }}>
                {traitLabels[key]}
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  fontFamily: theme.fonts.semibold,
                  color: theme.colors.coralDark,
                }}>
                {key === 'exercise_minutes'
                  ? `${value} min`
                  : `${value}/5`}
              </Text>
            </View>

            <Scale value={score} />
          </View>
        );
      })}
    </View>
  );
}


/* -------------------------------------------------------------------------- */
/* Gallery                                                                    */
/* -------------------------------------------------------------------------- */




function Gallery({
  images,
  onOpen,
  breedName,
}: {
  images: BreedImage[];
  onOpen: () => void;
  breedName: string;
}) {
  return (
    <View>
      {/* Gallery Heading */}
      <Text
        style={{
          marginTop: theme.spacing.xl,
          marginBottom: theme.spacing.sm,
          fontSize: 20,
          lineHeight: 27,
          fontFamily: theme.fonts.semibold,
          color: theme.colors.text,
        }}>
        Photo gallery
      </Text>

      {/* Gallery Description */}
      <Text
        style={{
          marginBottom: theme.spacing.lg,
          fontSize: 13,
          lineHeight: 20,
          fontFamily: theme.fonts.regular,
          color: theme.colors.muted,
        }}>
        Browse photos of {breedName}.
      </Text>

      {/* Full Gallery */}
      {images.map((image, index) => {
        const imageTitle = `${breedName} Photo ${index + 1}`;

        const imageUrl =
          image.large ||
          image.medium ||
          image.thumb ||
          image.url;

        const author = image.attribution?.author;

        return (
          <View
            key={image.id ?? index}
            style={{
              marginBottom: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.lg,
              backgroundColor: theme.colors.surface,
              overflow: 'hidden',
              ...theme.cardStyle,
            }}>
            <Pressable
              onPress={onOpen}
              accessibilityRole="button"
              accessibilityLabel={`Open ${imageTitle}`}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: theme.spacing.md,
                opacity: pressed ? 0.7 : 1,
              })}>
              {/* Image - Top Aligned */}
              <CachedImage
                uri={imageUrl}
                style={{
                  width: 104,
                  height: 104,
                  flexShrink: 0,
                  borderRadius: theme.radius.md,
                  backgroundColor: theme.colors.cream,
                }}
              />

              {/* Details */}
              <View
                style={{
                  flex: 1,
                  minWidth: 0,
                  marginLeft: theme.spacing.md,
                  paddingRight: theme.spacing.xs,
                }}>
                {/* Photo Title */}
                <Text
                  numberOfLines={2}
                  style={{
                    marginBottom: 6,
                    fontSize: 15,
                    lineHeight: 21,
                    fontFamily: theme.fonts.semibold,
                    color: theme.colors.text,
                  }}>
                  {imageTitle}
                </Text>

                {/* Photo Count */}
                <Text
                  style={{
                    marginBottom: 6,
                    fontSize: 11,
                    lineHeight: 16,
                    fontFamily: theme.fonts.semibold,
                    color: theme.colors.coralDark,
                  }}>
                  {`Photo ${index + 1} of ${images.length}`}
                </Text>

                {/* Photographer - Only if Available */}
                {!!author && (
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 12,
                      lineHeight: 17,
                      fontFamily: theme.fonts.regular,
                      color: theme.colors.muted,
                    }}>
                    {`By ${author}`}
                  </Text>
                )}
              </View>

              {/* Arrow */}
              <View
                style={{
                  paddingTop: 2,
                  paddingLeft: theme.spacing.xs,
                }}>
                <Icon
                  name="chevron"
                  size={18}
                  color={theme.colors.muted}
                />
              </View>
            </Pressable>
          </View>
        );
      })}

      {/* Empty State */}
      {images.length === 0 && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: theme.spacing.xl,
            paddingHorizontal: theme.spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.surface,
            ...theme.cardStyle,
          }}>
          <Icon
            name="info"
            size={24}
            color={theme.colors.muted}
          />

          <Text
            style={{
              marginTop: theme.spacing.sm,
              textAlign: 'center',
              fontSize: 13,
              lineHeight: 20,
              fontFamily: theme.fonts.regular,
              color: theme.colors.muted,
            }}>
            No gallery images available for this breed.
          </Text>
        </View>
      )}
    </View>
  );
}
