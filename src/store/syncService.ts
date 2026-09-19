import NetInfo from '@react-native-community/netinfo';
import { store } from './store';
import { dogApi } from '../api/dogApi';
import {
  finishSync,
  failSync,
  progress,
  startSync,
  setCachedCount,
} from './syncSlice';
import { setBreeds, setGroups, selectAllBreeds } from './cacheSlice';
import {
  getBreeds,
  getGroups,
  initDb,
  replaceBreeds,
  replaceGroups,
  setMeta,
  getMeta,
} from '../database';

export async function hydrateCache() {
  await initDb();
  const [breeds, groups, last] = await Promise.all([
    getBreeds(),
    getGroups(),
    getMeta('last_sync'),
  ]);
  store.dispatch(setBreeds(breeds));
  store.dispatch(setGroups(groups));
  store.dispatch(setCachedCount(breeds.length));
  if (last)
    store.dispatch(finishSync({ lastSync: last, count: breeds.length }));
  return { breeds, groups, last };
}
export async function syncAll() {
  const net = await NetInfo.fetch();
  if (!net.isConnected) {
    store.dispatch(failSync('You are offline. Cached data is available.'));
    return false;
  }
  store.dispatch(startSync());
  try {
    const first = await store
      .dispatch(
        dogApi.endpoints.getBreedPage.initiate(
          { page: 1, size: 48 },
          { forceRefetch: true },
        ),
      )
      .unwrap();
    const lastPage = first.meta.pagination.last;
    const pages = [first.data];
    store.dispatch(progress(1 / lastPage));
    const results = await Promise.allSettled(
      Array.from({ length: lastPage - 1 }, (_, i) =>
        store
          .dispatch(
            dogApi.endpoints.getBreedPage.initiate(
              { page: i + 2, size: 48 },
              { forceRefetch: true },
            ),
          )
          .unwrap(),
      ),
    );
    const failed = results.filter(x => x.status === 'rejected').length;
    for (const r of results)
      if (r.status === 'fulfilled') pages.push(r.value.data);
    const breeds = pages.flat();
    if (breeds.length) {
      await replaceBreeds(breeds);
      store.dispatch(setBreeds(breeds));
    }
    const groupsResult = await store
      .dispatch(
        dogApi.endpoints.getGroups.initiate(undefined, { forceRefetch: true }),
      )
      .unwrap();
    await replaceGroups(groupsResult.data);
    store.dispatch(setGroups(groupsResult.data));
    const now = new Date().toISOString();
    await setMeta('last_sync', now);
    store.dispatch(finishSync({ lastSync: now, count: breeds.length }));
    if (failed > 0)
      store.dispatch(
        failSync(
          `Synced ${breeds.length} breeds, but ${failed} page${
            failed > 1 ? 's' : ''
          } failed. Cached data remains available.`,
        ),
      );
    return failed === 0;
  } catch (e) {
    store.dispatch(failSync('Sync failed. Showing cached data.'));
    return false;
  }
}
export async function refreshBreed(id: string) {
  const result = await store
    .dispatch(
      dogApi.endpoints.getBreedById.initiate({ id }, { forceRefetch: true }),
    )
    .unwrap();
  const current = selectAllBreeds(store.getState());
  const next = current.map(b => (b.id === id ? result.data : b));
  await replaceBreeds(next);
  store.dispatch(setBreeds(next));
  return result.data;
}
