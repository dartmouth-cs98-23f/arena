import * as Linking from 'expo-linking';
import React from 'react';
import * as WebBrowser from "expo-web-browser";
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import logo from '../logos/ArenaLogo.png';

function LoginScreen({ navigation }) {
  const handleLogin = async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      'https://api.arena.markets/login'
    )

    console.log("RESULT TYPE: " + result.type);
    if(result.type === "success"){
      console.log("Auth Succeeded");
      console.log(result.url);

      const params = Linking.parse(result.url);

      const { api_key } = params.queryParams;

      console.log(api_key);
      
      navigation.replace("Home", { apiToken: api_key });
    }
    else {
      WebBrowser.dismissAuthSession();
    }
  }
  
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