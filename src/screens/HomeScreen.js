import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/ui/SearchBar';
import ProductCard from '../components/ui/ProductCard';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, Extrapolate, interpolateColor } from 'react-native-reanimated';
import { mockFeaturedProducts, mockBeverageHighlights, mockNearbyStores, mockCategories, mockLocation } from '../utils/mockData';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.4;

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [beverageHighlights, setBeverageHighlights] = useState([]);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLocationText, setCurrentLocationText] = useState('Carregando...');
  const [locationError, setLocationError] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animação
  const scrollY = useSharedValue(0);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 50], [1, 0], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [0, 50], [0, -30], Extrapolate.CLAMP);
    return { opacity, transform: [{ translateY }] };
  });

  const locationAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [50, 100], [1, 0], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [50, 100], [0, -20], Extrapolate.CLAMP);
    return { opacity, transform: [{ translateY }] };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(scrollY.value, [0, 150], [150, 80], Extrapolate.CLAMP);
    const backgroundColor = interpolateColor(scrollY.value, [0, 150], ['#fff', 'rgba(255, 255, 255, 0.8)']);
    const borderBottomWidth = interpolate(scrollY.value, [0, 150], [1, 1], Extrapolate.CLAMP);
    const borderBottomColor = interpolateColor(scrollY.value, [0, 150], ['#eee', 'rgba(0, 0, 0, 0.1)']);
    return { height, backgroundColor, borderBottomWidth, borderBottomColor };
  });

  const searchBarAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 150], [0, -45], Extrapolate.CLAMP);
    return { transform: [{ translateY }] };
  });

  const loadData = () => {
    setLoading(true);
    setFeaturedProducts(mockFeaturedProducts);
    setBeverageHighlights(mockBeverageHighlights);
    setNearbyStores(mockNearbyStores);
    setCategories(mockCategories);
    setCurrentLocationText(mockLocation.address);
    setUserCoords(mockLocation.coords);
    setLocationError(null);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      navigation.navigate('Search', { query, categoryId: 'all' });
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductComparison', { product });
  };

  const handleStorePress = (store) => {
    navigation.navigate('Map', { selectedStore: store, userLocation: userCoords });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('Search', { categoryId: category.id, query: '' });
  };

  const handleSeeAllPress = () => {
    navigation.navigate('Search', { query: '', categoryId: 'all' });
  };

  const renderFeaturedProductItem = ({ item }) => (
    <ProductCard item={item} onPress={handleProductPress} horizontal={true} />
  );

  const renderNearbyStoreItem = ({ item }) => (
    <TouchableOpacity style={styles.storeCard} onPress={() => handleStorePress(item)}>
      <View style={styles.storeImageContainer}>
        <Image source={{ uri: item.image_url }} style={styles.storeImage} />
      </View>
      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{item.name}</Text>
        <View style={styles.storeDetails}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.storeAddress} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
      </View>
      <View style={styles.storeDistanceContainer}>
        <Ionicons name="navigate-outline" size={14} color="#666" />
        <Text style={styles.distanceText}>{item.distance}km</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress(item)}>
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.icon} size={24} color="#2d5d3d" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2d5d3d" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Animated.View style={[styles.headerTop, logoAnimatedStyle]}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.searchBarContainer, searchBarAnimatedStyle]}>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Buscar produtos..."
          />
        </Animated.View>

        <Animated.View style={[styles.locationContainer, locationAnimatedStyle]}>
          <Ionicons name="location-outline" size={20} color="#2d5d3d" />
          {locationError ? (
            <Text style={styles.locationErrorText}>{locationError}</Text>
          ) : (
            <Text style={styles.locationText}>{currentLocationText}</Text>
          )}
          <Ionicons name="chevron-down" size={16} color="#2d5d3d" />
        </Animated.View>
      </Animated.View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2d5d3d']} />
        }
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {featuredProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ofertas Em destaque</Text>
              <TouchableOpacity onPress={handleSeeAllPress}>
                <Text style={styles.seeAllText}>Ver mais</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredProducts}
              renderItem={renderFeaturedProductItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredProductsList}
              snapToInterval={cardWidth + 16}
              decelerationRate="fast"
            />
          </View>
        )}

        {beverageHighlights.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bebidas em Ofertas</Text>
              <TouchableOpacity
                onPress={() => {
                  const bebidaCat = mockCategories.find((cat) => cat.name.toLowerCase() === 'bebidas');
                  if (bebidaCat?.id) {
                    navigation.navigate('Search', { categoryId: bebidaCat.id, query: '' });
                  } else {
                    console.warn('Categoria "bebidas" não encontrada.');
                  }
                }}
              >
                <Text style={styles.seeAllText}>Ver mais</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={beverageHighlights}
              renderItem={renderFeaturedProductItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredProductsList}
              snapToInterval={cardWidth + 16}
              decelerationRate="fast"
            />
          </View>
        )}

        {nearbyStores.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mercados Próximos</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Map', { userLocation: userCoords })}>
                <Text style={styles.seeAllText}>Ver mapa</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={nearbyStores}
              renderItem={renderNearbyStoreItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storesList}
            />
          </View>
        )}

        {categories.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categorias</Text>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              numColumns={4}
              scrollEnabled={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/600x200?text=Economize+nas+compras' }}
              style={styles.banner}
              resizeMode="cover"
            />
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Economize nas compras</Text>
              <Text style={styles.bannerSubtitle}>
                Compare preços e encontre as melhores ofertas
              </Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Saiba mais</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoImage: {
    width: width * 0.7,
    height: 50,
    maxWidth: 350,
    marginBottom: -10,
  },
  searchBarContainer: {
    justifyContent: 'center',
    marginVertical: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 4,
  },
  locationErrorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ff0000',
    marginHorizontal: 4,
  },
  notificationButton: {
    padding: 4,
    minWidth: 40,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2d5d3d',
    fontWeight: '500',
  },
  featuredProductsList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  storesList: {
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 1,
  },
  categoriesList: {
    paddingHorizontal: 8,
  },
  storeCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  storeImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  storeImage: {
    width: 50,
    height: 50,
  },
  storeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  storeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  storeAddress: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  storeDistanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 4,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f2ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  bannerContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 150,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  bannerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#2d5d3d',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default HomeScreen;