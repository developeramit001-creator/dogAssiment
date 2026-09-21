import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { Icon } from '../components/Icon';
import { useAppSelector } from '../store/hooks';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SyncScreen from '../screens/SyncScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BreedDetailScreen from '../screens/BreedDetailScreen';
import FilterScreen from '../screens/FilterScreen';
import GalleryScreen from '../screens/GalleryScreen';

import {
  RootStackParamList,
  MainTabParamList,
} from './types';
import { Pressable } from 'react-native';

const Stack =
  createNativeStackNavigator<RootStackParamList>();

const Tabs =
  createBottomTabNavigator<MainTabParamList>();

// -----------------------------------------------------
// Main Bottom Tabs
// -----------------------------------------------------

// -----------------------------------------------------
// Main Bottom Tabs
// -----------------------------------------------------

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // Active and inactive icon/text colors
        tabBarActiveTintColor: colors.coral,
        tabBarInactiveTintColor: colors.muted,

        // Remove Android black ripple/shade
        tabBarButton: props => (
          <Pressable
            {...props}
            android_ripple={{
              color: 'transparent',
              borderless: true,
            }}
            style={props.style}
          />
        ),

        // Bottom tab bar styling
        tabBarStyle: {
          height: 62 + insets.bottom,

          paddingBottom: Math.max(8, insets.bottom),
          paddingTop: 7,

          backgroundColor: colors.surface,
          borderTopColor: colors.border,

          // Remove unwanted shadow
          elevation: 0,
          shadowColor: 'transparent',
          shadowOpacity: 0,
          shadowRadius: 0,
          shadowOffset: {
            width: 0,
            height: 0,
          },
        },

        // Consistent icon size
        tabBarIconStyle: {
          marginTop: 1,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIcon: ({ color }) => {
          const icons: Record<string, string> = {
            Explore: 'home',
            Favorites: 'heart',
            Sync: 'sync',
            Settings: 'settings',
          };

          return (
            <Icon
              name={icons[route.name] || 'paw'}
              color={color}
              size={22}
            />
          );
        },
      })}
    >
      <Tabs.Screen
        name="Explore"
        component={HomeScreen}
      />

      <Tabs.Screen
        name="Favorites"
        component={FavoritesScreen}
      />

      <Tabs.Screen
        name="Sync"
        component={SyncScreen}
      />

      <Tabs.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Tabs.Navigator>
  );
}

// -----------------------------------------------------
// App Navigator
// -----------------------------------------------------

export function AppNavigator() {
  const onboarded = useAppSelector(
    state => state.app.onboarded,
  );

  const bootstrapReady = useAppSelector(
    state => state.sync.bootstrapReady,
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,

        animation: 'none',

        contentStyle: {
          backgroundColor: colors.bg,
        },
      }}
    >
      {/* --------------------------------------------- */}
      {/* Splash - only during initial bootstrap */}
      {/* --------------------------------------------- */}

      {!bootstrapReady && (
        <Stack.Screen name="Splash">
          {() => (
            <SplashScreen
              bootstrapReady={bootstrapReady}
            />
          )}
        </Stack.Screen>
      )}

      {/* --------------------------------------------- */}
      {/* First-time user */}
      {/* --------------------------------------------- */}

      {bootstrapReady && !onboarded && (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
        />
      )}

      {/* --------------------------------------------- */}
      {/* Existing user */}
      {/* --------------------------------------------- */}

      {bootstrapReady && onboarded && (
        <Stack.Screen
          name="Main"
          component={MainTabs}
        />
      )}

      {/* --------------------------------------------- */}
      {/* Other Screens */}
      {/* --------------------------------------------- */}

      <Stack.Screen
        name="BreedDetail"
        component={BreedDetailScreen}
      />

      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={{
          presentation: 'modal',
          animation: 'none',
        }}
      />

      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
      />
    </Stack.Navigator>
  );
}
