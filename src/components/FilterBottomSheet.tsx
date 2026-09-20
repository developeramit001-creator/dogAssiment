
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Modal,
    PanResponder,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../theme/theme';
import { Icon } from './Icon';
import { FilterState } from '../types/dog';

type Group = {
    id: string | number;
    attributes: {
        name: string;
    };
};

type FilterBottomSheetProps = {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    groups: Group[];
    currentFilters: FilterState;
};

const sizes = ['Small', 'Medium', 'Large', 'Giant'];

const coats = ['short', 'medium', 'long', 'wire'];

const traits: [string, string][] = [
    ['good_with_children', 'Good with children'],
    ['good_with_dogs', 'Good with dogs'],
    ['good_with_strangers', 'Good with strangers'],
    ['trainability', 'Trainability'],
    ['apartment_friendly', 'Apartment friendly'],
];

const SHEET_HEIGHT = 700;

export default function FilterBottomSheet({
    visible,
    onClose,
    onApply,
    groups,
    currentFilters,
}: FilterBottomSheetProps) {
    const insets = useSafeAreaInsets();

    const translateY = useRef(
        new Animated.Value(SHEET_HEIGHT),
    ).current;

    const isClosingRef = useRef(false);
    const isApplyingRef = useRef(false);

    const [filters, setFiltersState] = useState<FilterState>({
        ...currentFilters,
        groups: [...currentFilters.groups],
        sizes: [...currentFilters.sizes],
        coats: [...currentFilters.coats],
    });

    useEffect(() => {
        if (!visible) {
            return;
        }

        isClosingRef.current = false;
        isApplyingRef.current = false;

        setFiltersState({
            ...currentFilters,
            groups: [...currentFilters.groups],
            sizes: [...currentFilters.sizes],
            coats: [...currentFilters.coats],
        });

        translateY.setValue(SHEET_HEIGHT);

        Animated.timing(translateY, {
            toValue: 0,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [visible]);

    const closeSheet = () => {
        if (isClosingRef.current) {
            return;
        }

        isClosingRef.current = true;

        Animated.timing(translateY, {
            toValue: SHEET_HEIGHT,
            duration: 220,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                isClosingRef.current = false;
                onClose();
            }
        });
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },

            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },

            onPanResponderRelease: (_, gestureState) => {
                const shouldClose =
                    gestureState.dy > 120 || gestureState.vy > 1.2;

                if (shouldClose) {
                    closeSheet();
                    return;
                }

                Animated.spring(translateY, {
                    toValue: 0,
                    damping: 22,
                    stiffness: 220,
                    mass: 0.8,
                    useNativeDriver: true,
                }).start();
            },

            onPanResponderTerminate: () => {
                Animated.spring(translateY, {
                    toValue: 0,
                    damping: 22,
                    stiffness: 220,
                    mass: 0.8,
                    useNativeDriver: true,
                }).start();
            },
        }),
    ).current;

    const toggleArrayValue = (
        key: 'groups' | 'sizes' | 'coats',
        value: string,
    ) => {
        setFiltersState(previous => ({
            ...previous,
            [key]: previous[key].includes(value)
                ? previous[key].filter(item => item !== value)
                : [...previous[key], value],
        }));
    };

    const resetFilters = () => {
        setFiltersState({
            groups: [],
            sizes: [],
            coats: [],
            hypoallergenic: null,
            traitKey: null,
            traitMin: 4,
        });
    };

    const applyFilters = () => {
        if (isApplyingRef.current || isClosingRef.current) {
            return;
        }

        isApplyingRef.current = true;

        // Existing filter logic remains unchanged.
        onApply(filters);

        // Close only after applying the selected filters.
        closeSheet();
    };

    if (!visible) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={closeSheet}
            statusBarTranslucent>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(47, 42, 39, 0.35)',
                }}>
                {/* Background Overlay */}
                <Pressable
                    onPress={closeSheet}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />

                {/* Animated Bottom Sheet */}
                <Animated.View
                    style={{
                        maxHeight: '90%',
                        backgroundColor: theme.colors.bg,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        overflow: 'hidden',
                        paddingBottom: insets.bottom,
                        transform: [{ translateY }],
                    }}>
                    {/* Drag Handle */}
                    <View
                        {...panResponder.panHandlers}
                        style={{
                            alignItems: 'center',
                            paddingTop: theme.spacing.sm,
                            paddingBottom: theme.spacing.xs,
                            backgroundColor: theme.colors.bg,
                        }}>
                        <View
                            style={{
                                width: 46,
                                height: 5,
                                borderRadius: 10,
                                backgroundColor: theme.colors.border,
                            }}
                        />
                    </View>

                    {/* Header */}
                    <View
                        style={{
                            paddingHorizontal: theme.spacing.lg,
                            paddingTop: theme.spacing.sm,
                            paddingBottom: theme.spacing.md,
                            backgroundColor: theme.colors.surface,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.border,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: theme.spacing.sm,
                                flex: 1,
                            }}>
                            <View
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 19,
                                    backgroundColor: theme.colors.cream,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Icon
                                    name="filter"
                                    size={20}
                                    color={theme.colors.coralDark}
                                    strokeWidth={2.2}
                                />
                            </View>

                            <View>
                                <Text
                                    style={{
                                        ...theme.typography.h3,
                                        fontFamily: theme.fonts.bold,
                                        color: theme.colors.text,
                                    }}>
                                    Filters
                                </Text>

                                <Text
                                    style={{
                                        ...theme.typography.caption,
                                        fontFamily: theme.fonts.regular,
                                        color: theme.colors.muted,
                                        marginTop: 2,
                                    }}>
                                    Find your perfect match
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: theme.spacing.sm,
                            }}>
                            <Pressable
                                onPress={resetFilters}
                                hitSlop={8}
                                accessibilityRole="button"
                                accessibilityLabel="Reset all filters"
                                style={{
                                    paddingHorizontal: theme.spacing.sm,
                                    paddingVertical: 6,
                                }}>
                                <Text
                                    style={{
                                        ...theme.typography.labelSmall,
                                        fontFamily: theme.fonts.semibold,
                                        color: theme.colors.coralDark,
                                    }}>
                                    Reset
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={closeSheet}
                                hitSlop={8}
                                accessibilityRole="button"
                                accessibilityLabel="Close filters"
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 17,
                                    backgroundColor: theme.colors.cream,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Icon
                                    name="close"
                                    size={18}
                                    color={theme.colors.text}
                                    strokeWidth={2.2}
                                />
                            </Pressable>
                        </View>
                    </View>

                    {/* Filter Content */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            paddingHorizontal: theme.spacing.lg,
                            paddingTop: theme.spacing.sm,
                            paddingBottom: theme.spacing.xl,
                        }}>
                        {/* Breed Group */}
                        <FilterSectionTitle title="Breed Group" />

                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: theme.spacing.sm,
                            }}>
                            {groups.map(group => (
                                <FilterChip
                                    key={group.id}
                                    text={group.attributes.name}
                                    selected={filters.groups.includes(
                                        group.attributes.name,
                                    )}
                                    onPress={() =>
                                        toggleArrayValue(
                                            'groups',
                                            group.attributes.name,
                                        )
                                    }
                                />
                            ))}
                        </View>

                        {/* Size */}
                        <FilterSectionTitle title="Size" />

                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: theme.spacing.sm,
                            }}>
                            {sizes.map(size => (
                                <FilterChip
                                    key={size}
                                    text={size}
                                    selected={filters.sizes.includes(size)}
                                    onPress={() =>
                                        toggleArrayValue('sizes', size)
                                    }
                                />
                            ))}
                        </View>

                        {/* Coat Length */}
                        <FilterSectionTitle title="Coat Length" />

                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: theme.spacing.sm,
                            }}>
                            {coats.map(coat => (
                                <FilterChip
                                    key={coat}
                                    text={
                                        coat.charAt(0).toUpperCase() +
                                        coat.slice(1)
                                    }
                                    selected={filters.coats.includes(coat)}
                                    onPress={() =>
                                        toggleArrayValue('coats', coat)
                                    }
                                />
                            ))}
                        </View>

                        {/* Hypoallergenic */}
                        <FilterSectionTitle title="Hypoallergenic" />

                        <View
                            style={{
                                flexDirection: 'row',
                                gap: theme.spacing.sm,
                            }}>
                            <FilterChip
                                text="Yes"
                                selected={filters.hypoallergenic === true}
                                onPress={() =>
                                    setFiltersState(previous => ({
                                        ...previous,
                                        hypoallergenic:
                                            previous.hypoallergenic === true
                                                ? null
                                                : true,
                                    }))
                                }
                            />

                            <FilterChip
                                text="No"
                                selected={filters.hypoallergenic === false}
                                onPress={() =>
                                    setFiltersState(previous => ({
                                        ...previous,
                                        hypoallergenic:
                                            previous.hypoallergenic === false
                                                ? null
                                                : false,
                                    }))
                                }
                            />
                        </View>

                        {/* Traits */}
                        <FilterSectionTitle title="Trait Threshold · 4+" />

                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: theme.spacing.sm,
                            }}>
                            {traits.map(([key, label]) => (
                                <FilterChip
                                    key={key}
                                    text={label}
                                    selected={filters.traitKey === key}
                                    onPress={() =>
                                        setFiltersState(previous => ({
                                            ...previous,
                                            traitKey:
                                                previous.traitKey === key
                                                    ? null
                                                    : key,
                                        }))
                                    }
                                />
                            ))}
                        </View>
                    </ScrollView>

                    {/* Bottom Action */}
                    <View
                        style={{
                            paddingHorizontal: theme.spacing.lg,
                            paddingTop: theme.spacing.md,
                            paddingBottom: theme.spacing.sm,
                            backgroundColor: theme.colors.surface,
                            borderTopWidth: 1,
                            borderTopColor: theme.colors.border,
                        }}>
                        <Pressable
                            onPress={applyFilters}
                            accessibilityRole="button"
                            accessibilityLabel="Apply filters"
                            style={({ pressed }) => ({
                                minHeight: 52,
                                borderRadius: theme.radius.lg,
                                backgroundColor: pressed
                                    ? theme.colors.coralDark
                                    : theme.colors.coral,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                gap: theme.spacing.sm,
                            })}>
                            <Text
                                style={{
                                    ...theme.typography.button,
                                    fontFamily: theme.fonts.bold,
                                    color: theme.colors.white,
                                }}>
                                Apply Filters
                            </Text>

                            <Icon
                                name="chevron"
                                size={20}
                                color={theme.colors.white}
                                strokeWidth={2.5}
                            />
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

function FilterSectionTitle({ title }: { title: string }) {
    return (
        <Text
            style={{
                ...theme.typography.body,
                fontFamily: theme.fonts.bold,
                color: theme.colors.text,
                marginTop: theme.spacing.lg,
                marginBottom: theme.spacing.sm,
            }}>
            {title}
        </Text>
    );
}

function FilterChip({
    text,
    selected,
    onPress,
}: {
    text: string;
    selected: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={({ pressed }) => ({
                minHeight: 42,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.radius.md,
                backgroundColor: selected
                    ? theme.colors.coral
                    : theme.colors.surface,
                borderWidth: 1,
                borderColor: selected
                    ? theme.colors.coral
                    : theme.colors.border,
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.xs,
                opacity: pressed ? 0.75 : 1,
            })}>
            {selected && (
                <Icon
                    name="check"
                    size={15}
                    color={theme.colors.white}
                    strokeWidth={2.5}
                />
            )}

            <Text
                style={{
                    ...theme.typography.bodySmall,
                    fontFamily: theme.fonts.semibold,
                    color: selected
                        ? theme.colors.white
                        : theme.colors.text,
                }}>
                {text}
            </Text>
        </Pressable>
    );
}
