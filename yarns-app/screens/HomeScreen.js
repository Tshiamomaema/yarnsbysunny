import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { products } from '../data/products';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const productsRef = useRef(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleFilter = (category) => {
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((p) => p.category === category);
      setFilteredProducts(filtered);
    }
  };

  const scrollToProducts = () => {
    productsRef.current.measureLayout(
      (x, y, width, height, pageX, pageY) => {
        scrollViewRef.current.scrollTo({ y: pageY, animated: true });
      },
      () => {}
    );
  };

  const scrollViewRef = useRef(null);

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <Text style={styles.productPrice}>R{item.price}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} ref={scrollViewRef}>
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Welcome to Yarns</Text>
        <Text style={styles.heroSubtitle}>Cozy up in style with our latest yarn-based fashion.</Text>
        <TouchableOpacity style={styles.shopButton} onPress={scrollToProducts}>
          <Text style={styles.shopButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.filterSection}>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilter('all')}>
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilter('Accessories')}>
          <Text>Accessories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilter('Tops')}>
          <Text>Tops</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilter('Dresses')}>
          <Text>Dresses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => handleFilter('Bags')}>
          <Text>Bags</Text>
        </TouchableOpacity>
      </View>

      <View ref={productsRef} style={{ paddingHorizontal: 10 }}>
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      </View>

      <View style={styles.instagramSection}>
        <Text style={styles.instagramTitle}>See What’s Trending</Text>
        <View style={styles.instagramGrid}>
          <Image source={require('../assets/1000289536.jpg')} style={styles.instagramImage} />
          <Image source={require('../assets/1000289544.jpg')} style={styles.instagramImage} />
          <Image source={require('../assets/1000289564.jpg')} style={styles.instagramImage} />
          <Image source={require('../assets/1000289576.jpg')} style={styles.instagramImage} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  heroSection: {
    height: Dimensions.get('window').height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFC0CB',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B008B',
    fontFamily: 'Cochin',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#8B008B',
    marginTop: 10,
    fontFamily: 'Cochin',
  },
  shopButton: {
    marginTop: 20,
    backgroundColor: '#FF69B4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchSection: {
    padding: 10,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    borderColor: '#FFC0CB',
    borderWidth: 1,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#FFB6C1',
    borderRadius: 10,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  productCard: {
    width: width / 2 - 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  productDescription: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#FF69B4',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  instagramSection: {
    padding: 10,
    alignItems: 'center',
  },
  instagramTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 10,
    fontFamily: 'Cochin',
  },
  instagramGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  instagramImage: {
    width: width / 2 - 20,
    height: width / 2 - 20,
    margin: 5,
    borderRadius: 10,
  },
});

export default HomeScreen;
