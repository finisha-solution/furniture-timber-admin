import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { TextInput, Button, Card, Title, Text, ActivityIndicator, Searchbar, List } from 'react-native-paper';
import { useNavigate } from 'react-router-native';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../services/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { addToCart } from '../../store/slices/cartSlice';

export const SalesScreen = () => {
  const [customer, setCustomer] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('name'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredProducts(products.filter(p => 
        p.name?.toLowerCase().includes(lower) || 
        p.sku?.toLowerCase().includes(lower)
      ));
    }
  }, [searchQuery, products]);

  const addItemToCart = (product: any) => {
    dispatch(addToCart({
      productId: product.id,
      productName: product.name,
      sku: product.sku || '',
      quantity: 1,
      unitPrice: product.sellingPrice || 0,
      discountAmount: 0,
      finalUnitPrice: product.sellingPrice || 0,
      totalPrice: product.sellingPrice || 0,
      costPrice: product.costPrice || 0,
    }));
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <Title>New Sale</Title>
            <TextInput
              label="Customer Name"
              value={customer}
              onChangeText={setCustomer}
              mode="outlined"
              style={styles.input}
            />
            <Searchbar
              placeholder="Search products by name or SKU"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.search}
            />
            {filteredProducts.length === 0 ? (
              <Text style={styles.emptyText}>No products found</Text>
            ) : (
              <FlatList
                data={filteredProducts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <List.Item
                    title={item.name}
                    description={`KES ${item.sellingPrice?.toLocaleString()} | Stock: ${item.stockQty}`}
                    right={() => (
                      <Button mode="contained" onPress={() => addItemToCart(item)}>
                        Add
                      </Button>
                    )}
                  />
                )}
                style={styles.productList}
              />
            )}
            {cartItems.length > 0 && (
              <Button mode="contained" onPress={() => navigate('/sales/cart')} style={styles.cartBtn}>
                View Cart ({cartItems.length})
              </Button>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  card: { marginBottom: 12 },
  input: { marginVertical: 8 },
  search: { marginVertical: 8 },
  productList: { maxHeight: 400 },
  emptyText: { textAlign: 'center', marginTop: 20 },
  cartBtn: { marginTop: 16 },
});