import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, FlatList, ActivityIndicator } from 'react-native';
import { useParams, useNavigate } from 'react-router-native';
import * as Print from 'expo-print';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../../services/firebase/config';
import { formatCurrency } from '../../utils/formatters';

export const ReceiptScreen = () => {
  const { saleId } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!saleId) return;
      try {
        const snap = await getDoc(doc(db, 'sales', saleId));
        if (snap.exists()) setSale({ id: snap.id, ...snap.data() });
      } catch (err) {
        console.error('Receipt load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [saleId]);

  const items = sale?.items || [];
  const discountText =
    typeof sale?.discountAmount === 'number'
      ? formatCurrency(sale.discountAmount)
      : formatCurrency(0);

  const buildReceiptHTML = () => {
    if (!sale) return '';
    const itemsRows = items.map(
      (item: any) => `
        <tr>
          <td>${item.productName} (${item.quantity})</td>
          <td style="text-align:right">${formatCurrency(item.finalUnitPrice || 0)}</td>
        </tr>`
    ).join('');

    return `
      <html>
        <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h2>PRIME CUT</h2>
          <p>Receipt #${sale.receiptNumber || sale.id.slice(-8)}</p>
          <p>Date: ${sale.createdAt?.toDate ? sale.createdAt.toDate().toLocaleString() : 'N/A'}</p>
          <p>Customer: ${sale.customerName || 'Walk-in'}</p>
          <hr/>
          <table style="width:100%; text-align:left;">${itemsRows}</table>
          <hr/>
          <div style="text-align:left;">
            <p>Subtotal: ${formatCurrency(sale.subtotal || 0)}</p>
            <p style="color:red;">Discount: -${discountText}</p>
            <p><strong>Total: ${formatCurrency(sale.finalAmount || 0)}</strong></p>
            <p>Payment: ${sale.paymentMethod || 'N/A'}</p>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: buildReceiptHTML() });
      await Print.printAsync({ uri });
    } catch (err) {
      console.error('Print error:', err);
      Alert.alert('Print Error', 'Could not print receipt.');
    }
  };

  const handleShareWhatsApp = async () => {
    if (!sale) return;
    const lines = [
      `*PRIME CUT - Receipt #${sale.receiptNumber || sale.id.slice(-8)}*`,
      `Date: ${sale.createdAt?.toDate ? sale.createdAt.toDate().toLocaleString() : 'N/A'}`,
      `Customer: ${sale.customerName || 'Walk-in'}`,
      'Items:',
      ...items.map((i: any) => `- ${i.productName} (${i.quantity}) - ${formatCurrency(i.finalUnitPrice || 0)}`),
      `Subtotal: ${formatCurrency(sale.subtotal || 0)}`,
      `Discount: -${discountText}`,
      `*Total: ${formatCurrency(sale.finalAmount || 0)}*`,
      `Payment: ${sale.paymentMethod || 'N/A'}`,
    ];
    const text = lines.join('\n');
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) await Linking.openURL(url);
    else Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share.');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!sale) {
    return (
      <View style={styles.center}>
        <Text>Receipt not found</Text>
      </View>
    );
  }

  const header = (
    <View style={styles.card}>
      <Text style={styles.company}>PRIME CUT</Text>
      <Text style={styles.receiptNo}>
        Receipt #{sale.receiptNumber || sale.id.slice(-8)}
      </Text>
      <Text style={styles.meta}>
        Date: {sale.createdAt?.toDate ? sale.createdAt.toDate().toLocaleString() : 'N/A'}
      </Text>
      <Text style={styles.meta}>Customer: {sale.customerName || 'Walk-in'}</Text>
    </View>
  );

  const footer = (
    <>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text>Subtotal</Text>
          <Text>{formatCurrency(sale.subtotal || 0)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ color: 'red' }}>Discount</Text>
          <Text style={{ color: 'red' }}>-{discountText}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(sale.finalAmount || 0)}</Text>
        </View>
        <Text style={styles.meta}>Payment: {sale.paymentMethod || 'N/A'}</Text>
      </View>

      <TouchableOpacity style={styles.actionBtn} onPress={handlePrint}>
        <Text style={styles.actionText}>Print Receipt</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionBtn, styles.whatsappBtn]}
        onPress={handleShareWhatsApp}
      >
        <Text style={styles.actionText}>Share via WhatsApp</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(_, idx) => String(idx)}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      renderItem={({ item }) => (
        <View style={styles.itemRow}>
          <Text style={styles.itemName}>
            {item.productName} ({item.quantity})
          </Text>
          <Text style={styles.itemPrice}>{formatCurrency(item.finalUnitPrice || 0)}</Text>
        </View>
      )}
      contentContainerStyle={styles.content}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  company: { fontSize: 20, fontWeight: 'bold', color: '#0D47A1' },
  receiptNo: { color: '#757575', fontSize: 12, marginTop: 4, marginBottom: 8 },
  meta: { fontSize: 13, color: '#555', marginTop: 4, textAlign: 'center' },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: { fontSize: 14, color: '#212121' },
  itemPrice: { fontSize: 14, color: '#212121', fontWeight: '500' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  totalRow: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#eee' },
  totalLabel: { fontWeight: 'bold', fontSize: 16 },
  totalValue: { fontWeight: 'bold', fontSize: 16, color: '#1976d2' },
  actionBtn: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  whatsappBtn: { backgroundColor: '#25D366' },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});