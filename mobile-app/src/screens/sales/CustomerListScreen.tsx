import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Text, Button, Searchbar, IconButton, ActivityIndicator } from 'react-native-paper';
import { db } from '../../services/firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-native';

export const CustomerListScreen = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const snap = await getDocs(collection(db, 'customers'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCustomers(data);
      setFiltered(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(customers);
    } else {
      const lower = search.toLowerCase();
      setFiltered(customers.filter(c => c.name?.toLowerCase().includes(lower) || c.phone?.includes(lower)));
    }
  }, [search, customers]);

  const deleteCustomer = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteDoc(doc(db, 'customers', id)); fetchCustomers(); } }
    ]);
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={styles.container}>
      <Searchbar placeholder="Search customers" value={search} onChangeText={setSearch} style={styles.search} />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.name}</Title>
              <Text>{item.phone}</Text>
              <Text>{item.email}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigate('/sales', { state: { customer: item } })}>Select</Button>
              <IconButton icon="delete" onPress={() => deleteCustomer(item.id)} />
            </Card.Actions>
          </Card>
        )}
      />
      <Button mode="contained" onPress={() => navigate('/sales/customer/new')} style={styles.addBtn}>Add Customer</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  search: { marginBottom: 12 },
  card: { marginBottom: 8 },
  addBtn: { marginTop: 16, marginBottom: 32 }
});
