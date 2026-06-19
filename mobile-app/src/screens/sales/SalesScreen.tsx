import React, { useState } from 'react'; 
import { View, StyleSheet, ScrollView } from 'react-native'; 
import { TextInput, Button, Card, Title } from 'react-native-paper'; 
import { useNavigate } from 'react-router-native';
import { useLocation } from 'react-router-native';
import { doc, getDoc } from 'firebase/firestore';

export const SalesScreen = () => { 
    const [customer, setCustomer] = useState(''); 
    const navigate = useNavigate(); 
    return ( 
    <ScrollView style={styles.container}>
        <Card>
            <Card.Content>
                <Title>New Sale</Title>
                <TextInput label="Customer Name" value={customer} onChangeText={setCustomer} mode="outlined" />
                <Button mode="contained" onPress={()=>navigate('/sales/cart')} style={styles.button}>Add Products</Button>
            </Card.Content>
        </Card>
    </ScrollView> ); 
}; 

const styles = StyleSheet.create({ 
    container: { 
        flex:1, padding:16 }, 
    button: { marginTop:16 } 
});