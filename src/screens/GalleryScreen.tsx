
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGetBreedByIdQuery } from '../api/dogApi';
import { useAppSelector } from '../store/hooks';
import { selectAllBreeds } from '../store/cacheSlice';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../theme/theme';
import { Icon } from '../components/Icon';

type Props = NativeStackScreenProps<RootStackParamList, 'Gallery'>;

type ImageItem = {
  id?: string;
  url?: string;
  thumb?: string;
  medium?: string;
  large?: string;
  attribution?: {
    author?: string;
    license?: string;
    source?: string;
    source_url?: string;
  };
};

const IMAGE_GAP = 12;

const colors = {
  background: theme.colors.background,
  surface: theme.colors.surface,
  text: theme.colors.text,
  secondary: theme.colors.textSecondary,
  primary: theme.colors.primary,
  border: theme.colors.border,
  white: theme.colors.white,
};

const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>

    {subtitle ? (
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    ) : null}
  </View>
);

const DetailCard = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.detailCard}>{children}</View>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>

    <Text style={styles.infoValue}>{value || 'N/A'}</Text>
  </View>
);

const TraitBar = ({
  label,
  value,
}: {
  label: string;
  value?: number | string;
}) => {
  const numericValue =
    typeof value === 'number' ? Math.min(Math.max(value, 0), 5) : 0;

  const percentage = `${(numericValue / 5) * 100}%`;

  return (
    <View style={styles.traitContainer}>
      <View style={styles.traitHeader}>
        <Text style={styles.traitLabel}>{label}</Text>

        <Text style={styles.traitValue}>{value ?? 'N/A'}/5</Text>
      </View>

      <View style={styles.traitTrack}>
        <View
          style={[
            styles.traitProgress,
            { width: percentage },
          ]}
        />
      </View>
    </View>
  );
};

const Tag = ({ label }: { label: string }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>{label}</Text>
  </View>
);

