import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, Image, RefreshControl, SafeAreaView } from 'react-native';
import logo from '../logos/ArenaLogo.png';
import addIcon from '../logos/addIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';
import verifiersIcon from '../logos/verifiersIcon.png';
import backArrowIcon from '../logos/backArrowIcon.png';
import * as WebBrowser from "expo-web-browser";

function HelpScreen({ route, navigation }) {
  const apiToken = route.params?.apiToken;
  console.log(`API Token: ${apiToken}`);
  //const apiToken = '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d';
  const [feedData, setFeedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Set the headers for the request
  const headers = {
    'access_token': apiToken,
    'Content-Type': 'application/json',
  };

  const [myTokens, setMyTokens] = useState(50); // Initialize myTokens state

  const fetchBalance = async () => {
    try {
      const apiEndpoint = 'https://api.arena.markets/user/balance';
      const requestOptions = {
        method: 'GET',
        headers: headers,
      };
      const response = await fetch(apiEndpoint, requestOptions);
      if (!response.ok) {
        throw new Error(`Balance request failed with status ${response.status}`);
      }
      const data = await response.json();
      // console.log('Balance fetched successfully!');
      setMyTokens(data.balance); // Update the myTokens state with the fetched balance
      // console.log('myTokens', myTokens);
    } catch (error) {
      console.error('Fetch balance error:', error);
    }
  }

  useEffect(() => {
    fetchBalance();
  }, []);


  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchBalance(); // This ensures the token balance is updated on pull to refresh
    } catch (error) {
      console.error('Error on refreshing:', error);
    }
    setRefreshing(false);
  };

  const handleRedirectToBlog = async () => {
    try {
      const result = await WebBrowser.openBrowserAsync(
        'https://arena-markets.blogspot.com/'
      );
      console.log("Redirect Succeeded");
      // It's important to note that result.url may not be available depending on the API's response structure.
      // If you need to log the redirected URL, ensure that the API actually returns it in the result object.
      if(result.url) {
        console.log(result.url);
      }
    } catch (error) {
      console.error('Problem opening the blog: ', error);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image source={backArrowIcon} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Help</Text>
          <TouchableOpacity onPress={() => navigation.navigate('BuyTokens', { apiToken: apiToken })} style={styles.coinButton}>
            <Text style={styles.coinBalance}>💰{myTokens}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={handleRedirectToBlog} style={styles.choiceButton}>
              <Text style={styles.buttonText}>Visit Arena Markets Blog</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
          {/* Add footer navigation icons here */}
          <TouchableOpacity onPress={() => navigation.navigate('Home', { apiToken: apiToken })}>
            <Image source={homeIcon} style={styles.footerIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Question', { apiToken: apiToken })}>
            <Image source={addIcon} style={styles.footerIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { apiToken: apiToken })}>
            <Image source={profileIcon} style={styles.footerIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Verifiers', { apiToken: apiToken })}>
            <Image source={verifiersIcon} style={styles.footerIcon} />
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // This ensures the logo and the coin icon are on opposite sides
    padding: 15,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  backIcon: {
    width: 25, // Adjust the size as needed
    height: 25, // Adjust the size as needed
    resizeMode: 'contain',
  },
  coinButton: {
    // Styles for the coin icon button
  },
  coinBalance: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coinIcon: {
    width: 25,
    height: 25,
  },
  headerLogo: {
    width: 30,
    height: 30,
    marginRight: 10, // added some margin to separate the logo and the text
  },
  headerText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold', // made the text bold
  },
  buyTokensButton: {
    // You may not need additional styling if your layout is already as desired.
    // Add padding if you want the touchable area to be larger:
    justifyContent: 'right',
    alignItems: 'right',
    padding: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'black', // Adjust the background color as needed
  },
  footerIcon: {
    width: 30, // Adjust the width as needed
    height: 30, // Adjust the height as needed
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  choiceButton: {
    backgroundColor: '#34D399', // Your button background color
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
});



export default HelpScreen;
