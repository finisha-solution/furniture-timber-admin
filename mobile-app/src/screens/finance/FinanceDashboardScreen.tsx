import React from 'react'; 
import { View, StyleSheet, ScrollView } from 'react-native'; 
import { Card, Title, Text, Button } from 'react-native-paper'; 
import { useNavigate } from 'react-router-native'; 

export const FinanceDashboardScreen = () => { 
    const navigate = useNavigate(); 
    return ( 
    <ScrollView style={styles.container}>
        <Card>
            <Card.Content>
                <Title>Profit & Loss</Title>
                <Text>Revenue: KES 450k</Text>
                <Text>Net Profit: KES 130k</Text>
            </Card.Content>
        </Card>
        <Button mode="contained" onPress={()=>navigate('/finance/expenditure')}>Add Expense</Button>
    </ScrollView> 
    ); 
}; 
const styles = StyleSheet.create({ 
    container: { 
        flex:1, 
        padding:16 
    } 
});