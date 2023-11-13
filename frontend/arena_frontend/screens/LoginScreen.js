import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Linking } from 'react-native';
import logo from '../logos/ArenaLogo.png';

function LoginScreen({ navigation }) {
  useEffect(() => {
    // Add URL event listener when the component mounts
    Linking.addEventListener('url', handleRedirect);

    // Cleanup function to remove the event listener
    return () => {
      Linking.removeEventListener('url', handleRedirect);
    };
  }, []);

  const handleLogin = async () => {
    try {
      // Open OAuth URL
      await Linking.openURL("http://arena-backend.fly.dev/login");
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleRedirect = (event) => {
    // Extract API key from the URL
    const apiKey = extractApiKeyFromUrl(event.url);
    if (apiKey) {
      navigation.navigate('Home', { apiKey: apiKey });
    }
  };

  const extractApiKeyFromUrl = (url) => {
    const queryParams = new URL(url).searchParams;
    return queryParams.get('api_key');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
    <Image source={logo} style={styles.logo} />
      </View>

      <Text style={styles.title}>ARENA</Text>
      <Text style={styles.subtitle}>Enter. Bet. Win.</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Authenticate Now</Text>
      </TouchableOpacity>
      <Text style={styles.finePrint}>
        By signing up, you agree to our Terms and Conditions and Privacy Policy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 30,
  },
  logoContainer: {
    // Your logo container styles here
  },
  logo: {
    width: 400, // set width of the logo
    height: 400, // set height of the logo
    resizeMode: 'contain', // maintain the logo’s aspect ratio
  },

  title: {
    color: 'white',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 40,
  },
  button: {
    width: '100%',
    backgroundColor: '#34D399',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  finePrint: {
    color: 'grey',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LoginScreen;
