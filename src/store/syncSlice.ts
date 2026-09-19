import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type State = {
  online: boolean;
  syncing: boolean;
  lastSync: string | null;
  error: string | null;
  cachedCount: number;
  progress: number;
};
const initialState: State = {
  online: true,
  syncing: false,
  lastSync: null,
  error: null,
  cachedCount: 0,
  progress: 0,
};
const slice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setOnline: (s, a: PayloadAction<boolean>) => {
      s.online = a.payload;
    },
    startSync: s => {
      s.syncing = true;
      s.error = null;
      s.progress = 0;
    },
    progress: (s, a: PayloadAction<number>) => {
      s.progress = a.payload;
    },
    finishSync: (s, a: PayloadAction<{ lastSync: string; count: number }>) => {
      s.syncing = false;
      s.lastSync = a.payload.lastSync;
      s.cachedCount = a.payload.count;
      s.progress = 1;
    },
    failSync: (s, a: PayloadAction<string>) => {
      s.syncing = false;
      s.error = a.payload;
    },
    setCachedCount: (s, a: PayloadAction<number>) => {
      s.cachedCount = a.payload;
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
} = slice.actions;
export default slice.reducer;
