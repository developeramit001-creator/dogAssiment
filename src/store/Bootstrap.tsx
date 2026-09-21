import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';

import { useAppDispatch, useAppSelector } from './hooks';
import { setOnline, setBootstrapReady } from './syncSlice';
import { hydrateApp } from './appSlice';
import { hydrateCache, syncAll } from './syncService';

export function Bootstrap() {
  const dispatch = useAppDispatch();

  const online = useAppSelector(state => state.sync.online);

  const onlineRef = useRef(online);

  useEffect(() => {
    onlineRef.current = online;
  }, [online]);

  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      try {
        // Initially splash screen show hogi
        dispatch(setBootstrapReady(false));

        // 1. Local app settings, onboarding and favorites hydrate
        await dispatch(hydrateApp() as never);

        // 2. Local cache load
        // Isme sirf local storage/cache ka kaam hona chahiye
        await hydrateCache();

        // 3. App ko immediately ready kar do
        // Network/API sync ka wait nahi karega
        if (mounted) {
          dispatch(setBootstrapReady(true));
        }

        // 4. Network check background mein
        const networkState = await NetInfo.fetch();
        const isConnected = Boolean(networkState.isConnected);

        dispatch(setOnline(isConnected));
        onlineRef.current = isConnected;

        // 5. Latest data background mein sync hoga
        // Splash screen iske liye wait nahi karegi
        if (isConnected) {
          syncAll().catch(error => {
            console.warn('Background sync failed:', error);
          });
        }
      } catch (error) {
        console.warn('Bootstrap initialization failed:', error);

        // Error hone par bhi app ko stuck mat hone do
        if (mounted) {
          dispatch(setBootstrapReady(true));
        }
      }
    };

    initializeApp();

    // Network change listener
    const unsubscribe = NetInfo.addEventListener(networkState => {
      const isConnected = Boolean(networkState.isConnected);
      const wasOnline = onlineRef.current;

      dispatch(setOnline(isConnected));
      onlineRef.current = isConnected;

      // Offline se online aane par background sync
      if (isConnected && !wasOnline) {
        syncAll().catch(error => {
          console.warn('Background sync failed:', error);
        });
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [dispatch]);

  return null;
}
