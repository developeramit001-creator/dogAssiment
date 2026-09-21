export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;

  BreedDetail: {
    breedId: string;
  };

  Filter: undefined;

  Gallery: {
    images: string[];
    initialIndex?: number;
  };
}
export type MainTabParamList = {
  Explore: undefined;
  Favorites: undefined;
  Sync: undefined;
  Settings: undefined;
};
