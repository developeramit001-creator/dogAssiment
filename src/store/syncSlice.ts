
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  online: boolean;
  syncing: boolean;
  lastSync: string | null;
  error: string | null;
  cachedCount: number;
  progress: number;

  // Initial app data loading status
  bootstrapReady: boolean;
};

const initialState: State = {
  online: true,
  syncing: false,
  lastSync: null,
  error: null,
  cachedCount: 0,
  progress: 0,

  // App starts in loading state
  bootstrapReady: false,
};

const slice = createSlice({
  name: 'sync',

  initialState,

  reducers: {
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    },

    startSync: state => {
      state.syncing = true;
      state.error = null;
      state.progress = 0;
    },

    progress: (state, action: PayloadAction<number>) => {
      state.progress = Math.max(
        0,
        Math.min(1, action.payload),
      );
    },

    finishSync: (
      state,
      action: PayloadAction<{
        lastSync: string;
        count: number;
      }>,
    ) => {
      state.syncing = false;
      state.lastSync = action.payload.lastSync;
      state.cachedCount = action.payload.count;
      state.progress = 1;
      state.error = null;
    },

    failSync: (state, action: PayloadAction<string>) => {
      state.syncing = false;
      state.error = action.payload;
    },

    setCachedCount: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.cachedCount = action.payload;
    },

    // Called when initial cache/data loading is complete
    setBootstrapReady: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.bootstrapReady = action.payload;
    },

    // Reset Sync Center data after clearing offline storage
    resetSyncState: state => {
      state.syncing = false;
      state.lastSync = null;
      state.cachedCount = 0;
      state.progress = 0;
      state.error = null;
    },
  },
});

export const {
  setOnline,
  startSync,
  progress,
  finishSync,
  failSync,
  setCachedCount,
  setBootstrapReady,
  resetSyncState,
} = slice.actions;

export default slice.reducer;