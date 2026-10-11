import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Navigate, Outlet } from 'react-router-native';
import { useSelector } from 'react-redux';

export const PrivateRoute = () => {
  const { user, isLoading } = useSelector((state: any) => state.auth);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});