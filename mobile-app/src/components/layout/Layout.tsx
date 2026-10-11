import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Outlet, useNavigate, useLocation } from 'react-router-native';

const items = [
  { path: '/', label: 'Home' },
  { path: '/sales', label: 'Sales' },
  { path: '/inventory', label: 'Stock' },
  { path: '/production', label: 'Prod' },
  { path: '/finance', label: 'Finance' },
  { path: '/reports', label: 'Reports' },
];

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Outlet />
      </View>
      <View style={styles.bottomNav}>
        {items.map(item => (
          <TouchableOpacity
            key={item.path}
            style={styles.navItem}
            onPress={() => navigate(item.path)}
          >
            <Text
              style={[
                styles.label,
                location.pathname === item.path && styles.activeLabel,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 12,
  },
  navItem: { flex: 1, alignItems: 'center' },
  label: { fontSize: 12, color: '#757575' },
  activeLabel: { color: '#1976d2', fontWeight: 'bold' },
});