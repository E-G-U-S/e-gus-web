import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions, Platform } from 'react-native';

// Helper para % baseado na tela (simula responsive)
const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const maxScaleWidth = 450; // largura máxima para web
const effectiveScreenWidth = isWeb ? Math.min(screenWidth, maxScaleWidth) : screenWidth;
const scale = (size) => (effectiveScreenWidth / 375) * size; // 375 como base (iPhone X width)

const MessagePopup = ({ visible, message, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Mensagem de erro */}
          <Text style={styles.message}>
            {message || 'Ocorreu um erro inesperado'}
          </Text>

          {/* Botão OK */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: scale(8),
    padding: scale(12),
    width: scale(280), 
    maxWidth: scale(320),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#333', 
    marginBottom: scale(8),
    textAlign: 'center',
  },
  message: {
    fontSize: scale(14),
    color: '#666', 
    marginBottom: scale(12),
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2d5d3d', 
    borderRadius: scale(6),
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: scale(14),
  },
});

export default MessagePopup;