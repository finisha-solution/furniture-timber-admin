import React from 'react'; import { View, ScrollView, StyleSheet } from 'react-native'; import { Card, Title, Text, Button } from 'react-native-paper'; 
import { useNavigate } from 'react-router-native'; 
export const DashboardScreen = () => { 
    const navigate = useNavigate(); 
    return ( 
    <ScrollView style={styles.container}>
        <Card>
            <Card.Content>
                <Title>Today's Sales</Title>
                <Text>KES 45,000</Text>
            </Card.Content>
        </Card>
        <Card>
            <Card.Content>
                <Title>Low Stock</Title>
                <Text>3 items low</Text>
                <Button onPress={()=>navigate('/inventory')}>View</Button>
            </Card.Content>
        </Card>
    </ScrollView> 
    ); 
}; 

const styles = StyleSheet.create({ 
    container: 
    { flex:1, padding:16 } 
});