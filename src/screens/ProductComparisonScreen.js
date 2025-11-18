import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { productService } from "../services/api";


const { width } = Dimensions.get("window");

const ProductComparisonScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("prices");
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  const [sortBy, setSortBy] = useState("price");

  useEffect(() => {
    loadProductDetails();
  }, []);

  const loadProductDetails = async () => {
    try {
      setLoading(true);

      const baseRes = await productService.getById(Number(product.id));
      if (!baseRes?.success || !baseRes.data) {
        throw new Error(baseRes?.error || "Falha ao buscar produto base");
      }
      const base = baseRes.data;

      const pricesRes = await productService.getPricesByProduct(Number(product.id));
      const storesPrices = (pricesRes?.success ? pricesRes.data : []).map((pm) => {
        const price = typeof pm.precoFinal === 'number' ? pm.precoFinal : (typeof pm.precoBase === 'number' ? pm.precoBase : null);
        const promo = typeof pm.precoPromocional === 'number' ? pm.precoPromocional : null;
        const isPromotion = promo != null && price != null && promo < price;
        return {
          id: pm.produtoMercadoId ?? `NA-${pm.id ?? Math.random()}`,
          name: pm.mercadoNome ?? 'Mercado não informado',
          isOpen: true,
          address: null,
          distance: null,
          updatedAt: "",
          price: price ?? 0,
          promotionPrice: promo,
          isPromotion,
        };
      });

      const computeBest = () => {
        if (!storesPrices.length) return { bestPrice: null, bestPriceStore: "N/A" };
        let best = { price: Infinity, storeName: "N/A" };
        for (const s of storesPrices) {
          const p = s.promotionPrice ?? s.price;
          if (typeof p === 'number' && p < best.price) {
            best = { price: p, storeName: s.name };
          }
        }
        return { bestPrice: best.price === Infinity ? null : best.price, bestPriceStore: best.storeName };
      };
      const { bestPrice, bestPriceStore } = computeBest();

      const details = {
        id: base.id,
        name: base.nome || "Produto Sem Nome",
        brand: base.categoria ? `Categoria: ${base.categoria}` : "Categoria não informada",
        image: base.imagemUrl || "https://via.placeholder.com/150",
        description: "Sem descrição disponível",
        bestPrice,
        bestPriceStore,
        storesPrices,
        priceHistory: {
          week: [],
          month: [],
          year: [],
        },
        details: [
          { label: "Categoria", value: base.categoria || "N/A" },
          { label: "Código de Barras", value: base.codigoBarras || "N/A" },
          { label: "Restrição de Idade", value: base.maiorIdade ? "18+" : "Livre" },
        ],
      };

      setProductDetails(details);
      setSortBy("price");
      setTimeout(() => sortStores(), 0);
    } catch (error) {
      console.error("Erro ao carregar detalhes do produto:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes do produto.");
      setProductDetails({
        id: product.id,
        name: product.nome || product.name || "Produto Sem Nome",
        brand: product.categoria ? `Categoria: ${product.categoria}` : "Categoria não informada",
        image: product.imagemUrl || product.image || "https://via.placeholder.com/150",
        description: "Sem descrição disponível",
        bestPrice: null,
        bestPriceStore: "N/A",
        storesPrices: [],
        priceHistory: { week: [], month: [], year: [] },
        details: [
          { label: "Categoria", value: product.categoria || "N/A" },
          { label: "Código de Barras", value: product.codigoBarras || "N/A" },
          { label: "Restrição de Idade", value: product.maiorIdade ? "18+" : "Livre" },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPriceHistoryChart = () => {
    if (!productDetails?.priceHistory) return null;

    const chartData = {
      week: {
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        datasets: [{ data: productDetails.priceHistory.week, color: (opacity = 1) => `rgba(45, 93, 61, ${opacity})`, strokeWidth: 2 }],
      },
      month: {
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
        datasets: [{ data: productDetails.priceHistory.month, color: (opacity = 1) => `rgba(45, 93, 61, ${opacity})`, strokeWidth: 2 }],
      },
      year: {
        labels: ["Jan", "Mar", "Mai", "Jul", "Set", "Nov"],
        datasets: [{ data: productDetails.priceHistory.year, color: (opacity = 1) => `rgba(45, 93, 61, ${opacity})`, strokeWidth: 2 }],
      },
    };

    return (
      <View style={styles.chartContainer}>
        <View style={styles.timeRangeSelector}>
          {["week", "month", "year"].map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.timeRangeButton, selectedTimeRange === range && styles.selectedTimeRange]}
              onPress={() => setSelectedTimeRange(range)}
            >
              <Text style={[styles.timeRangeText, selectedTimeRange === range && styles.selectedTimeRangeText]}>
                {range === "week" ? "Semana" : range === "month" ? "Mês" : "Ano"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.chartWrapper}>
          <LineChart
            data={chartData[selectedTimeRange]}
            width={width - 48}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: "6", strokeWidth: "2", stroke: "#2d5d3d" },
            }}
            bezier
            style={styles.chart}
          />
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#2d5d3d" }]} />
            <Text style={styles.legendText}>Preço médio</Text>
          </View>
        </View>
      </View>
    );
  };

  const sortStores = () => {
    if (!productDetails?.storesPrices) return;

    const sortedStores = [...productDetails.storesPrices].sort((a, b) => {
      if (sortBy === "price") {
        const priceA = a.promotionPrice ?? a.price ?? Infinity;
        const priceB = b.promotionPrice ?? b.price ?? Infinity;
        return priceA - priceB;
      } else if (sortBy === "distance") {
        const distanceA = typeof a.distance === 'number' ? a.distance : typeof a.distance === 'string' ? parseFloat(a.distance) || Infinity : Infinity;
        const distanceB = typeof b.distance === 'number' ? b.distance : typeof b.distance === 'string' ? parseFloat(b.distance) || Infinity : Infinity;
        return distanceA - distanceB;
      } else if (sortBy === "rating") {
        return (b.rating ?? 0) - (a.rating ?? 0);
      }
      return 0;
    });

    setProductDetails({ ...productDetails, storesPrices: sortedStores });
  };

  const handleSortPress = () => {
    const sortOptions = [
      { label: "Menor Preço", value: "price" },
      { label: "Distância", value: "distance" },
    ];
    Alert.alert(
      "Ordenar por",
      "",
      [
        ...sortOptions.map((option) => ({
          text: option.label,
          onPress: () => {
            setSortBy(option.value);
            setTimeout(() => sortStores(), 0);
          },
        })),
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  if (loading || !productDetails) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d5d3d" />
        <Text style={styles.loadingText}>Carregando detalhes do produto...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comparação de Preços</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#2d5d3d" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.productHeader}>
          <Image source={{ uri: productDetails.image }} style={styles.productImage} resizeMode="contain" />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{productDetails.name}</Text>
            <Text style={styles.productBrand}>{productDetails.brand}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.bestPriceLabel}>Melhor preço</Text>
              <Text style={styles.bestPrice}>
                R$ {productDetails.bestPrice ? productDetails.bestPrice.toFixed(2) : "N/A"}
              </Text>
              <Text style={styles.storeName}>em {productDetails.bestPriceStore}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          {["prices", "history", "details"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === "prices" ? "Preços" : tab === "history" ? "Histórico" : "Detalhes"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "prices" && (
          <View style={styles.pricesContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Preços por Mercado</Text>
              <TouchableOpacity onPress={handleSortPress} style={styles.sortButton}>
                <Ionicons name="funnel-outline" size={20} color="#2d5d3d" />
                <Text style={styles.sortIconLabel}>
                  Ordenar por {sortBy === "price" ? "Preço" : sortBy === "distance" ? "Distância" : "Avaliação"}
                </Text>
              </TouchableOpacity>
            </View>

            {productDetails.storesPrices.length === 0 ? (
              <Text style={styles.noDataText}>Nenhum preço disponível no momento.</Text>
            ) : (
              productDetails.storesPrices.map((store) => (
                <View key={store.id} style={styles.storeCard}>
                  <View style={styles.storeInfo}>
                    <View style={styles.storeHeader}>
                      <Text style={styles.storeCardName}>{store.name}</Text>
                      <Ionicons
                        name={store.isOpen ? "checkmark-circle" : "close-circle"}
                        size={16}
                        color={store.isOpen ? "#2d5d3d" : "#ff4444"}
                        style={styles.statusIcon}
                      />
                    </View>
                    <View style={styles.storeDetails}>
                      <Ionicons name="location-outline" size={14} color="#666" />
                      <Text style={styles.storeAddress} numberOfLines={1}>
                        {store.address || "Endereço indisponível"}
                      </Text>
                    </View>
                    <View style={styles.storeDetails}>
                      <Ionicons name="walk-outline" size={14} color="#666" />
                      <Text style={styles.storeDistance}>
                        {store.distance || "Distância indisponível"}
                      </Text>
                    </View>
                    <Text style={styles.priceDate}>Atualizado {store.updatedAt}</Text>
                    </View>
                  <View style={styles.storePriceAndButtonContainer}>
                    {store.isPromotion && store.promotionPrice ? (
                      <View style={styles.priceContainer}>
                        <Text style={styles.promotionPrice}>
                          R$ {store.promotionPrice.toFixed(2)}
                        </Text>
                        <Text style={styles.originalPrice}>
                          R$ {store.price.toFixed(2)}
                        </Text>
                        <View style={styles.promotionBadge}>
                          <Ionicons name="star" size={12} color="#fff" />
                          <Text style={styles.promotionBadgeText}>
                            Promoção
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.storePrice}>
                        R$ {(store.price || 0).toFixed(2)}
                      </Text>
                    )}
                    <TouchableOpacity
                      style={styles.routeButton}
                      onPress={() => openMapsApp(store)}
                    >
                      <Ionicons name="navigate-outline" size={18} color="#fff" />
                      <Text style={styles.routeButtonText}>Rota</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === "history" && (
          <View style={styles.pricesContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Histórico de Preços</Text>
            </View>
            {renderPriceHistoryChart() || (
              <Text style={styles.noDataText}>Histórico de preços não disponível.</Text>
            )}
          </View>
        )}

        {activeTab === "details" && (
          <View style={styles.detailsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Informações do Produto</Text>
            </View>
            <View style={styles.detailsCard}>
              {productDetails.details.map((detail, index) => (
                <View key={index} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{detail.label}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
              ))}
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Descrição</Text>
            </View>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{productDetails.description}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  productHeader: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  priceContainer: {
    marginTop: 4,
  },
  bestPriceLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  bestPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d5d3d",
    marginBottom: 2,
  },
  storeName: {
    fontSize: 12,
    color: "#666",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2d5d3d",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#2d5d3d",
    fontWeight: "bold",
  },
  pricesContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  sortIconLabel: {
    fontSize: 12,
    color: "#2d5d3d",
    marginLeft: 4,
    textTransform: "capitalize",
  },
  noDataText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 16,
  },
  storeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  storeInfo: {
    flex: 2,
    marginRight: 12,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  storeCardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  statusIcon: {
    marginLeft: 8,
  },
  storeDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  storeAddress: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    flex: 1,
  },
  storeDistance: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  priceDate: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
  },
  storePriceAndButtonContainer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceContainer: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  storePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d5d3d",
    marginBottom: 8,
  },
  promotionPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d5d3d",
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginBottom: 4,
  },
  promotionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4444",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  promotionBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
  routeButton: {
    backgroundColor: "#2d5d3d",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 90,
  },
  routeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: "stretch", // Garante que o container ocupe toda a largura disponível
  },
  chartWrapper: {
    alignItems: "center", // Centraliza o gráfico horizontalmente
    width: "100%", // Garante que o wrapper ocupe toda a largura do container
  },
  timeRangeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  selectedTimeRange: {
    backgroundColor: "#e8f2ed",
  },
  timeRangeText: {
    fontSize: 14,
    color: "#666",
  },
  selectedTimeRangeText: {
    color: "#2d5d3d",
    fontWeight: "500",
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  detailsContainer: {
    padding: 16,
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  descriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});

export default ProductComparisonScreen;