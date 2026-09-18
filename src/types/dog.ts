export type Range = {min?: number; max?: number};
export type ImageAttribution = {author: string | null; license: string | null; license_url: string | null; source: string | null; source_url: string | null};
export type DogImage = {id: string; url: string; thumb: string; medium: string; large: string; attribution?: ImageAttribution};
export type Traits = {
  energy?: number; barking?: number; drooling?: number; grooming?: number; shedding?: number;
  trainability?: number; good_with_dogs?: number; exercise_minutes?: number; apartment_friendly?: number;
  good_with_children?: number; good_with_strangers?: number; temperament?: string[];
  [key: string]: number | string[] | undefined;
};
export type BreedAttributes = {
  name: string; description?: string; life?: Range; male_weight?: Range; female_weight?: Range; hypoallergenic?: boolean;
  male_height?: Range; female_height?: Range; origin?: {era?: string; region?: string; country?: string};
  coat?: {type?: string; colors?: string[]; length?: string}; traits?: Traits; other_names?: string[];
  recognized_by?: string[]; sources?: {url: string; title: string}[]; images?: DogImage[];
};
export type Breed = {id: string; type: 'breed'; attributes: BreedAttributes; relationships?: {group?: {data?: {id: string; type: string}}}};
export type Group = {id: string; type: 'group'; attributes: {name: string}};
export type ApiPage = {data: Breed[]; meta: {pagination: {current: number; last: number; records: number}}};
export type ApiGroups = {data: Group[]};
export type FilterState = {groups: string[]; sizes: string[]; coats: string[]; hypoallergenic: boolean | null; traitKey: string | null; traitMin: number};
export const EMPTY_FILTERS: FilterState = {groups: [], sizes: [], coats: [], hypoallergenic: null, traitKey: null, traitMin: 4};
