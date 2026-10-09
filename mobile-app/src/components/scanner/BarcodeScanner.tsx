import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export const BarcodeScanner = ({ onClose }: { onClose: () => void }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📷</Text>
      <Text style={styles.title}>Scanner Unavailable</Text>
      <Text style={styles.message}>
        Barcode scanner is currently disabled to avoid dependency conflicts.
      </Text>
      <Button mode="contained" onPress={onClose} style={styles.button}>
        Go Back
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#f5f5f5' },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  message: { textAlign: 'center', color: '#666', marginBottom: 16 },
  button: { marginTop: 8 },
});