import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
  const handlePress = () => {
    alert('Botão pressionado!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Em breve algo aqui....   
        </Text>
          
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
});
