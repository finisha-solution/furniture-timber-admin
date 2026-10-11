import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-native';

export const CartScreen = () => {
  const { items, checkout, subtotal } = useCart();
  const [discount, setDiscount] = useState('');
  const [customer, setCustomer] = useState('Walk-in');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const discountValue = parseFloat(discount) || 0;
  const final = Math.max(subtotal - discountValue, 0);

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Cart is empty</Text>
      </View>
    );
  }

  const handleCheckout = async () => {
    setSubmitting(true);
    try {
      await checkout(customer || 'Walk-in', 'cash', discountValue);
      navigate('/');
    } catch (err) {
      console.error('Checkout failed:', err);
      Alert.alert('Error', 'Could not complete the sale.');
    } finally {
      setSubmitting(false);
    }
  };

  const header = (
    <View style={styles.card}>
      <Text style={styles.label}>Customer Name</Text>
      <TextInput
        value={customer}
        onChangeText={setCustomer}
        style={styles.input}
        placeholder="Walk-in"
      />
    </View>
  );

  const footer = (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text>Subtotal</Text>
        <Text>KES {subtotal.toLocaleString()}</Text>
      </View>

      <Text style={styles.label}>Discount (KES)</Text>
      <TextInput
        value={discount}
        onChangeText={setDiscount}
        keyboardType="numeric"
        style={styles.input}
        placeholder="0"
      />

      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>KES {final.toLocaleString()}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, submitting && styles.disabled]}
        onPress={handleCheckout}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? 'Completing...' : 'Complete Sale'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(item) => item.productId}
      renderItem={({ item }) => (
        <View style={styles.itemRow}>
          <Text style={styles.itemName}>{item.productName}</Text>
          <Text style={styles.itemQty}>x{item.quantity}</Text>
          <Text style={styles.itemPrice}>KES {item.totalPrice.toLocaleString()}</Text>
        </View>
      )}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      contentContainerStyle={styles.content}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  label: { fontSize: 13, color: '#555', marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: { flex: 2, fontSize: 14, color: '#212121' },
  itemQty: { flex: 1, textAlign: 'center', color: '#555' },
  itemPrice: { flex: 1, textAlign: 'right', fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  totalRow: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 },
  totalLabel: { fontWeight: 'bold', fontSize: 16 },
  totalValue: { fontWeight: 'bold', fontSize: 16, color: '#1976d2' },
  button: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  emptyText: { color: '#888' },
});