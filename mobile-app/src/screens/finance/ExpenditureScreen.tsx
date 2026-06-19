import React, { useState } from 'react'; 
import { View, StyleSheet, ScrollView } from 'react-native'; 
import { TextInput, Button, Card, Title, Picker, } from 'react-native-paper'; 

export const ExpenditureScreen = () => { 
    const [category, setCategory] = useState('electricity'); 
    const [amount, setAmount] = useState(''); 
    return ( 
    <ScrollView style={styles.container}>
        <Card>
            <Card.Content>
                <Title>Record Expense</Title>
                <Picker selectedValue={category} onValueChange={setCategory}>
                    <Picker.Item label="Electricity" value="electricity" />
                    <Picker.Item label="Labour" value="labour" />
                    <Picker.Item label="Security" value="security" />
                </Picker>
                <TextInput label="Amount (KES)" value={amount} onChangeText={setAmount} keyboardType="numeric" mode="outlined" />
                <Button mode="contained">Submit</Button>
            </Card.Content>
        </Card>
    </ScrollView> 
    ); 
}; 

const styles = StyleSheet.create({ 
    container: { flex:1, padding:16 } 
});