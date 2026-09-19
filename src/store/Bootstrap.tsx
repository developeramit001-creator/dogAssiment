import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch, useAppSelector } from './hooks';
import { setOnline } from './syncSlice';
import { hydrateApp } from './appSlice';
import { hydrateCache, syncAll } from './syncService';
export function Bootstrap() {
  const dispatch = useAppDispatch();
  const online = useAppSelector(s => s.sync.online);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    (async () => {
      await dispatch(hydrateApp() as never);
      const state = await NetInfo.fetch();
      dispatch(setOnline(!!state.isConnected));
      await hydrateCache();
      if (state.isConnected) await syncAll();
      if (mounted) setReady(true);
    })();
    const unsub = NetInfo.addEventListener(s => {
      const next = !!s.isConnected;
      dispatch(setOnline(next));
      if (next && !online) syncAll();
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);
  return null;
}
