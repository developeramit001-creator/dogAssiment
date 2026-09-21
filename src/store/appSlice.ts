import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EMPTY_FILTERS, FilterState } from '../types/dog';

// AsyncStorage keys
const FAV_KEY = 'tripare:favorites';
const ONBOARD_KEY = 'tripare:onboarded';
const SETTINGS_KEY = 'tripare:settings';

// App state type
type State = {
  favorites: string[];
  filters: FilterState;
  onboarded: boolean;
};

// Initial state
const initialState: State = {
  favorites: [],
  filters: EMPTY_FILTERS,
  onboarded: false,
};

// Redux slice
const slice = createSlice({
  name: 'app',

  initialState,

  reducers: {
    // Set favorites
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.favorites = action.payload;
    },

    // Add or remove favorite
    toggleFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.includes(action.payload)
        ? state.favorites.filter(item => item !== action.payload)
        : [...state.favorites, action.payload];
    },

    // Set filters
    setFilters: (state, action: PayloadAction<FilterState>) => {
      state.filters = action.payload;
    },

    // Set onboarding status
    setOnboarded: (state, action: PayloadAction<boolean>) => {
      state.onboarded = action.payload;
    },

    // Reset filters
    resetFilters: state => {
      state.filters = {
        ...EMPTY_FILTERS,
        groups: [],
        sizes: [],
        coats: [],
      };
    },
  },
});

// Export actions
export const {
  setFavorites,
  toggleFavorite,
  setFilters,
  setOnboarded,
  resetFilters,
} = slice.actions;

// Export reducer
export default slice.reducer;

// Hydrate app data from AsyncStorage
export const hydrateApp = () => async (dispatch: any) => {
  try {
    const [favorites, onboarded] = await Promise.all([
      AsyncStorage.getItem(FAV_KEY),
      AsyncStorage.getItem(ONBOARD_KEY),
    ]);

    // Restore favorites
    if (favorites) {
      dispatch(setFavorites(JSON.parse(favorites)));
    }

    // Restore onboarding status
    if (onboarded) {
      dispatch(setOnboarded(onboarded === '1'));
    }
  } catch (error) {
    console.error('Hydrate app error:', error);
  }
};

// Persist favorites
export const persistFavorites =
  (favorites: string[]) => async () => {
    try {
      await AsyncStorage.setItem(
        FAV_KEY,
        JSON.stringify(favorites),
      );
    } catch (error) {
      console.error('Persist favorites error:', error);
    }
  };

// Persist onboarding status
export const persistOnboarded = () => async () => {
  try {
    await AsyncStorage.setItem(ONBOARD_KEY, '1');
  } catch (error) {
    console.error('Persist onboarding error:', error);
  }
};

// Clear offline app data
export const clearOfflineAppData =
  () => async (dispatch: any) => {
    try {
      // Clear app settings
      await AsyncStorage.removeItem(SETTINGS_KEY);

      // Clear onboarding status
      await AsyncStorage.removeItem(ONBOARD_KEY);

      // Reset filters
      dispatch(resetFilters());



      // IMPORTANT:
      // Favorites ko clear nahi karna hai.
      // FAV_KEY ko remove nahi karna.
    } catch (error) {
      console.error('Clear offline app data error:', error);
      throw error;
    }
  };
