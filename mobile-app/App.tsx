import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { NativeRouter } from 'react-router-native';
import { PaperProvider } from 'react-native-paper';
import { store } from './src/store/store';
import { AppRoutes } from './src/navigation/AppRoutes';
import { OfflineIndicator } from './src/components/common/OfflineIndicator';
import { theme } from './src/utils/theme';
import { syncManager } from './src/services/sync/SyncManager';
import { auth } from './src/services/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, clearUser, setLoading } from './src/store/slices/authSlice';

function AppInner() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize offline sync manager
    syncManager.init();

    // Safety timeout: if Firebase doesn't respond in 5s, force loading=false
    const safetyTimeout = setTimeout(() => {
      dispatch(setLoading(false));
    }, 5000);

    // Listen to Firebase auth changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        clearTimeout(safetyTimeout);
        if (user) {
          dispatch(
            setUser({
              uid: user.uid,
              name: user.displayName || user.email || 'User',
              email: user.email || '',
              role: 'admin',
            })
          );
        } else {
          dispatch(clearUser());
        }
      },
      (error) => {
        console.error('Auth listener error:', error);
        clearTimeout(safetyTimeout);
        dispatch(clearUser());
      }
    );

    return () => {
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <NativeRouter>
      <OfflineIndicator />
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