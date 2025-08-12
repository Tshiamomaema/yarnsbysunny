import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { products } from '../data/products';

const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  const product = products.find((p) => p.id === productId);

  const buyViaWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hello, I’d like to buy this item from Yarns:\n- Product: ${product.name}\n- Price: R${product.price}\n- Ref: ${product.id}`
    );
    const phone = '27614590003';
    Linking.openURL(`https://wa.me/${phone}?text=${msg}`);
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={product.image} style={styles.productImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productPrice}>R{product.price}</Text>
        <TouchableOpacity style={styles.button} onPress={buyViaWhatsApp}>
          <Text style={styles.buttonText}>Buy via WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  productImage: {
    width: '100%',
    height: 300,
  },
  detailsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 20,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF69B4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
