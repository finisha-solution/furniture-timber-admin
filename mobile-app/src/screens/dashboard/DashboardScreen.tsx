import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigate } from 'react-router-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';

export const DashboardScreen = () => {
  const [todaySales, setTodaySales] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const snap = await getDocs(query(collection(db, 'sales'), where('createdAt', '>=', today)));
        let total = 0;
        const list: any[] = [];
        snap.forEach((d) => {
          const x = d.data();
          total += x.finalAmount || 0;
          list.push({ id: d.id, customerName: x.customerName || 'Walk-in', finalAmount: x.finalAmount || 0 });
        });
        setTodaySales(total);
        setRecent(list.slice(0, 5));

        const products = await getDocs(collection(db, 'products'));
        setLowStock(products.docs.filter((d) => (d.data().stockQty || 0) <= (d.data().reorderPoint || 10)).length);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Sales</Text>
        <Text style={styles.amount}>{formatCurrency(todaySales)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome, {user?.name || 'User'}</Text>
        <Text style={styles.subtitle}>Low stock alerts: {lowStock} products</Text>
        {lowStock > 0 && (
          <TouchableOpacity style={styles.outlineBtn} onPress={() => navigate('/inventory')}>
            <Text style={styles.outlineBtnText}>View Stock</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Sales</Text>
        {recent.length === 0 ? (
          <Text style={styles.empty}>No sales today</Text>
        ) : recent.map((s) => (
          <View key={s.id} style={styles.row}>
            <Text>{s.customerName}</Text>
            <Text>{formatCurrency(s.finalAmount)}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigate('/sales')}>
          <Text style={styles.primaryBtnText}>Start New Sale</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#212121' },
  amount: { fontSize: 28, fontWeight: 'bold', color: '#1976d2', marginTop: 8 },
  subtitle: { color: '#555', marginTop: 4 },
  empty: { color: '#888', textAlign: 'center', padding: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  primaryBtn: { backgroundColor: '#1976d2', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  primaryBtnText: { color: '#fff', fontWeight: '600' },
  outlineBtn: { borderWidth: 1, borderColor: '#1976d2', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  outlineBtnText: { color: '#1976d2', fontWeight: '600' },
});