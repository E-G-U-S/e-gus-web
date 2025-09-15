import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  placeholder = 'Buscar produtos...',
  autoFocus = false,
  style,
}) => {
  return (
    <View style={[styles.searchContainer, style]}>
      <Ionicons name="search" size={20} color="#2d5d3d" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => onSearch && onSearch(searchQuery)}
        returnKeyType="search"
        autoFocus={autoFocus}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.8)', // Fundo semi-transparente
    borderRadius: 20, // Bordas arredondadas
    paddingHorizontal: 12,
    height: 40,
    shadowColor: '#000', // Sombra para efeito de profundidade
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    height: 40,
  },
  clearButton: {
    padding: 4,
    backgroundColor: '#fff', // Fundo branco para o botão de limpar
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;