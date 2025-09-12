
export const mockProducts = [
  {
    id: "1",
    name: "Arroz Integral Tio João",
    brand: "Tio João",
    image: "https://josapar.vteximg.com.br/arquivos/ids/157453-450-450/18490_1.jpg?v=638545905842500000",
    price: 19.9,
    unit: "1kg",
    category: "Alimentos",
    featured: true,
  },
  {
    id: "2",
    name: "Feijão Carioca Camil",
    brand: "Camil",
    image: "https://via.placeholder.com/150?text=Feijão",
    price: 8.5,
    unit: "1kg",
    category: "Alimentos",
    featured: true,
  },
  {
    id: "3",
    name: "Leite Integral Itambé",
    brand: "Itambé",
    image: "https://via.placeholder.com/150?text=Leite",
    price: 4.99,
    unit: "1L",
    category: "Laticínios",
    featured: true,
  },
  {
    id: "4",
    name: "Café Pilão Tradicional",
    brand: "Pilão",
    image: "https://via.placeholder.com/150?text=Café",
    price: 15.9,
    unit: "500g",
    category: "Bebidas",
    featured: false,
  },
  {
    id: "5",
    name: "Açúcar Refinado União",
    brand: "União",
    image: "https://via.placeholder.com/150?text=Açúcar",
    price: 5.49,
    unit: "1kg",
    category: "Alimentos",
    featured: false,
  },
  {
    id: "6",
    name: "Óleo de Soja Liza",
    brand: "Liza",
    image: "https://via.placeholder.com/150?text=Óleo",
    price: 7.99,
    unit: "900ml",
    category: "Alimentos",
    featured: false,
  },
  {
    id: "7",
    name: "Macarrão Espaguete Adria",
    brand: "Adria",
    image: "https://via.placeholder.com/150?text=Macarrão",
    price: 3.99,
    unit: "500g",
    category: "Alimentos",
    featured: false,
  },
  {
    id: "8",
    name: "Sabão em Pó Omo",
    brand: "Omo",
    image: "https://via.placeholder.com/150?text=Sabão",
    price: 21.9,
    unit: "1.6kg",
    category: "Limpeza",
    featured: true,
  },
]

export const mockCategories = [
  {
    id: "1",
    name: "Alimentos",
    icon: "nutrition",
  },
  {
    id: "2",
    name: "Bebidas",
    icon: "wine",
  },
  {
    id: "3",
    name: "Laticínios",
    icon: "egg",
  },
  {
    id: "4",
    name: "Limpeza",
    icon: "sparkles",
  },
  {
    id: "5",
    name: "Higiene",
    icon: "water",
  },
  {
    id: "6",
    name: "Hortifruti",
    icon: "leaf",
  },
  {
    id: "7",
    name: "Carnes",
    icon: "restaurant",
  },
  {
    id: "8",
    name: "Padaria",
    icon: "pizza",
  },
]

export const mockStores = [
  {
    id: "1",
    name: "Supermercado Extra",
    address: "Av. Paulista, 1578",
    distance: "1.2 km",
    rating: 4.5,
    latitude: -23.5629,
    longitude: -46.6544,
    isOpen: true,
    hours: "08:00 - 22:00",
    phone: "(11) 3333-4444",
  },
  {
    id: "2",
    name: "Carrefour",
    address: "Av. Brigadeiro Faria Lima, 2232",
    distance: "2.5 km",
    rating: 4.2,
    latitude: -23.5703,
    longitude: -46.6939,
    isOpen: true,
    hours: "08:00 - 23:00",
    phone: "(11) 3333-5555",
  },
  {
    id: "3",
    name: "Pão de Açúcar",
    address: "R. Oscar Freire, 2250",
    distance: "3.1 km",
    rating: 4.7,
    latitude: -23.5553,
    longitude: -46.6733,
    isOpen: true,
    hours: "07:00 - 23:00",
    phone: "(11) 3333-6666",
  },
  {
    id: "4",
    name: "Dia Supermercado",
    address: "R. Augusta, 1356",
    distance: "1.8 km",
    rating: 3.9,
    latitude: -23.5529,
    longitude: -46.6426,
    isOpen: true,
    hours: "08:00 - 21:00",
    phone: "(11) 3333-7777",
  },
]

