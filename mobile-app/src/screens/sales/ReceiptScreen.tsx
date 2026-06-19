import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { Card, Title, Text, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { useParams, useNavigate } from 'react-router-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { db } from '../../services/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { formatCurrency } from '../../utils/formatters';

export const ReceiptScreen = () => {
  const { saleId } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      if (!saleId) return;
      const snap = await getDoc(doc(db, 'sales', saleId));
      if (snap.exists()) setSale({ id: snap.id, ...snap.data() });
      setLoading(false);
    };
    fetchSale();
  }, [saleId]);

  const buildReceiptHTML = () => {
    if (!sale) return '';
    const itemsRows = sale.items.map(
      (item: any) => `
        <tr>
          <td>${item.productName} (${item.quantity})</td>
          <td style="text-align:right">${item.finalUnitPrice.toLocaleString()}</td>
        </tr>`
    ).join('');
    const discountText = sale.discountType === 'percentage'
      ? `${sale.discountValue}% off`
      : `KES ${sale.discountAmount.toLocaleString()}`;

    return `
      <html>
        <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h2>PRIME CUT</h2>
          <p>Receipt #${sale.receiptNumber || sale.id.slice(-8)}</p>
          <p>Date: ${new Date(sale.createdAt?.toDate()).toLocaleString()}</p>
          <p>Customer: ${sale.customerName}</p>
          <hr/>
          <table style="width:100%; text-align:left;">
            ${itemsRows}
          </table>
          <hr/>
          <div style="text-align:left;">
            <p>Subtotal: ${formatCurrency(sale.subtotal)}</p>
            <p style="color:red;">Discount: ${discountText}</p>
            <p><strong>Total: ${formatCurrency(sale.finalAmount)}</strong></p>
            <p>Payment: ${sale.paymentMethod}</p>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: buildReceiptHTML() });
      await Print.printAsync({ uri });
    } catch (error) {
      Alert.alert('Print Error', 'Could not print receipt.');
    }
  };

  const handleShareWhatsApp = async () => {
    const discountText = sale.discountType === 'percentage'
      ? `${sale.discountValue}% off`
      : `KES ${sale.discountAmount.toLocaleString()}`;
    const text = `*PRIME CUT - Receipt #${sale.receiptNumber || sale.id.slice(-8)}*\n` +
      `Date: ${new Date(sale.createdAt?.toDate()).toLocaleString()}\n` +
      `Customer: ${sale.customerName}\n` +
      `Items:\n${sale.items.map((i: any) => `- ${i.productName} (${i.quantity}) - ${formatCurrency(i.finalUnitPrice)}`).join('\n')}\n` +
      `Subtotal: ${formatCurrency(sale.subtotal)}\n` +
      `Discount: ${discountText}\n` +
      `*Total: ${formatCurrency(sale.finalAmount)}*\n` +
      `Payment: ${sale.paymentMethod}`;

    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share.');
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;
  if (!sale) return <Text>Receipt not found</Text>;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={{ alignItems: 'center' }}>
          <Text style={styles.company}>PRIME CUT</Text>
          <Text style={styles.receiptNo}>Receipt #{sale.receiptNumber || sale.id.slice(-8)}</Text>
          <Text>Date: {new Date(sale.createdAt?.toDate()).toLocaleString()}</Text>
          <Text>Customer: {sale.customerName}</Text>
          <Divider style={styles.divider} />
          {sale.items.map((item: any, idx: number) => (
            <View key={idx} style={styles.row}>
              <Text>{item.productName} ({item.quantity})</Text>
              <Text>{formatCurrency(item.finalUnitPrice)}</Text>
            </View>
          ))}
          <Divider style={styles.divider} />
          <View style={styles.row}><Text>Subtotal</Text><Text>{formatCurrency(sale.subtotal)}</Text></View>
          <View style={styles.row}>
            <Text style={{ color: 'red' }}>Discount</Text>
            <Text style={{ color: 'red' }}>{sale.discountType === 'percentage' ? `${sale.discountValue}%` : formatCurrency(sale.discountAmount)}</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}><Text style={{ fontWeight: 'bold' }}>Total</Text><Text style={{ fontWeight: 'bold', color: '#1976d2' }}>{formatCurrency(sale.finalAmount)}</Text></View>
          <Text style={{ marginTop: 12 }}>Payment: {sale.paymentMethod}</Text>
        </Card.Content>
      </Card>
      <View style={styles.actions}>
        <Button mode="contained" onPress={handlePrint} icon="printer">Print Receipt</Button>
        <Button mode="contained" onPress={handleShareWhatsApp} icon="whatsapp" buttonColor="#25D366">Share via WhatsApp</Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
  card: { borderRadius: 12 },
  company: { fontSize: 18, fontWeight: 'bold', color: '#0D47A1' },
  receiptNo: { color: '#757575', fontSize: 12, marginBottom: 8 },
  divider: { marginVertical: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  actions: { marginTop: 16, gap: 8 },
});
