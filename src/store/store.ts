import { configureStore } from '@reduxjs/toolkit';
import app from './appSlice';
import sync from './syncSlice';
import cache from './cacheSlice';
import { dogApi } from '../api/dogApi';
export const store = configureStore({
  reducer: { app, sync, cache, [dogApi.reducerPath]: dogApi.reducer },
  middleware: getDefault =>
    getDefault({ serializableCheck: false }).concat(dogApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
