import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Title, Text, ActivityIndicator, Divider } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../../services/firebase/config';
import { formatCurrency } from '../../utils/formatters';

interface PLRow {
  id: string;
  label: string;
  value: number;
  isBold?: boolean;
  isProfit?: boolean;
  isDivider?: boolean;
}

export const ProfitLossScreen = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<PLRow[]>([]);
  const [margin, setMargin] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const salesSnap = await getDocs(collection(db, 'sales'));
        let revenue = 0;
        let cost = 0;

        salesSnap.forEach((doc) => {
          const d = doc.data();
          revenue += d.finalAmount || 0;
          // If profit is stored we can derive cost: cost = revenue - profit
          if (typeof d.profit === 'number') {
            cost += (d.finalAmount || 0) - d.profit;
          } else {
            // Fallback: assume 35% cost if profit not stored
            cost += (d.finalAmount || 0) * 0.35;
          }
        });

        const expensesSnap = await getDocs(collection(db, 'expenditures'));
        let expenses = 0;
        expensesSnap.forEach((doc) => {
          const d = doc.data();
          if (d.approvalStatus === 'approved') {
            expenses += d.totalAmount || 0;
          }
        });

        const grossProfit = revenue - cost;
        const netProfit = grossProfit - expenses;
        const computedMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

        setRows([
          { id: 'revenue', label: 'Revenue', value: revenue },
          { id: 'cogs', label: 'Cost of Goods Sold', value: -cost },
          {
            id: 'gross',
            label: 'Gross Profit',
            value: grossProfit,
            isBold: true,
            isProfit: true,
          },
          { id: 'divider', label: '', value: 0, isDivider: true },
          { id: 'expenses', label: 'Operating Expenses', value: -expenses },
          {
            id: 'net',
            label: 'Net Profit',
            value: netProfit,
            isBold: true,
            isProfit: true,
          },
        ]);
        setMargin(computedMargin);
      } catch (err) {
        console.error('P&L load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <Title style={styles.title}>Profit & Loss Statement</Title>
      <Text style={styles.subtitle}>Snapshot of all recorded sales and expenses</Text>
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      <Text style={styles.marginLabel}>Profit Margin</Text>
      <Text style={styles.marginValue}>{margin.toFixed(2)}%</Text>
    </View>
  );

  return (
    <FlatList
      data={rows}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        if (item.isDivider) {
          return <Divider style={styles.divider} />;
        }

        const isNegative = item.value < 0;
        const valueColor = item.isProfit
          ? item.value >= 0
            ? '#4caf50'
            : '#f44336'
          : isNegative
          ? '#f44336'
          : '#212121';

        return (
          <View style={styles.row}>
            <Text style={[styles.label, item.isBold && styles.bold]}>
              {item.label}
            </Text>
            <Text
              style={[
                styles.value,
                item.isBold && styles.bold,
                { color: valueColor },
              ]}
            >
              {formatCurrency(Math.abs(item.value))}
              {isNegative ? '' : ''}
            </Text>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, backgroundColor: '#f5f5f5', flexGrow: 1 },
  header: { marginBottom: 20 },
  title: { marginBottom: 4 },
  subtitle: { color: '#666', fontSize: 13 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: { fontSize: 15, color: '#333' },
  value: { fontSize: 15, color: '#212121' },
  bold: { fontWeight: 'bold', fontSize: 16 },
  divider: { marginVertical: 8, backgroundColor: '#ccc' },
  footer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  marginLabel: { color: '#666', fontSize: 13 },
  marginValue: { fontSize: 24, fontWeight: 'bold', color: '#1976d2', marginTop: 4 },
});