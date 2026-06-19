import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Text, ActivityIndicator, Divider } from 'react-native-paper';
import { db } from '../../services/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { formatCurrency } from '../../utils/formatters';

export const ProfitLossScreen = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ revenue: 0, cogs: 0, grossProfit: 0, expenses: 0, netProfit: 0, margin: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesSnap = await getDocs(collection(db, 'sales'));
        let revenue = 0, cost = 0;
        salesSnap.forEach(d => {
          revenue += d.data().finalAmount || 0;
          cost += d.data().profit ? (d.data().finalAmount - d.data().profit) : 0;
        });
        const expensesSnap = await getDocs(collection(db, 'expenditures'));
        let expenses = 0;
        expensesSnap.forEach(d => {
          if (d.data().approvalStatus === 'approved') expenses += d.data().totalAmount || 0;
        });
        const grossProfit = revenue - cost;
        const netProfit = grossProfit - expenses;
        const margin = revenue ? (netProfit / revenue) * 100 : 0;
        setData({ revenue, cogs: cost, grossProfit, expenses, netProfit, margin });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <ScrollView style={styles.container}>
      <Card><Card.Content><Title>Profit & Loss Statement</Title></Card.Content></Card>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}><Text>Revenue</Text><Text>{formatCurrency(data.revenue)}</Text></View>
          <View style={styles.row}><Text>Cost of Goods Sold</Text><Text style={styles.expense}>{formatCurrency(data.cogs)}</Text></View>
          <Divider style={styles.divider} />
          <View style={styles.row}><Text style={styles.bold}>Gross Profit</Text><Text style={styles.profit}>{formatCurrency(data.grossProfit)}</Text></View>
          <View style={styles.row}><Text>Operating Expenses</Text><Text style={styles.expense}>{formatCurrency(data.expenses)}</Text></View>
          <Divider style={styles.divider} />
          <View style={styles.row}><Text style={styles.bold}>Net Profit</Text><Text style={styles.profit}>{formatCurrency(data.netProfit)}</Text></View>
          <View style={styles.row}><Text>Profit Margin</Text><Text>{data.margin.toFixed(2)}%</Text></View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  card: { marginTop: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  expense: { color: '#f44336' },
  profit: { color: '#4caf50', fontWeight: 'bold' },
  bold: { fontWeight: 'bold' },
  divider: { marginVertical: 8 }
});