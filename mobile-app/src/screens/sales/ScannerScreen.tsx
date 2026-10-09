import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useNavigate } from 'react-router-native';

export const ScannerScreen = () => {
  const navigate = useNavigate();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.icon}>📷</Text>
          <Text style={styles.title}>Scanner Disabled</Text>
          <Text style={styles.message}>
            Barcode scanner is currently disabled to avoid dependency conflicts.
          </Text>
          <Button mode="contained" onPress={() => navigate(-1)} style={styles.button}>
            Go Back
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#f5f5f5' },
  card: { width: '100%', maxWidth: 400, padding: 16 },
  icon: { fontSize: 48, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  message: { textAlign: 'center', color: '#666', marginBottom: 16 },
  button: { marginTop: 8 },
});