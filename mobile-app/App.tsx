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

function AppShell() {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(setLoading(false)), 4000);

    const unsub = onAuthStateChanged(
      auth,
      (user) => {
        clearTimeout(timer);
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
      (err) => {
        console.error('Auth listener error:', err);
        clearTimeout(timer);
        dispatch(clearUser());
      }
    );

    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, [dispatch]);

  return (
    <NativeRouter>
      <AppRoutes />
    </NativeRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <AppShell />
      </PaperProvider>
    </Provider>
  );
}