export const mockNotifications = [
  {
    id: "1",
    title: "Promoção de Arroz",
    message: "O arroz Tio João está com 20% de desconto no Carrefour!",
    date: "Hoje, 10:30",
    read: false,
    type: "promotion",
  },
  {
    id: "2",
    title: "Atualização de Preço",
    message: "O preço do Leite Integral Itambé baixou no Pão de Açúcar.",
    date: "Ontem, 15:45",
    read: true,
    type: "price_update",
  },
  {
    id: "3",
    title: "Oferta Relâmpago",
    message: "Café Pilão com 30% de desconto no Extra nas próximas 2 horas!",
    date: "Ontem, 09:15",
    read: true,
    type: "flash_sale",
  },
  {
    id: "4",
    title: "Novo Mercado Próximo",
    message: "Um novo Dia Supermercado foi aberto a 1.8 km de você.",
    date: "23/05/2023",
    read: false,
    type: "new_store",
  },
]

export const mockUser = {
  id: "1",
  name: "João Silva",
  email: "joao.silva@example.com",
  phone: "(11) 99999-9999",
  address: "Rua das Flores, 123",
  city: "São Paulo",
  state: "SP",
  zipCode: "01234-567",
  profileImage: "https://via.placeholder.com/150?text=JS",
  preferences: {
    notifications: {
      promotions: true,
      priceUpdates: true,
      newStores: true,
    },
    defaultLocation: {
      latitude: -23.5629,
      longitude: -46.6544,
      address: "Av. Paulista, 1578",
    },
  },
}

export const getMockProductDetails = async (productId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    id: productId,
    name: "Arroz Integral Tio João",
    brand: "Tio João",
    image: "https://via.placeholder.com/150?text=Arroz",
    description:
      "Arroz integral tipo 1, classe longo fino. Rico em fibras e nutrientes, o arroz integral Tio João é uma opção saudável para o dia a dia. Não contém glúten.",
    bestPrice: 19.9,
    bestPriceStore: "Supermercado Extra",
    priceHistory: {
      week: [21.9, 21.9, 20.5, 20.5, 19.9, 19.9, 19.9],
      month: [22.5, 21.9, 20.5, 19.9],
      year: [18.9, 19.5, 20.9, 22.5, 21.5, 19.9],
    },
    storesPrices: [
      {
        name: "Supermercado Extra",
        price: 19.9,
        address: "Av. Paulista, 1578",
        distance: "1.2 km",
        updatedAt: "hoje",
      },
      {
        name: "Carrefour",
        price: 21.5,
        address: "Av. Brigadeiro Faria Lima, 2232",
        distance: "2.5 km",
        updatedAt: "ontem",
      },
      {
        name: "Pão de Açúcar",
        price: 22.9,
        address: "R. Oscar Freire, 2250",
        distance: "3.1 km",
        updatedAt: "há 2 dias",
      },
      {
        name: "Dia Supermercado",
        price: 20.5,
        address: "R. Augusta, 1356",
        distance: "1.8 km",
        updatedAt: "hoje",
      },
    ],
    details: [
      { label: "Peso Líquido", value: "1kg" },
      { label: "Tipo", value: "Integral" },
      { label: "Classe", value: "Longo Fino" },
      { label: "Contém Glúten", value: "Não" },
      { label: "Validade", value: "12 meses" },
    ],
    rating: {
      average: 4.7,
      count: 128,
      distribution: {
        5: 75,
        4: 15,
        3: 5,
        2: 3,
        1: 2,
      },
    },
    reviews: [
      {
        userName: "Maria C.",
        rating: 5,
        date: "15/05/2023",
        comment: "Excelente arroz integral, cozinha bem e fica soltinho. Sempre compro.",
      },
      {
        userName: "Pedro A.",
        rating: 4,
        date: "02/05/2023",
        comment: "Bom produto, mas achei um pouco caro comparado com outras marcas.",
      },
      {
        userName: "Ana L.",
        rating: 5,
        date: "28/04/2023",
        comment: "O melhor arroz integral que já experimentei. Vale cada centavo!",
      },
    ],
  }
}

