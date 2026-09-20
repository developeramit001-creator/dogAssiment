import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { theme } from '../theme/theme';
import { Button } from '../components/UI';
import { useAppDispatch } from '../store/hooks';
import {
  persistOnboarded,
  setOnboarded,
} from '../store/appSlice';
import { RootStackParamList } from '../navigation/types';

type P = NativeStackScreenProps<
  RootStackParamList,
  'Onboarding'
>;

const slides = [
  {
    title: 'Meet 283 amazing breeds',
    text: 'Explore a rich breed library with friendly visuals and useful facts.',
    image:
      'https://images.dogapi.dog/bsqjg6ibg65zzfcixdr1x0c6d2b6',
  },
  {
    title: 'Find the right fit',
    text: 'Search by name and filter by group, size, coat, allergies and traits.',
    image:
      'https://images.dogapi.dog/ahkgrjwpqskhevhey02f84ikxn0t',
  },
  {
    title: 'Works when life goes offline',
    text: 'Your library stays on-device and syncs again when your connection returns.',
    image:
      'https://images.dogapi.dog/ohf04zsgh911n30j53gsn5hu9o79',
  },
];

export default function OnboardingScreen({
  navigation,
}: P) {
  const [i, setI] = useState(0);

  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const s = slides[i];

  /**
   * Complete onboarding and navigate to Main.
   * This function is used by both Skip and the final button.
   */
  const finish = () => {
    dispatch(setOnboarded(true));
    dispatch(persistOnboarded() as never);

    navigation.replace('Main');
  };

  /**
   * Continue to the next slide.
   * On the last slide, finish onboarding.
   */
  const handleContinue = () => {
    if (i === slides.length - 1) {
      finish();
      return;
    }

    setI(currentIndex => currentIndex + 1);
  };

  /**
   * Skip onboarding and open the main app.
   */
  const handleSkip = () => {
    finish();
  };

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 16,
        },
      ]}
    >
      {/* Skip Button */}
      <Pressable
        onPress={handleSkip}
        style={styles.skip}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Skip onboarding"
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      {/* Image Section */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: s.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Paw Badge */}
        <View style={styles.paw}>
          <Text style={styles.pawIcon}>🐾</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Brand */}
        <Text style={styles.brand}>
          Paw
          <Text style={styles.brandHighlight}>Buddy</Text>
        </Text>

        {/* Slide Title */}
        <Text style={styles.title}>{s.title}</Text>

        {/* Slide Description */}
        <Text style={styles.text}>{s.text}</Text>

        {/* Pagination Dots */}
        <View style={styles.dots}>
          {slides.map((_, n) => (
            <View
              key={n}
              style={[
                styles.dot,
                n === i && styles.active,
              ]}
            />
          ))}
        </View>

        {/* Continue / Start Exploring Button */}
        <Button
          title={
            i === slides.length - 1
              ? 'Start exploring'
              : 'Continue'
          }
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
  },

  skip: {
    alignSelf: 'flex-end',
    padding: 8,
  },

  skipText: {
    color: colors.muted,
    fontSize: 14,
    fontFamily: theme.fonts.semibold,
  },

  imageWrap: {
    height: '50%',
    marginTop: 8,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: colors.cream,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  paw: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pawIcon: {
    fontSize: 42,
  },

  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  brand: {
    fontSize: 17,
    lineHeight: 23,
    fontFamily: theme.fonts.semibold,
    color: colors.text,
    marginBottom: 7,
  },

  brandHighlight: {
    color: colors.coral,
    fontFamily: theme.fonts.semibold,
  },

  title: {
    fontSize: 30,
    lineHeight: 35,
    fontFamily: theme.fonts.semibold,
    color: colors.text,
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: theme.fonts.regular,
    color: colors.muted,
    marginTop: 10,
    marginBottom: 18,
  },

  dots: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 16,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },

  active: {
    width: 24,
    backgroundColor: colors.coral,
  },
});
