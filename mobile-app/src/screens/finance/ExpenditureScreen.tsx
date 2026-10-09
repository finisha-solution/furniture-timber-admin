import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Title, Menu } from 'react-native-paper';

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

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Record Expense</Title>
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button mode="outlined" onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                {CATEGORIES.find(c => c.value === category)?.label || 'Select Category'}
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

          <TextInput
            label="Amount (KES)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Payee Name"
            value={payee}
            onChangeText={setPayee}
            mode="outlined"
            style={styles.input}
          />
          <Button mode="contained">Submit</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  menuButton: { marginVertical: 8 },
  input: { marginVertical: 8 },
});