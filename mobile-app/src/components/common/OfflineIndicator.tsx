import React from 'react'; 
import { View, Text, StyleSheet } from 'react-native'; 
import { useNetwork } from '../../hooks/useNetwork'; 
export const OfflineIndicator = () => { 
    const { isConnected, queueLength } = useNetwork(); 
    if (isConnected && queueLength === 0) 
        return null; 
    return <View style={styles.banner}>
        <Text style={styles.text}>Offline Mode - {queueLength} pending items</Text>            
    </View>; 
}; 

const styles = StyleSheet.create({ 
    banner: { 
        backgroundColor: '#ff9800', 
        padding: 6, 
        alignItems: 'center' 
    }, 
    text: { 
        color: 'white' 
    } 
});