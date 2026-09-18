import {createApi, fetchBaseQuery, retry} from '@reduxjs/toolkit/query/react';
import {ApiGroups, ApiPage, Breed} from '../types/dog';
const rawBaseQuery = fetchBaseQuery({baseUrl: 'https://dogapi.dog/api/v2', timeout: 10000});
const baseQuery = retry(rawBaseQuery, {maxRetries: 3});
export const dogApi = createApi({
  reducerPath: 'dogApi', baseQuery, tagTypes: ['Breed','Groups'],
  endpoints: builder => ({
    getBreedPage: builder.query<ApiPage,{page:number;size?:number}>({query:({page,size=48})=>`/breeds?page[number]=${page}&page[size]=${size}`, providesTags: result => result ? result.data.map(b=>({type:'Breed' as const,id:b.id})).concat([{type:'Breed' as const,id:'LIST'}]) : [{type:'Breed' as const,id:'LIST'}]}),
    getBreedById: builder.query<{data:Breed},{id:string}>({query:({id})=>`/breeds/${id}`, providesTags: (_r,_e,arg)=>[{type:'Breed',id:arg.id}]}),
    getGroups: builder.query<ApiGroups,void>({query:()=>'/groups',providesTags:['Groups']}),
  }),
});
export const {useGetBreedPageQuery,useGetBreedByIdQuery,useGetGroupsQuery} = dogApi;
