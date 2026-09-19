import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { Breed, Group } from '../types/dog';

export const breedAdapter = createEntityAdapter<Breed>();
export const groupAdapter = createEntityAdapter<Group>();

export type CacheState = {
  breeds: ReturnType<typeof breedAdapter.getInitialState>;
  groups: ReturnType<typeof groupAdapter.getInitialState>;
};

const initialState: CacheState = {
  breeds: breedAdapter.getInitialState(),
  groups: groupAdapter.getInitialState(),
};

const slice = createSlice({
  name: 'cache',
  initialState,

  reducers: {
    setBreeds: (state, action: PayloadAction<Breed[]>) => {
      breedAdapter.setAll(state.breeds, action.payload);
    },

    setBreed: (state, action: PayloadAction<Breed>) => {
      breedAdapter.upsertOne(state.breeds, action.payload);
    },

    setGroups: (state, action: PayloadAction<Group[]>) => {
      groupAdapter.setAll(state.groups, action.payload);
    },

    clearCache: state => {
      breedAdapter.removeAll(state.breeds);
      groupAdapter.removeAll(state.groups);
    },
  },
});

export const { setBreeds, setBreed, setGroups, clearCache } = slice.actions;

export default slice.reducer;

// Selectors
const breedSelectors = breedAdapter.getSelectors(
  (state: CacheState) => state.breeds,
);

const groupSelectors = groupAdapter.getSelectors(
  (state: CacheState) => state.groups,
);

export const selectAllBreeds = (state: { cache: CacheState }) =>
  breedSelectors.selectAll(state.cache);

export const selectAllGroups = (state: { cache: CacheState }) =>
  groupSelectors.selectAll(state.cache);