export const getMockMultiStoreRoute = async (productId, userLat, userLng) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const userLocation = {
    latitude: userLat || -23.5505,
    longitude: userLng || -46.6333,
  }

  const stores = [
    {
      id: "1",
      name: "Supermercado Extra",
      address: "Av. Paulista, 1578",
      latitude: -23.5629,
      longitude: -46.6544,
      price: 19.9,
      distance: 1.2,
      duration: "15 min",
    },
    {
      id: "2",
      name: "Dia Supermercado",
      address: "R. Augusta, 1356",
      latitude: -23.5529,
      longitude: -46.6426,
      price: 20.5,
      distance: 1.8,
      duration: "20 min",
    },
    {
      id: "3",
      name: "Carrefour",
      address: "Av. Brigadeiro Faria Lima, 2232",
      latitude: -23.5703,
      longitude: -46.6939,
      price: 21.5,
      distance: 2.5,
      duration: "25 min",
    },
  ]

  // Create route segments between locations
  const createSegments = (locations) => {
    const segments = []
    for (let i = 0; i < locations.length - 1; i++) {
      const start = locations[i]
      const end = locations[i + 1]

      // Create a simple straight line for demo purposes
      // In a real app, this would be a proper route with waypoints
      segments.push({
        start: start,
        end: end,
        distance: calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude),
        duration: i * 10 + 10, // minutes
        coordinates: [
          { latitude: start.latitude, longitude: start.longitude },
          { latitude: end.latitude, longitude: end.longitude },
        ],
      })
    }
    return segments
  }

  // Calculate bounds for the route
  const calculateBounds = (locations) => {
    let north = -90
    let south = 90
    let east = -180
    let west = 180

    locations.forEach((loc) => {
      north = Math.max(north, loc.latitude)
      south = Math.min(south, loc.latitude)
      east = Math.max(east, loc.longitude)
      west = Math.min(west, loc.longitude)
    })

    return { north, south, east, west }
  }

  // Calculate total distance and duration
  const calculateTotals = (segments) => {
    return segments.reduce(
      (acc, segment) => {
        return {
          distance: acc.distance + segment.distance,
          duration: acc.duration + segment.duration,
        }
      },
      { distance: 0, duration: 0 },
    )
  }

  // Optimal route (balanced price and distance)
  const optimalStores = [stores[0], stores[1]] // Extra and Dia
  const optimalLocations = [
    userLocation,
    ...optimalStores.map((s) => ({ latitude: s.latitude, longitude: s.longitude })),
  ]
  const optimalSegments = createSegments(optimalLocations)
  const optimalTotals = calculateTotals(optimalSegments)
  const optimalPrice = optimalStores.reduce((sum, store) => sum + store.price, 0)

  // Price-optimized route (lowest total price)
  const priceStores = [stores[0], stores[2]] // Extra and Carrefour
  const priceLocations = [userLocation, ...priceStores.map((s) => ({ latitude: s.latitude, longitude: s.longitude }))]
  const priceSegments = createSegments(priceLocations)
  const priceTotals = calculateTotals(priceSegments)
  const lowestPrice = priceStores.reduce((sum, store) => sum + store.price, 0)

  // Distance-optimized route (shortest total distance)
  const distanceStores = [stores[0]] // Just Extra
  const distanceLocations = [
    userLocation,
    ...distanceStores.map((s) => ({ latitude: s.latitude, longitude: s.longitude })),
  ]
  const distanceSegments = createSegments(distanceLocations)
  const distanceTotals = calculateTotals(distanceSegments)
  const distancePrice = distanceStores.reduce((sum, store) => sum + store.price, 0)

  return {
    optimal: {
      stores: optimalStores,
      segments: optimalSegments,
      totalDistance: optimalTotals.distance,
      totalDuration: optimalTotals.duration,
      totalPrice: optimalPrice,
      bounds: calculateBounds(optimalLocations),
    },
    price: {
      stores: priceStores,
      segments: priceSegments,
      totalDistance: priceTotals.distance,
      totalDuration: priceTotals.duration,
      totalPrice: lowestPrice,
      bounds: calculateBounds(priceLocations),
    },
    distance: {
      stores: distanceStores,
      segments: distanceSegments,
      totalDistance: distanceTotals.distance,
      totalDuration: distanceTotals.duration,
      totalPrice: distancePrice,
      bounds: calculateBounds(distanceLocations),
    },
  }
}

// Helper function to calculate distance between coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}
