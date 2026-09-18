import {Breed, Range} from '../types/dog';
export const rangeText = (r?: Range) => !r || (r.min == null && r.max == null) ? '—' : r.min != null && r.max != null ? `${r.min}–${r.max}` : `${r.min ?? r.max}`;
export const sizeBand = (breed: Breed) => {
  const kg = Math.max(breed.attributes.male_weight?.max ?? 0, breed.attributes.female_weight?.max ?? 0);
  if (kg <= 8) return 'Small'; if (kg <= 22) return 'Medium'; if (kg <= 40) return 'Large'; return 'Giant';
};
export const traitLabels: Record<string, string> = {
  energy: 'Energy', barking: 'Barking', drooling: 'Drooling', grooming: 'Grooming', shedding: 'Shedding',
  trainability: 'Trainability', good_with_dogs: 'Good with dogs', exercise_minutes: 'Exercise', apartment_friendly: 'Apartment friendly',
  good_with_children: 'Good with children', good_with_strangers: 'Good with strangers',
};
export const traitKeys = Object.keys(traitLabels);
export const formatDate = (iso?: string | null) => iso ? new Date(iso).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'}) : 'Not synced yet';
