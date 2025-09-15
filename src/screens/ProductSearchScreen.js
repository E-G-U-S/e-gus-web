import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui';
import SearchBar from '../components/ui/SearchBar';
import ProductCard from '../components/ui/ProductCard';
import { mockCategories, mockSearchProducts } from '../utils/mockData';

const ProductSearchScreen = ({ route, navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(['arroz', 'leite', 'café']);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const initializeScreen = async () => {
      setLoading(true);
      try {
        // Mock data for categories
        setCategories(mockCategories);

        // Uncomment for database use
        // const fetchedCategories = await databaseService.getCategories();
        // setCategories([
        //   { id: 'all', name: 'Todos', icon: 'cube', color: 'bg-gray-100', count: 0 },
        //   ...fetchedCategories,
        // ]);

        const initialQuery = route.params?.query?.trim() || '';
        const initialCategoryId = route.params?.categoryId
          ? String(route.params.categoryId)
          : 'all';

        setSearchQuery(initialQuery);
        setActiveFilter(initialCategoryId);

        // Perform initial search
        await handleSearch(initialQuery, initialCategoryId);
      } catch (error) {
        console.error('Erro ao carregar categorias ou dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeScreen();
  }, [route.params?.query, route.params?.categoryId]);

  const escapeLikeQuery = (query) => {
    return query.replace(/%/g, '\\%').replace(/_/g, '\\_');
  };

  const handleSearch = async (query, filter) => {
    setLoading(true);

    try {
      const trimmedQuery = query.trim().toLowerCase();
      const escapedQuery = escapeLikeQuery(trimmedQuery);
      console.log('Buscando com:', { query: escapedQuery, categoryId: filter });

      // Mock data search
      let results = mockSearchProducts(escapedQuery, filter);

      // Uncomment for database use
      // let categoryIdToSearch = null;
      // if (filter !== 'all') {
      //   categoryIdToSearch = Number(filter);
      // }
      // let results = await databaseService.searchProducts(escapedQuery, categoryIdToSearch);

      // Validate results
      if (!Array.isArray(results)) {
        console.warn('Resultados inválidos, definindo como vazio.');
        results = [];
      }

      // Sort results
      let sortedResults = [...results];
      if (sortBy === 'price_asc') {
        sortedResults.sort((a, b) => {
          const priceA = a.stores?.length > 0 ? (a.stores[0].promotionPrice ?? a.stores[0].price) : Infinity;
          const priceB = b.stores?.length > 0 ? (b.stores[0].promotionPrice ?? b.stores[0].price) : Infinity;
          return priceA - priceB;
        });
      } else if (sortBy === 'price_desc') {
        sortedResults.sort((a, b) => {
          const priceA = a.stores?.length > 0 ? (a.stores[0].promotionPrice ?? a.stores[0].price) : 0;
          const priceB = b.stores?.length > 0 ? (b.stores[0].promotionPrice ?? b.stores[0].price) : 0;
          return priceB - priceA;
        });
      }

      setSearchResults(sortedResults);

      if (trimmedQuery && !recentSearches.includes(trimmedQuery)) {
        setRecentSearches((prev) => [trimmedQuery, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    handleSearch(searchQuery, filterId);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setShowFilters(false);

    if (sort === 'relevance') {
      handleSearch(searchQuery, activeFilter);
      return;
    }

    let resultsToReorder = [...searchResults];
    if (sort === 'price_asc') {
      resultsToReorder.sort((a, b) => {
        const priceA = a.stores?.length > 0 ? (a.stores[0].promotionPrice ?? a.stores[0].price) : Infinity;
        const priceB = b.stores?.length > 0 ? (b.stores[0].promotionPrice ?? b.stores[0].price) : Infinity;
        return priceA - priceB;
      });
    } else if (sort === 'price_desc') {
      resultsToReorder.sort((a, b) => {
        const priceA = a.stores?.length > 0 ? (a.stores[0].promotionPrice ?? a.stores[0].price) : 0;
        const priceB = b.stores?.length > 0 ? (b.stores[0].promotionPrice ?? b.stores[0].price) : 0;
        return priceB - priceA;
      });
    }
    setSearchResults(resultsToReorder);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductComparison', { product });
  };

  const renderProductItem = ({ item }) => (
    <ProductCard item={item} onPress={handleProductPress} />
  );

  const renderRecentSearchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      onPress={() => {
        setSearchQuery(item);
        handleSearch(item, activeFilter);
      }}
    >
      <Ionicons name="time-outline" size={16} color="#999" />
      <Text style={styles.recentSearchText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderFilterItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.filterItem, activeFilter === item.id && styles.activeFilterItem]}
      onPress={() => handleFilterChange(item.id)}
    >
      <Text style={[styles.filterText, activeFilter === item.id && styles.activeFilterText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const getPlaceholderText = () => {
    if (searchQuery) {
      return '';
    }
    const currentCategory = categories.find((cat) => cat.id === activeFilter);
    return `Buscar em ${currentCategory?.name || 'Todos'}...`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={(query) => handleSearch(query, activeFilter)}
            placeholder={getPlaceholderText()}
            autoFocus={!route.params?.query && !route.params?.categoryId}
            style={styles.searchBar}
          />

          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
            <Ionicons name="options-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={categories}
          renderItem={renderFilterItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {showFilters && (
        <View style={styles.sortContainer}>
          <Text style={styles.sortTitle}>Ordenar por:</Text>
          <TouchableOpacity
            style={[styles.sortItem, sortBy === 'relevance' && styles.activeSortItem]}
            onPress={() => handleSortChange('relevance')}
          >
            <Text style={[styles.sortText, sortBy === 'relevance' && styles.activeSortText]}>
              Relevância
            </Text>
            {sortBy === 'relevance' && <Ionicons name="checkmark" size={18} color="#2d5d3d" />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortItem, sortBy === 'price_asc' && styles.activeSortItem]}
            onPress={() => handleSortChange('price_asc')}
          >
            <Text style={[styles.sortText, sortBy === 'price_asc' && styles.activeSortText]}>
              Menor preço
            </Text>
            {sortBy === 'price_asc' && <Ionicons name="checkmark" size={18} color="#2d5d3d" />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortItem, sortBy === 'price_desc' && styles.activeSortItem]}
            onPress={() => handleSortChange('price_desc')}
          >
            <Text style={[styles.sortText, sortBy === 'price_desc' && styles.activeSortText]}>
              Maior preço
            </Text>
            {sortBy === 'price_desc' && <Ionicons name="checkmark" size={18} color="#2d5d3d" />}
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2d5d3d" />
          <Text style={styles.loadingText}>Buscando produtos...</Text>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>{searchResults.length} produtos encontrados</Text>
            </View>
          }
        />
      ) : searchQuery || activeFilter !== 'all' ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          <Text style={styles.emptySubtext}>Tente buscar com outras palavras ou filtros</Text>
        </View>
      ) : (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Buscas recentes</Text>
          <FlatList
            data={recentSearches}
            renderItem={renderRecentSearchItem}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.recentSearchesList}
          />
          {recentSearches.length > 0 && (
            <Button
              variant="ghost"
              onPress={() => setRecentSearches([])}
              style={styles.clearRecentButton}
              textStyle={styles.clearRecentText}
            >
              Limpar buscas recentes
            </Button>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backButton: {
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
  },
  filterButton: {
    marginLeft: 12,
    padding: 4,
  },
  filtersList: {
    paddingHorizontal: 16,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  activeFilterItem: {
    backgroundColor: '#e8f2ed',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#2d5d3d',
    fontWeight: '500',
  },
  sortContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sortItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activeSortItem: {
    borderBottomColor: '#e8f2ed',
  },
  sortText: {
    fontSize: 16,
    color: '#333',
  },
  activeSortText: {
    color: '#2d5d3d',
    fontWeight: '500',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
  },
  productsList: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  recentSearchesContainer: {
    flex: 1,
    padding: 16,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  recentSearchesList: {
    flexGrow: 1,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentSearchText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  clearRecentButton: {
    alignSelf: 'center',
    marginTop: 16,
  },
  clearRecentText: {
    fontSize: 14,
    color: '#2d5d3d',
    fontWeight: '500',
  },
});

export default ProductSearchScreen;
