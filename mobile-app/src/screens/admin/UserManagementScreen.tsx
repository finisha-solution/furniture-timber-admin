import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Title, Text, Button, ActivityIndicator, Chip, TextInput, Dialog, Portal } from 'react-native-paper';
import { db, auth } from '../../services/firebase/config';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const UserManagementScreen = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateRole = async (userId: string, newRole: string) => {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
    fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    Alert.alert('Confirm Delete', 'Delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteDoc(doc(db, 'users', userId)); fetchUsers(); } }
    ]);
  };

  const addUser = async () => {
    if (!newEmail || !newPassword) return Alert.alert('Error', 'Email and password required');
    try {
      const userCred = await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      await updateDoc(doc(db, 'users', userCred.user.uid), {
        email: newEmail,
        name: newEmail.split('@')[0],
        role: 'salesperson',
        createdAt: new Date()
      });
      setDialogVisible(false);
      setNewEmail('');
      setNewPassword('');
      fetchUsers();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => setDialogVisible(true)} style={styles.addBtn}>Add New User</Button>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.name}</Title>
              <Text>{item.email}</Text>
              <Chip style={styles.roleChip}>{item.role}</Chip>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => updateRole(item.id, item.role === 'admin' ? 'salesperson' : 'admin')}>Toggle Role</Button>
              <Button onPress={() => deleteUser(item.id)} textColor="red">Delete</Button>
            </Card.Actions>
          </Card>
        )}
      />
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>New User</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Email" value={newEmail} onChangeText={setNewEmail} mode="outlined" autoCapitalize="none" />
            <TextInput label="Password" value={newPassword} onChangeText={setNewPassword} mode="outlined" secureTextEntry />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={addUser}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addBtn: { marginBottom: 16 },
  card: { marginBottom: 8 },
  roleChip: { alignSelf: 'flex-start', marginTop: 4 }
});