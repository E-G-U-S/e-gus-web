import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { storage } from '../utils';
import { Button } from '../components/ui';
import { pedidoService } from '../services/api';
import MessagePopup from '../components/ui/MessagePopup';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const CartScreen = () => {
  const [items, setItems] = useState([]);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const FOOTER_HEIGHT = 88; // approximate footer height used to reserve space for FlatList

  const loadCart = async () => {
    const cart = (await storage.get('cart')) || [];
    setItems(cart);
  };

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const { user } = useApp();

  useEffect(() => {
    if (isFocused) loadCart();
  }, [isFocused]);

  const updateQuantity = async (index, newQty) => {
    const updated = [...items];
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    setItems(updated);
    await storage.set('cart', updated);
  };

  const renderItem = ({ item, index }) => {
    const imageUri = item.image || item.imagemUrl || 'https://via.placeholder.com/150?text=No+Image';
    return (
      <View style={styles.item}>
        <Image source={{ uri: imageUri }} style={styles.itemImage} resizeMode="contain" />
        <View style={styles.itemContent}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.itemStore}>{item.storeName}</Text>
          <Text style={styles.itemPrice}>R$ {Number(item.price || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.qtyBox}>
          <TouchableOpacity onPress={() => updateQuantity(index, (item.quantity || 1) - 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(index, (item.quantity || 1) + 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Carrinho</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>Seu carrinho está vazio.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, idx) => String(idx)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: FOOTER_HEIGHT + insets.bottom }}
        />
      )}

      {/* Footer with subtotal and checkout button */}
        <View style={[styles.footer, { paddingBottom: 12 + insets.bottom }]}> 
        <View style={styles.footerInner}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalValue}>R$ {items.reduce((s,i) => s + (Number(i.price||0) * (i.quantity||0)), 0).toFixed(2)}</Text>
        </View>
        <Button
          variant="primary"
          size="lg"
          loading={checkingOut}
          disabled={checkingOut || items.length === 0}
          onPress={async () => {
            if (!items.length || checkingOut) return;
            setCheckingOut(true);

            try {
              const groups = items.reduce((acc, it) => {
                const key = it.storeId ?? null;
                if (!acc[key]) acc[key] = [];
                acc[key].push(it);
                return acc;
              }, {});

              const successes = [];
              const failures = [];

              for (const [marketIdStr, groupItems] of Object.entries(groups)) {
                const marketId = marketIdStr === 'null' ? null : Number(marketIdStr);
                const payload = {
                  idUsuario: user?.id ?? null,
                  idCupom: null,
                  idMercado: marketId,
                  itens: groupItems.map(i => ({
                    produtoId: i.productId,
                    quantidade: i.quantity,
                    precoUnitario: Number(i.price || 0),
                  })),
                };

                const res = await pedidoService.create(payload);
                if (res.success) {
                  const created = res.data || {};
                  successes.push({ marketId, orderId: created.id || null });
                } else {
                  failures.push({ marketId, error: res.error || 'Falha ao criar pedido' });
                }
              }

              const successMarketIds = new Set(successes.map(s => (s.marketId == null ? null : Number(s.marketId))));
              const remaining = items.filter(it => {
                const id = it.storeId ?? null;
                return !successMarketIds.has(id == null ? null : Number(id));
              });

              await storage.set('cart', remaining);
              setItems(remaining);

              const createdIds = successes.map(s => s.orderId).filter(Boolean);
              if (failures.length === 0 && createdIds.length > 0) {
                setPopupMessage(createdIds.length === 1 ? `Pedido criado com sucesso (ID: ${createdIds[0]})` : `Pedidos criados com sucesso (IDs: ${createdIds.join(', ')})`);
              } else if (createdIds.length > 0 && failures.length > 0) {
                setPopupMessage(`Pedidos criados (IDs: ${createdIds.join(', ')}). Falhas em ${failures.length} mercado(s).`);
              } else {
                setPopupMessage(failures[0]?.error || 'Erro ao criar pedidos');
              }
              setPopupVisible(true);
            } catch (err) {
              console.error('Erro ao criar pedidos:', err);
              setPopupMessage('Erro ao criar pedidos. Tente novamente.');
              setPopupVisible(true);
            } finally {
              setCheckingOut(false);
            }
          }}
        >
          Fechar Compra
        </Button>
      </View>
      <MessagePopup visible={popupVisible} message={popupMessage} onClose={() => setPopupVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  empty: {
    color: '#666',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemStore: {
    fontSize: 12,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d5d3d',
  },
  qtyBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtn: {
    backgroundColor: '#e6e6e6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginVertical: 4,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 4,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    left: 600,
    right: 600,
    bottom: 50,
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 6,
  },
  footerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtotalLabel: {
    color: '#666',
    fontSize: 14,
  },
  subtotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d5d3d',
  },
});

export default CartScreen;
