import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ProductCard = ({ item, onPress, horizontal = false }) => {
  const isPromotion = item.precoPromocional != null;
  const originalPrice = Number(item.precoBase ?? 0);
  const finalPrice = Number(item.precoFinal ?? originalPrice);
  const promotionPrice = isPromotion ? Number(item.precoPromocional) : finalPrice;
  const hasPrice = typeof item.precoFinal === 'number' && !isNaN(item.precoFinal);
  const discountPercentage = isPromotion && originalPrice > 0
    ? Math.round(((originalPrice - promotionPrice) / originalPrice) * 100)
    : 0;

  return (
    <TouchableOpacity
      style={[styles.productCard, horizontal && styles.horizontalCard]}
      onPress={() => onPress(item)}
    >
      {isPromotion && discountPercentage > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{discountPercentage}%</Text>
        </View>
      )}
      <Image
        source={{ uri: item.imagemUrl || 'https://via.placeholder.com/150?text=No+Image' }}
        style={[styles.productImage, horizontal && styles.horizontalImage]}
        resizeMode="contain"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={horizontal ? 1 : 2}>
          {item.nome || 'Produto sem nome'}
        </Text>
        {!horizontal && (
          <Text style={styles.productCategory} numberOfLines={1}>
            {item.categoria || 'Sem categoria'}
          </Text>
        )}
        {hasPrice && (
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              R$ {finalPrice.toFixed(2)}
            </Text>
            {isPromotion && originalPrice !== promotionPrice && (
              <Text style={styles.originalPrice}>
                R$ {originalPrice.toFixed(2)}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  horizontalCard: {
    width: 150, // Ajuste conforme o cardWidth do HomeScreen
    marginRight: 8,
    padding: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: 120,
    marginBottom: 12,
  },
  horizontalImage: {
    width: '100%',
    height: 80,
    marginBottom: 4,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  productBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d5d3d',
  },
  originalPrice: {
    fontSize: 10,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
});

export default ProductCard;