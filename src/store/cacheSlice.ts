import {createEntityAdapter,createSlice,PayloadAction} from '@reduxjs/toolkit'; import {Breed,Group} from '../types/dog';
export const breedAdapter=createEntityAdapter<Breed>(); export const groupAdapter=createEntityAdapter<Group>();
export type CacheState={breeds:ReturnType<typeof breedAdapter.getInitialState>;groups:ReturnType<typeof groupAdapter.getInitialState>};
const initialState:CacheState={breeds:breedAdapter.getInitialState(),groups:groupAdapter.getInitialState()};
const slice=createSlice({name:'cache',initialState,reducers:{setBreeds:(s,a:PayloadAction<Breed[]>)=>{breedAdapter.setAll(s.breeds,a.payload)},setBreed:(s,a:PayloadAction<Breed>)=>{breedAdapter.upsertOne(s.breeds,a.payload)},setGroups:(s,a:PayloadAction<Group[]>)=>{groupAdapter.setAll(s.groups,a.payload)},clearCache:s=>{breedAdapter.removeAll(s.breeds);groupAdapter.removeAll(s.groups)}}});
export const {setBreeds,setBreed,setGroups,clearCache}=slice.actions; export default slice.reducer;
export const selectAllBreeds=(state:{cache:CacheState})=>breedAdapter.getSelectors((s:CacheState)=>s.breeds)(state.cache);
export const selectAllGroups=(state:{cache:CacheState})=>groupAdapter.getSelectors((s:CacheState)=>s.groups)(state.cache);