const GalleryScreen = ({ route, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const imageWidth = Math.max(280, screenWidth - 40);
  const snapInterval = imageWidth + IMAGE_GAP;
  const { id } = route.params;

  const galleryRef = useRef<FlatList<ImageItem>>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const cachedBreeds = useAppSelector(selectAllBreeds);

  const cachedBreed = useMemo(
    () => cachedBreeds.find((breed: any) => breed.id === id),
    [cachedBreeds, id],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetBreedByIdQuery(
    { id },
    {
      refetchOnReconnect: true,
    },
  );

  const breed: any = data?.data ?? cachedBreed;
  const attributes = breed?.attributes ?? {};

  const images: ImageItem[] = useMemo(() => {
    if (
      Array.isArray(attributes.images) &&
      attributes.images.length > 0
    ) {
      return attributes.images;
    }

    if (breed?.image?.url) {
      return [
        {
          id: `${breed.id}-image`,
          url: breed.image.url,
          medium: breed.image.url,
          large: breed.image.url,
        },
      ];
    }

    return [];
  }, [attributes.images, breed]);

  const breedName = attributes.name ?? breed?.name ?? 'Unknown Breed';

  const description =
    attributes.description ??
    'No description available for this breed.';

  const formatRange = (
    range?: {
      min?: number;
      max?: number;
    },
    unit = '',
  ) => {
    if (!range) {
      return 'N/A';
    }

    if (
      range.min === undefined &&
      range.max === undefined
    ) {
      return 'N/A';
    }

    if (
      range.min !== undefined &&
      range.max !== undefined
    ) {
      return `${range.min} - ${range.max}${unit}`;
    }

    return `${range.min ?? range.max}${unit}`;
  };

  const formatArray = (items?: string[]) => {
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    return items;
  };

  const openExternalLink = async (url?: string) => {
    if (!url) {
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      }
    } catch {
      // Prevent external link errors from crashing the screen.
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveImageIndex(currentIndex => {
        const nextIndex =
          currentIndex >= images.length - 1
            ? 0
            : currentIndex + 1;

        galleryRef.current?.scrollToOffset({
          offset: nextIndex * snapInterval,
          animated: true,
        });

        return nextIndex;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [images.length, snapInterval]);

  if (isLoading && !breed) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />

        <Text style={styles.loadingText}>
          Loading breed profile...
        </Text>
      </View>
    );
  }

  if (isError && !breed) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>
          Unable to load breed
        </Text>

        <Text style={styles.errorDescription}>
          Please check your internet connection and try again.
        </Text>

        <Pressable
          onPress={handleRefresh}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!breed) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>
          Breed not found
        </Text>
      </View>
    );
  }

  const traits = attributes.traits;
  const coat = attributes.coat;
  const origin = attributes.origin;

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={{ flex: 1 }}>

      <View style={styles.container}>
        {/* Fixed Professional Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + 10,
            },
          ]}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={8}
          >
            <Icon name="back" size={22} color={colors.text} strokeWidth={2.2} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              Breed Profile
            </Text>

            <Text style={styles.headerSubtitle}>
              Dog Breed Explorer
            </Text>
          </View>

          <View style={styles.headerPlaceholder}>
            <Icon name="paw" size={19} color={colors.secondary} strokeWidth={1.8} />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: Math.max(36, insets.bottom + 28),
            },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressBackgroundColor={colors.surface}
            />
          }
        >
          {/* Refresh Status */}
          {isFetching ? (
            <View style={styles.refreshStatus}>
              <ActivityIndicator
                size="small"
                color={colors.primary}
              />

              <Text style={styles.refreshText}>
                Updating breed information...
              </Text>
            </View>
          ) : null}

          {/* Offline Notice - shown at the top when cached data is displayed */}
          {isError && breed ? (
            <View
              style={{
                marginHorizontal: 20,
                marginBottom: 16,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 14,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Icon
                name="info"
                size={18}
                color={colors.primary}
                strokeWidth={2}
              />
              <Text
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 12,
                  lineHeight: 18,
                  color: colors.secondary,
                  fontFamily: theme.fonts.regular,
                }}
              >
                Showing saved information. Latest data could not be fetched.
              </Text>
            </View>
          ) : null}

          {/* Intro */}
          <View style={styles.introContainer}>
            <Text style={styles.breedName}>
              {breedName}
            </Text>

            <Text style={styles.introDescription}>
              Discover appearance, personality and important
              information about this breed.
            </Text>
          </View>

          {/* Premium Image Carousel */}
          {images.length > 0 ? (
            <View style={styles.carouselContainer}>
              <FlatList
                ref={galleryRef}
                data={images}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={snapInterval}
                decelerationRate="fast"
                disableIntervalMomentum
                bounces={false}
                contentContainerStyle={styles.carouselContent}
                keyExtractor={(item, index) =>
                  item.id ?? `${id}-image-${index}`
                }
                ItemSeparatorComponent={() => (
                  <View style={{ width: IMAGE_GAP }} />
                )}
                getItemLayout={(_, index) => ({
                  length: snapInterval,
                  offset: snapInterval * index,
                  index,
                })}
                onMomentumScrollEnd={event => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x /
                    snapInterval,
                  );

                  setActiveImageIndex(index);
                }}
                renderItem={({ item, index }) => {
                  const imageUrl =
                    item.large ??
                    item.medium ??
                    item.url ??
                    item.thumb;

                  return (
                    <View style={[styles.imageCard, { width: imageWidth }]}>
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.breedImage}
                        resizeMode="cover"
                      />

                      <View style={styles.imageOverlay}>
                        <View style={styles.imageBadge}>
                          <Text style={styles.imageBadgeText}>
                            {index + 1} / {images.length}
                          </Text>
                        </View>

                        <View style={styles.imageBottomContent}>
                          <Text style={styles.imageBreedName}>
                            {breedName}
                          </Text>

                          <Text style={styles.imageCaption}>
                            Breed photography
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />

              {images.length > 1 ? (
                <View style={styles.pagination}>
                  {images.map((item, index) => (
                    <View
                      key={item.id ?? `dot-${index}`}
                      style={[
                        styles.paginationDot,
                        index === activeImageIndex &&
                        styles.paginationDotActive,
                      ]}
                    />
                  ))}
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.emptyImageContainer}>
              <Text style={styles.emptyImageText}>
                No images available
              </Text>
            </View>
          )}

          {/* About */}
          <DetailCard>
            <SectionHeader
              title="About this breed"
              subtitle="Overview and general description"
            />

            <Text style={styles.descriptionText}>
              {description}
            </Text>
          </DetailCard>

          {/* Physical Details */}
          <DetailCard>
            <SectionHeader
              title="Physical information"
              subtitle="Size, weight and lifespan"
            />

            <InfoRow
              label="Life span"
              value={formatRange(attributes.life, ' years')}
            />

            <InfoRow
              label="Male weight"
              value={formatRange(attributes.male_weight, ' kg')}
            />

            <InfoRow
              label="Female weight"
              value={formatRange(attributes.female_weight, ' kg')}
            />

            <InfoRow
              label="Male height"
              value={formatRange(attributes.male_height, ' cm')}
            />

            <InfoRow
              label="Female height"
              value={formatRange(attributes.female_height, ' cm')}
            />

            <InfoRow
              label="Hypoallergenic"
              value={
                attributes.hypoallergenic === true
                  ? 'Yes'
                  : attributes.hypoallergenic === false
                    ? 'No'
                    : 'N/A'
              }
            />
          </DetailCard>

          {/* Coat */}
          <DetailCard>
            <SectionHeader
              title="Coat information"
              subtitle="Appearance and grooming details"
            />

            <InfoRow label="Type" value={coat?.type} />
            <InfoRow label="Length" value={coat?.length} />

            {Array.isArray(coat?.colors) &&
              coat.colors.length > 0 ? (
              <View style={styles.tagSection}>
                <Text style={styles.infoLabel}>Colors</Text>

                <View style={styles.tagContainer}>
                  {coat.colors.map((color: string) => (
                    <Tag key={color} label={color} />
                  ))}
                </View>
              </View>
            ) : null}
          </DetailCard>

          {/* Origin */}
          <DetailCard>
            <SectionHeader
              title="Origin"
              subtitle="Historical background"
            />

            <InfoRow label="Era" value={origin?.era} />
            <InfoRow label="Region" value={origin?.region} />
            <InfoRow label="Country" value={origin?.country} />
          </DetailCard>

          {/* Traits */}
          {traits ? (
            <DetailCard>
              <SectionHeader
                title="Breed traits"
                subtitle="Personality and behaviour indicators"
              />

              <TraitBar
                label="Energy"
                value={traits.energy}
              />

              <TraitBar
                label="Barking"
                value={traits.barking}
              />

              <TraitBar
                label="Drooling"
                value={traits.drooling}
              />

              <TraitBar
                label="Grooming"
                value={traits.grooming}
              />

              <TraitBar
                label="Shedding"
                value={traits.shedding}
              />

              <TraitBar
                label="Trainability"
                value={traits.trainability}
              />

              <InfoRow
                label="Good with dogs"
                value={
                  traits.good_with_dogs !== undefined
                    ? String(traits.good_with_dogs)
                    : undefined
                }
              />

              <InfoRow
                label="Good with children"
                value={
                  traits.good_with_children !== undefined
                    ? String(traits.good_with_children)
                    : undefined
                }
              />

              <InfoRow
                label="Good with strangers"
                value={
                  traits.good_with_strangers !== undefined
                    ? String(traits.good_with_strangers)
                    : undefined
                }
              />

              <InfoRow
                label="Apartment friendly"
                value={
                  traits.apartment_friendly !== undefined
                    ? String(traits.apartment_friendly)
                    : undefined
                }
              />

              <InfoRow
                label="Exercise"
                value={
                  traits.exercise_minutes !== undefined
                    ? `${traits.exercise_minutes} minutes`
                    : undefined
                }
              />

              {Array.isArray(traits.temperament) &&
                traits.temperament.length > 0 ? (
                <View style={styles.tagSection}>
                  <Text style={styles.infoLabel}>
                    Temperament
                  </Text>

                  <View style={styles.tagContainer}>
                    {traits.temperament.map((item: string) => (
                      <Tag key={item} label={item} />
                    ))}
                  </View>
                </View>
              ) : null}
            </DetailCard>
          ) : null}

          {/* Other Names */}
          {Array.isArray(attributes.other_names) &&
            attributes.other_names.length > 0 ? (
            <DetailCard>
              <SectionHeader
                title="Other names"
                subtitle="Alternative breed names"
              />

              <View style={styles.tagContainer}>
                {attributes.other_names.map((item: string) => (
                  <Tag key={item} label={item} />
                ))}
              </View>
            </DetailCard>
          ) : null}

          {/* Recognized By */}
          {Array.isArray(attributes.recognized_by) &&
            attributes.recognized_by.length > 0 ? (
            <DetailCard>
              <SectionHeader
                title="Recognized by"
                subtitle="Kennel clubs and organizations"
              />

              {attributes.recognized_by.map((item: string, index: number) => (
                <View key={`${item}-${index}`} style={styles.listItem}>
                  <View style={styles.listBullet}>
                    <Icon name="check" size={13} color={colors.primary} strokeWidth={2.5} />
                  </View>

                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </DetailCard>
          ) : null}

          {/* Sources */}
          {Array.isArray(attributes.sources) &&
            attributes.sources.length > 0 ? (
            <DetailCard>
              <SectionHeader
                title="Information sources"
                subtitle="External references"
              />

              {attributes.sources.map(
                (
                  source: {
                    title?: string;
                    url?: string;
                  },
                  index: number,
                ) => (
                  <Pressable
                    key={`${source.url}-${index}`}
                    onPress={() => openExternalLink(source.url)}
                    style={styles.sourceButton}
                  >
                    <Text style={styles.sourceText}>
                      {source.title ?? source.url ?? 'View source'}
                    </Text>

                    <Text style={styles.sourceArrow}>↗</Text>
                  </Pressable>
                ),
              )}
            </DetailCard>
          ) : null}

          <View
            style={{
              height: Math.max(20, insets.bottom + 10),
            }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    minHeight: 76,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    zIndex: 10,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  backIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },

  headerTitle: {
    fontSize: 17,
    fontFamily: theme.fonts.semibold,
    color: colors.text,
  },

  headerSubtitle: {
    fontSize: 11,
    fontFamily: theme.fonts.semibold,
    color: colors.secondary,
    marginTop: 3,
  },

  headerPlaceholder: {
    width: 42,
  },

  scrollContent: {
    paddingTop: 24,
  },

  refreshStatus: {
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  refreshText: {
    marginLeft: 10,
    fontSize: 12,
    color: colors.secondary,
    fontFamily: theme.fonts.semibold,
  },

  introContainer: {
    paddingHorizontal: 20,
    marginBottom: 22,
  },

  breedName: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: theme.fonts.semibold,
    color: colors.text,
    letterSpacing: -0.7,
  },

  introDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: theme.fonts.regular,
    color: colors.secondary,
  },

  carouselContainer: {
    marginBottom: 28,
  },

  carouselContent: {
    paddingHorizontal: 20,
  },

  imageCard: {
    height: 370,
    overflow: 'hidden',
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  breedImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
  },

  imageBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  imageBadgeText: {
    fontSize: 11,
    color: colors.white,
    fontFamily: theme.fonts.semibold,
  },

  imageBottomContent: {
    padding: 16,
    marginHorizontal: -16,
    marginBottom: -16,
    paddingTop: 50,
    backgroundColor: 'rgba(0,0,0,0.30)',
  },

  imageBreedName: {
    fontSize: 21,
    fontFamily: theme.fonts.semibold,
    color: colors.white,
  },

  imageCaption: {
    fontSize: 12,
    marginTop: 4,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: theme.fonts.regular,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  paginationDot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: colors.border,
  },

  paginationDotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },

  emptyImageContainer: {
    height: 220,
    marginHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  emptyImageText: {
    fontSize: 14,
    color: colors.secondary,
    fontFamily: theme.fonts.semibold,
  },

  detailCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontFamily: theme.fonts.semibold,
    color: colors.text,
  },

  sectionSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    fontFamily: theme.fonts.regular,
    color: colors.secondary,
  },

  descriptionText: {
    fontSize: 14,
    lineHeight: 24,
    color: colors.secondary,
    fontFamily: theme.fonts.regular,
  },

  infoRow: {
    minHeight: 46,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  infoLabel: {
    flex: 1,
    marginRight: 16,
    fontSize: 13,
    lineHeight: 20,
    color: colors.secondary,
    fontFamily: theme.fonts.regular,
  },

  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    lineHeight: 20,
    color: colors.text,
    fontFamily: theme.fonts.semibold,
  },

  traitContainer: {
    marginBottom: 18,
  },

  traitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  traitLabel: {
    fontSize: 13,
    color: colors.text,
    fontFamily: theme.fonts.semibold,
  },

  traitValue: {
    fontSize: 12,
    color: colors.secondary,
    fontFamily: theme.fonts.semibold,
  },

  traitTrack: {
    height: 8,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: colors.border,
  },

  traitProgress: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: colors.primary,
  },

  tagSection: {
    marginTop: 18,
  },

  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },

  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },

  tagText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: theme.fonts.semibold,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },

  listBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },

  listText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: colors.secondary,
    fontFamily: theme.fonts.regular,
  },

  sourceButton: {
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  sourceText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: colors.primary,
    fontFamily: theme.fonts.semibold,
  },

  sourceArrow: {
    marginLeft: 10,
    fontSize: 18,
    color: colors.primary,
  },

  offlineNotice: {
    marginHorizontal: 20,
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  offlineText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondary,
    fontFamily: theme.fonts.regular,
  },

  centerContainer: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: colors.secondary,
    fontFamily: theme.fonts.semibold,
  },

  errorTitle: {
    fontSize: 22,
    textAlign: 'center',
    color: colors.text,
    fontFamily: theme.fonts.semibold,
  },

  errorDescription: {
    marginTop: 10,
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: colors.secondary,
    fontFamily: theme.fonts.regular,
  },

  primaryButton: {
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },

  primaryButtonText: {
    fontSize: 14,
    color: colors.white,
    fontFamily: theme.fonts.semibold,
  },
});

export default GalleryScreen;
