import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NativeRouter } from 'react-router-native';
import { PaperProvider } from 'react-native-paper';
import { store } from './src/store/store';
import { AppRoutes } from './src/navigation/AppRoutes';
import { OfflineIndicator } from './src/components/common/OfflineIndicator';
import { theme } from './src/utils/theme';
import { syncManager } from './src/services/sync/SyncManager';

export default function App() {
  useEffect(() => { syncManager.init(); }, []);
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NativeRouter>
          <OfflineIndicator />
          <AppRoutes />
        </NativeRouter>
      </PaperProvider>
    </Provider>
  );
}