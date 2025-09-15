// utils/mockData.js

export const mockFeaturedProducts = [
  {
    id: '1',
    name: 'Cerveja Brahma 350ml',
    category: 'Bebidas',
    brand: 'Brahma',
    image_url: 'https://via.placeholder.com/150?text=Cerveja',
    stores: [
      {
        price: 4.99,
        promotionPrice: 3.99,
        isPromotion: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Refrigerante Coca-Cola 2L',
    category: 'Bebidas',
    brand: 'Coca-Cola',
    image_url: 'https://via.placeholder.com/150?text=Coca-Cola',
    stores: [
      {
        price: 8.99,
        promotionPrice: 7.49,
        isPromotion: true,
      },
    ],
  },
  {
    id: '3',
    name: 'Arroz Tio João 5kg',
    category: 'Alimentos',
    brand: 'Tio João',
    image_url: 'https://via.placeholder.com/150?text=Arroz',
    stores: [
      {
        price: 19.99,
        promotionPrice: 19.99,
        isPromotion: false,
      },
    ],
  },
  {
    id: '4',
    name: 'Feijão Carioca 1kg',
    category: 'Alimentos',
    brand: 'Camil',
    image_url: 'https://via.placeholder.com/150?text=Feijão',
    stores: [
      {
        price: 8.99,
        promotionPrice: 8.99,
        isPromotion: false,
      },
    ],
  },
];

export const mockBeverageHighlights = mockFeaturedProducts.filter(
  (product) => product.category.toLowerCase() === 'bebidas'
);

export const mockNearbyStores = [
  {
    id: '1',
    name: 'Supermercado Central',
    address: 'Rua Principal, 123, Centro',
    distance: 2.5,
    image_url: 'https://via.placeholder.com/100?text=SC',
  },
  {
    id: '2',
    name: 'Mercado do Bairro',
    address: 'Av. Secundária, 456, Bairro Novo',
    distance: 1.8,
    image_url: 'https://via.placeholder.com/100?text=MB',
  },
];

export const mockCategories = [
  {
    id: 'all',
    name: 'Todos',
    icon: 'cube',
    color: 'bg-gray-100',
    count: mockFeaturedProducts.length, // Total number of products
  },
  {
    id: '1',
    name: 'Bebidas',
    icon: 'beer-outline',
    color: 'bg-blue-100',
    count: mockFeaturedProducts.filter((p) => p.category === 'Bebidas').length,
  },
  {
    id: '2',
    name: 'Alimentos',
    icon: 'nutrition-outline',
    color: 'bg-green-100',
    count: mockFeaturedProducts.filter((p) => p.category === 'Alimentos').length,
  },
  {
    id: '3',
    name: 'Higiene',
    icon: 'water-outline',
    color: 'bg-purple-100',
    count: 0, // No products in this category for now
  },
  {
    id: '4',
    name: 'Limpeza',
    icon: 'broom-outline',
    color: 'bg-yellow-100',
    count: 0, // No products in this category for now
  },
];

export const mockLocation = {
  coords: {
    latitude: -23.5505,
    longitude: -46.6333,
  },
  address: 'São Paulo, SP',
};

// Mock search function to simulate databaseService.searchProducts
export const mockSearchProducts = (query, categoryId) => {
  const trimmedQuery = query.trim().toLowerCase();
  let results = [...mockFeaturedProducts];

  // Filter by query (case-insensitive partial match on name)
  if (trimmedQuery) {
    results = results.filter((product) =>
      product.name.toLowerCase().includes(trimmedQuery)
    );
  }

  // Filter by category
  if (categoryId && categoryId !== 'all') {
    results = results.filter((product) =>
      product.category.toLowerCase() ===
      mockCategories.find((cat) => cat.id === categoryId)?.name.toLowerCase()
    );
  }

  return results;
};