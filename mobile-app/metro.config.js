const { getDefaultConfig } = require('expo/metro-config'); 
const config = getDefaultConfig(__dirname); 
config.resolver.extraNodeModules = { ...config.resolver.extraNodeModules, 
    'react-router-native': require.resolve('react-router-native') 
}; 
module.exports = config;