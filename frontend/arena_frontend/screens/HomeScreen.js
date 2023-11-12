// HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import logo from '../logos/ArenaLogo.png';
import addIcon from '../logos/addIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';
import coinIcon from '../logos/coinIcon.png';

function HomeScreen({ navigation }) {

  const feedData = []
  const fetchBets = async () => {
    try {
      const response = await fetch('https://arena-backend.fly.dev/bets/get/', {
        method: 'GET',
        headers: headers,
      });
      const data = await response.json();
      const bets = data.bets;
      const oddsPromises = bets.map(async (bet) => {
        const oddsURL = `https://arena-backend.fly.dev/bets/odds/?uid=${bet.uuid}`;
        const oddsResponse = await fetch(oddsURL, {
          method: 'GET',
          headers: headers,
        });
        const oddsData = await oddsResponse.json();
        const computedOdds = (oddsData.odds[0].odds * 100).toFixed(0) + '%';
        return {
          id: bet._id.$oid,
          question: bet.title,
          percentage: computedOdds,
        };
      });
      const oddsResults = await Promise.all(oddsPromises);
      setFeedData(oddsResults);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBets();
    setRefreshing(false);
  };

  useEffect(() => {
    onRefresh(); // Call onRefresh instead of fetchBets directly
  }, []);

  const [myTokens, setMyTokens] = useState(50); // Initialize myTokens state


  useEffect(() => {
  const requestOptions = {
    method: 'GET',
    headers: headers,
  };
  const apiEndpoint = 'https://arena-backend.fly.dev/user/balance';

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

  const [myTokens, setMyTokens] = useState(50); // Initialize myTokens state


  useEffect(() => {
  const requestOptions = {
    method: 'GET',
    headers: headers,
  };
  const apiEndpoint = 'https://arena-backend.fly.dev/user/balance';

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
      onPress={() => navigation.navigate('BetDetail', { itemId: item.id })}>

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
        <Image source={logo} style={styles.headerLogo} />
        <Text style={styles.headerText}>ARENA</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BuyTokens')} style={styles.coinButton}>
          <Image source={coinIcon} style={styles.coinIcon}/>
          {/* <Text>{myTokens}</Text> */}
        </TouchableOpacity>
      </View>

      <FlatList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <View style={styles.footer}>
        {/* Add footer navigation icons here */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={homeIcon} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Question')}>
          <Image source={addIcon} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={profileIcon} style={styles.footerIcon} />
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
    fontSize: 30,
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
});

export default HomeScreen;