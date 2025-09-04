const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuração para permitir requisições HTTP em desenvolvimento
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;