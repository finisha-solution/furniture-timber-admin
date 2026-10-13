import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { NativeRouter } from 'react-router-native';
import { PaperProvider } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';

import { store } from './src/store/store';
import { AppRoutes } from './src/navigation/AppRoutes';
import { theme } from './src/utils/theme';
import { auth } from './src/services/firebase/config';
import { setUser, clearUser, setLoading } from './src/store/slices/authSlice';
import { syncManager } from './src/services/sync/SyncManager';
import { OfflineBanner } from './src/components/common/OfflineBanner';

function AppInner() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialise the offline sync manager. This is safe to call even
    // when the device is offline — it just loads the pending queue.
    try {
      syncManager.init();
    } catch (err) {
      console.warn('SyncManager init failed:', err);
    }

    // Safety timeout so the app never hangs on a slow Firebase response.
    const safety = setTimeout(() => dispatch(setLoading(false)), 5000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        clearTimeout(safety);
        if (user) {
          dispatch(setUser({
            uid: user.uid,
            name: user.displayName || user.email || 'User',
            email: user.email || '',
            role: 'admin',
          }));
        } else {
          dispatch(clearUser());
        }
      },
      (err) => {
        console.error('Auth listener error:', err);
        clearTimeout(safety);
        dispatch(clearUser());
      }
    );

    return () => {
      clearTimeout(safety);
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <NativeRouter>
      <OfflineBanner />
      <AppRoutes />
    </NativeRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <AppInner />
      </PaperProvider>
    </Provider>
  );
}