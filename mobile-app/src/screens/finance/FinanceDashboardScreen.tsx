import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigate } from 'react-router-native';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../../services/firebase/config';
import { formatCurrency } from '../../utils/formatters';

interface Summary {
  revenue: number;
  cogs: number;
  grossProfit: number;
  expenses: number;
  netProfit: number;
  margin: number;
}

export const FinanceDashboardScreen = () => {
  const [summary, setSummary] = useState<Summary>({
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    expenses: 0,
    netProfit: 0,
    margin: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        // Revenue and cost from sales
        const salesSnap = await getDocs(collection(db, 'sales'));
        let revenue = 0;
        let cogs = 0;

        salesSnap.forEach((doc) => {
          const d = doc.data();
          const amount = d.finalAmount || 0;
          revenue += amount;
          // If profit is stored, cogs = amount - profit
          if (typeof d.profit === 'number') {
            cogs += amount - d.profit;
          } else {
            // Fallback: assume 35% cost if not stored
            cogs += amount * 0.35;
          }
        });

        // Expenses — only count approved
        const expensesSnap = await getDocs(collection(db, 'expenditures'));
        let expenses = 0;
        expensesSnap.forEach((doc) => {
          const d = doc.data();
          if (d.approvalStatus === 'approved') {
            expenses += d.totalAmount || 0;
          }
        });

        const grossProfit = revenue - cogs;
        const netProfit = grossProfit - expenses;
        const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

        setSummary({ revenue, cogs, grossProfit, expenses, netProfit, margin });
      } catch (err: any) {
        console.error('Finance load error:', err);
        setError('Failed to load financial data.');
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

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profit & Loss</Text>
        <Text style={styles.cardSubtitle}>All-time summary</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Revenue</Text>
          <Text style={styles.rowValue}>{formatCurrency(summary.revenue)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Cost of Goods Sold</Text>
          <Text style={[styles.rowValue, styles.negative]}>
            -{formatCurrency(summary.cogs)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={[styles.rowLabel, styles.bold]}>Gross Profit</Text>
          <Text style={[styles.rowValue, styles.bold, styles.positive]}>
            {formatCurrency(summary.grossProfit)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Operating Expenses</Text>
          <Text style={[styles.rowValue, styles.negative]}>
            -{formatCurrency(summary.expenses)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={[styles.rowLabel, styles.bold]}>Net Profit</Text>
          <Text
            style={[
              styles.rowValue,
              styles.bold,
              summary.netProfit >= 0 ? styles.positive : styles.negative,
            ]}
          >
            {formatCurrency(summary.netProfit)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Profit Margin</Text>
          <Text style={styles.rowValue}>{summary.margin.toFixed(2)}%</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigate('/finance/expenditure')}
      >
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#212121' },
  cardSubtitle: { fontSize: 12, color: '#757575', marginTop: 2, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { fontSize: 14, color: '#555' },
  rowValue: { fontSize: 14, color: '#212121' },
  bold: { fontWeight: 'bold', fontSize: 15 },
  positive: { color: '#4caf50' },
  negative: { color: '#f44336' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  button: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  error: { color: '#c62828', fontSize: 14 },
});