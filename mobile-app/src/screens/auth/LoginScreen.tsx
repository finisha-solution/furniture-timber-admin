import React, { useState } from 'react'; 
import { View, StyleSheet } from 'react-native'; 
import { TextInput, Button, Title } from 'react-native-paper'; 
import { useNavigate } from 'react-router-native'; 
import { useDispatch } from 'react-redux'; 
import { setUser } from '../../store/slices/authSlice'; 

export const LoginScreen = () => { 
    const [email, setEmail] = useState('admin@tbms-project.com'); 
    const [password, setPassword] = useState('password'); 
    const navigate = useNavigate(); 
    const dispatch = useDispatch(); 
    const handleLogin = () => { 
        dispatch(setUser({ uid: 'admin', name: 'Admin', role: 'admin' })); 
        navigate('/'); }; 
        return ( 
        <View style={styles.container}>
            <Title>Prime Cut</Title>
            <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} />
            <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input} />
            <Button mode="contained" onPress={handleLogin}>Sign In</Button>
        </View> 
        ); 
    }; 
    
    const styles = StyleSheet.create({ 
        container: 
        { 
            flex:1, 
            justifyContent:'center', 
            padding:20 
        }, 
            input: { marginVertical:8 } 
    });