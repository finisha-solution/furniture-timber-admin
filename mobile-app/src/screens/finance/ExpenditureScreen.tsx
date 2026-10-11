import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Menu, Button } from 'react-native-paper';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-native';
import { useSelector } from 'react-redux';

import { db } from '../../services/firebase/config';

const CATEGORIES = [
  { label: 'Electricity', value: 'electricity' },
  { label: 'Labour', value: 'labour' },
  { label: 'Security', value: 'security' },
  { label: 'Delivery', value: 'delivery' },
  { label: 'Legal Fees', value: 'legal_fees' },
  { label: 'Rent', value: 'rent' },
  { label: 'Water', value: 'water' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Miscellaneous', value: 'miscellaneous' },
];

export const ExpenditureScreen = () => {
  const [category, setCategory] = useState('electricity');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [payee, setPayee] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    if (!payee.trim()) {
      setError('Enter the payee name.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'expenditures'), {
        category,
        description: description.trim() || 'No description',
        totalAmount: parseFloat(amount),
        payeeName: payee.trim(),
        expenseDate: new Date(),
        approvalStatus: user?.role === 'admin' ? 'approved' : 'pending',
        requestedBy: user?.uid || 'unknown',
        createdAt: new Date(),
      });
      alert('Expense recorded.');
      navigate(-1);
    } catch (err) {
      console.error('Expense submit error:', err);
      setError('Failed to save. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Record Expense</Text>

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.menuButton}
              >
                {CATEGORIES.find((c) => c.value === category)?.label || 'Select Category'}
              </Button>
            }
          >
            {CATEGORIES.map((cat) => (
              <Menu.Item
                key={cat.value}
                onPress={() => {
                  setCategory(cat.value);
                  setMenuVisible(false);
                }}
                title={cat.label}
              />
            ))}
          </Menu>

          <Text style={styles.label}>Amount (KES)</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
            placeholder="0"
            editable={!submitting}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            placeholder="Optional"
            editable={!submitting}
          />

          <Text style={styles.label}>Payee Name</Text>
          <TextInput
            value={payee}
            onChangeText={setPayee}
            style={styles.input}
            placeholder="Who received the money?"
            editable={!submitting}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.disabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  label: { fontSize: 13, color: '#555', marginTop: 12, marginBottom: 4 },
  menuButton: { marginVertical: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  error: { color: '#c62828', marginTop: 12 },
  submitBtn: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});