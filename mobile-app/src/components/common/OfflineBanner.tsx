// mobile-app/src/components/common/OfflineBanner.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const OfflineBanner = () => {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setOnline(state.isConnected === true);
    });
    return unsub;
  }, []);
  if (online) return null;
  return (
    <View style={styles.bar}>
      <Text style={styles.text}>Offline — changes will sync when back online</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: { backgroundColor: '#ff9800', paddingVertical: 6, alignItems: 'center' },
  text: { color: '#fff', fontSize: 12 },
});