import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Image
} from 'react-native';

const ContactScreen = () => {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
            source={require('../assets/1000289589.jpg')}
            style={styles.founderImage}
        />
        <Text style={styles.title}>Let’s Get Cozy Together!</Text>
        <Text style={styles.subtitle}>We’d love to hear from you. Reach out via your favorite method below or send us a message!</Text>
      </View>

      <View style={styles.socialSection}>
        <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://wa.me/27614590003')}>
          <Text style={styles.socialText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://www.instagram.com/yarnsbysunnyy?igsh=MWVidjM2NW9kdGZrMA==')}>
          <Text style={styles.socialText}>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://facebook.com/yarnsbysunny/')}>
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={() => openLink('https://www.tiktok.com/@sunny_mamii')}>
          <Text style={styles.socialText}>TikTok</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formSection}>
          <Text style={styles.formTitle}>Send Us a Letter</Text>
          <TextInput style={styles.input} placeholder="Your Name" />
          <TextInput style={styles.input} placeholder="Your Email" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Your Message" multiline numberOfLines={4} />
          <TouchableOpacity style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.mapSection}>
          <Text style={styles.mapTitle}>Find Us</Text>
          <Text style={styles.address}>Protea Gardens, Soweto, South Africa</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFC0CB'
  },
  founderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFB6C1',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B008B',
    fontFamily: 'Cochin',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
  socialSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  socialButton: {
    backgroundColor: '#FFB6C1',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    marginBottom: 10
  },
  socialText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  formSection: {
      backgroundColor: 'white',
      padding: 20,
      margin: 10,
      borderRadius: 10,
  },
  formTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FF69B4',
      textAlign: 'center',
      marginBottom: 20,
      fontFamily: 'Cochin',
  },
  input: {
      backgroundColor: '#F0F0F0',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
  },
  sendButton: {
      backgroundColor: '#FF69B4',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
  },
  sendButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  },
  mapSection: {
      padding: 20,
      alignItems: 'center',
      margin: 10,
      backgroundColor: 'white',
      borderRadius: 10,
  },
  mapTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FF69B4',
      marginBottom: 10,
      fontFamily: 'Cochin',
  },
  address: {
      fontSize: 16,
      textAlign: 'center',
  }
});

export default ContactScreen;
