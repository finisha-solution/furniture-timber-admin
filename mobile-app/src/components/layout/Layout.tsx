import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Outlet, useNavigate, useLocation } from 'react-router-native';
import { Text } from 'react-native-paper';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

export const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const items = [
       { path: '/', label: 'Home', icon: 'home' },
       { path: '/sales', label: 'Sales', icon: 'cart' },
       { path: '/inventory', label: 'Stock', icon: 'package' },
       { path: '/production', label: 'Prod', icon: 'hammer' },
       { path: '/finance', label: 'Finance', icon: 'cash' },
       { path: '/reports', label: 'Reports', icon: 'chart-bar' },
   ];
    return (
    <View style={{ flex:1 }}>
        <View style={{ flex:1 }}>
            <Outlet />
        </View>
        <View style={styles.bottomNav}>{items.map(item => (
            <TouchableOpacity key={item.path} style={styles.navItem} onPress={() => navigate(item.path)}>
                <MaterialDesignIcons
                name={item.icon}
                size={24}
                color={location.pathname===item.path?'#1976d2':'#757575'}
                />
                <Text style={[styles.label, location.pathname===item.path&&styles.activeLabel]}>
                    {item.label}
                </Text>
                </TouchableOpacity>
                ))}
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection:'row',
        backgroundColor:'white',
        borderTopWidth:1,
        borderTopColor:'#e0e0e0',
        paddingVertical:8
    },

    navItem: {
        flex:1,
        alignItems:'center'
    },

    label: {
        fontSize:12,
        marginTop:4,
        color:'#757575'
    },
    activeLabel: {
        color:'#1976d2',
        fontWeight:'500'
    }
});