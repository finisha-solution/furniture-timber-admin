import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigate } from 'react-router-native';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { db } from '../../services/firebase/config';
import { addToCart } from '../../store/slices/cartSlice';

export const SalesScreen = () => {
  const [customer, setCustomer] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('name'));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        console.error('Product load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFiltered(products);
    } else {
      const lower = searchQuery.toLowerCase();
      setFiltered(
        products.filter(
          (p) =>
            p.name?.toLowerCase().includes(lower) ||
            p.sku?.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchQuery, products]);

  const addItem = (product: any) => {
    dispatch(
      addToCart({
        productId: product.id,
        productName: product.name,
        sku: product.sku || '',
        quantity: 1,
        unitPrice: product.sellingPrice || 0,
        discountAmount: 0,
        finalUnitPrice: product.sellingPrice || 0,
        totalPrice: product.sellingPrice || 0,
        costPrice: product.costPrice || 0,
      })
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const header = (
    <View style={styles.card}>
      <Text style={styles.title}>New Sale</Text>
      <Text style={styles.label}>Customer Name</Text>
      <TextInput
        value={customer}
        onChangeText={setCustomer}
        style={styles.input}
        placeholder="Walk-in"
      />
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.input}
        placeholder="Search by name or SKU"
        autoCapitalize="none"
      />
    </View>
  );

  const footer = cartItems.length > 0 ? (
    <TouchableOpacity style={styles.cartBtn} onPress={() => navigate('/sales/cart')}>
      <Text style={styles.cartBtnText}>View Cart ({cartItems.length})</Text>
    </TouchableOpacity>
  ) : null;

  return (
    <FlatList
      style={styles.container}
      data={filtered}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      ListEmptyComponent={<Text style={styles.emptyText}>No products found</Text>}
      renderItem={({ item }) => (
        <View style={styles.productRow}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productMeta}>
              KES {item.sellingPrice?.toLocaleString() || 0} | Stock: {item.stockQty ?? 0}
            </Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => addItem(item)}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
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
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  label: { fontSize: 13, color: '#555', marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 6,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '600', color: '#212121' },
  productMeta: { fontSize: 12, color: '#666', marginTop: 2 },
  addBtn: { backgroundColor: '#1976d2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  cartBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  cartBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#888' },
});