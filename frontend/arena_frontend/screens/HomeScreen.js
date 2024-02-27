import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, SafeAreaView } from 'react-native';
import addIcon from '../logos/addIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';
import verifiersIcon from '../logos/verifiersIcon.png';
import informationLogo from '../logos/informationLogo.png';

function HomeScreen({ route, navigation }) {
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

  const fetchBets = async () => {
    try {
      const response = await fetch('https://api.arena.markets/bets/get/', {
        method: 'GET',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      data = await response.json();
      const bets = data.bets;
      const oddsPromises = bets.map(async (bet) => {
        const oddsURL = `https://api.arena.markets/bets/odds/?uid=${bet.uuid}`;
        const oddsResponse = await fetch(oddsURL, {
          method: 'GET',
          headers: headers,
        });
        const oddsData = await oddsResponse.json();
        const computedOdds = (oddsData.odds[0].odds * 100).toFixed(0) + '%';
        return {
          id: bet._id.$oid, // MongoDB's ObjectID
          uuid: bet.uuid, // The UUID needed for detail view
          question: bet.title,
          percentage: computedOdds,
        };
      });
      const oddsResults = await Promise.all(oddsPromises);
      setFeedData(oddsResults);
    } catch (error) {
      console.error('Fetch bets error:', error);
    }
  };

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
    fetchBets();
    fetchBalance();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchBets();
      await fetchBalance(); // This ensures the token balance is updated on pull to refresh
    } catch (error) {
      console.error('Error on refreshing:', error);
    }
    setRefreshing(false);
  };

  const [myTokens, setMyTokens] = useState(50); // Initialize myTokens state

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: headers,
    };
    const apiEndpoint = 'https://api.arena.markets/user/balance';

    fetch(apiEndpoint, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Balance fetched successfully!');
        setMyTokens(data.balance); // Update the myTokens state with the fetched balance
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  const renderItem = ({ item }) => (

    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('BetDetail', { betUuid: item.uuid, apiToken: apiToken })}>
      <View style={styles.textContainer}>
        <Text style={styles.questionText}>{item.question}</Text>
      </View>
      <View style={styles.percentageContainer}>
        <Text style={styles.percentageText}>{item.percentage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Help', { apiToken: apiToken })} style={styles.backButton}>
                    <Image source={informationLogo} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>ARENA</Text>
          <TouchableOpacity onPress={() => navigation.navigate('BuyTokens', { apiToken: apiToken })} style={styles.coinButton}>
            <Text style={styles.coinBalance}>💰{myTokens}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={feedData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
          }
        />

        <View style={styles.footer}>
          {/* Add footer navigation icons here */}
          <TouchableOpacity onPress={() => navigation.replace('Home', { apiToken: apiToken })}>
            <Image source={homeIcon} style={styles.footerIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Question', { apiToken: apiToken })}>
            <Image source={addIcon} style={styles.footerIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.replace('Profile', { apiToken: apiToken })}>
            <Image source={profileIcon} style={styles.footerIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.replace('Verifiers', { apiToken: apiToken })}>
            <Image source={verifiersIcon} style={styles.footerIcon} />
          </TouchableOpacity>
        </View>
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 0.8, // takes up 80% of the item container
  },
  percentageContainer: {
    flex: 0.2, // takes up 20% of the item container
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    color: 'white',
    fontSize: 18,
  },
  percentageText: {
    color: '#34D399',
    fontSize: 27,
    fontWeight: 'bold',
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
  backButton: {
    padding: 10,
  },
  backIcon: {
      width: 25, // Adjust the size as needed
      height: 25, // Adjust the size as needed
      resizeMode: 'contain',
  },
});

export default HomeScreen;