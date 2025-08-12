import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <Image
          source={require('../assets/1000289589.jpg')}
          style={styles.founderImage}
        />
        <Text style={styles.heroTitle}>Meet Sunny</Text>
        <Text style={styles.heroSubtitle}>Founder & Creative Heart of Yarns</Text>
      </View>

      <View style={styles.storySection}>
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.storyText}>
          Yarns by Sunny was born from a passion for creativity, warmth, and self-expression. As a business owner and content creator, Sunny wanted to build a brand that inspires others to embrace their unique style and story. Each piece is more than just an accessory—it's a symbol of the journey, the challenges, and the joy of building something meaningful from scratch.
          {'\n\n'}
          From chunky knits to delicate crochet, every item is curated with love and a passion for sustainable, beautiful fashion. Thank you for supporting our journey!
        </T>
      </View>

      <View style={styles.valuesSection}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valuesGrid}>
              <View style={styles.valueCard}>
                  <Text style={styles.valueEmoji}>🌿</Text>
                  <Text style={styles.valueTitle}>Sustainability</Text>
                  <Text style={styles.valueText}>We use eco-friendly yarns and packaging.</Text>
              </View>
              <View style={styles.valueCard}>
                  <Text style={styles.valueEmoji}>🎨</Text>
                  <Text style={styles.valueTitle}>Creativity</Text>
                  <Text style={styles.valueText}>Every piece is a unique work of art.</Text>
              </View>
              <View style={styles.valueCard}>
                  <Text style={styles.valueEmoji}>🤝</Text>
                  <Text style={styles.valueTitle}>Community</Text>
                  <Text style={styles.valueText}>We support and inspire each other.</Text>
              </View>
              <View style={styles.valueCard}>
                  <Text style={styles.valueEmoji}>✨</Text>
                  <Text style={styles.valueTitle}>Quality</Text>
                  <Text style={styles.valueText}>Handmade with care and attention to detail.</Text>
              </View>
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
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#FFC0CB',
  },
  founderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#FFB6C1',
    marginBottom: 10,
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
    fontFamily: 'Cochin',
  },
  storySection: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Cochin',
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  valuesSection: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
  },
  valuesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
  },
  valueCard: {
      width: '45%',
      alignItems: 'center',
      backgroundColor: '#FFF0F5',
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
  },
  valueEmoji: {
      fontSize: 30,
      marginBottom: 5,
  },
  valueTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
  },
  valueText: {
      fontSize: 12,
      textAlign: 'center',
  }
});

export default AboutScreen;
