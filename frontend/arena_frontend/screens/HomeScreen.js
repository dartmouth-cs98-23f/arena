import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import logo from '../logos/ArenaLogo.png';
import addIcon from '../logos/addIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';

function HomeScreen({ navigation }) {
  const apiToken = '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d';
  const [feedData, setFeedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Set the headers for the request
  const headers = {
    'access_token': apiToken,
    'Content-Type': 'application/json',
  };

  console.log('hello');
  const fetchBets = async () => {
    try {
      const response = await fetch('https://arena-backend.fly.dev/bets/get/', {
        method: 'GET',
        headers: headers,
      });
      console.log('response', response);
      console.log('hello2');
      const data = await response.json();
      const bets = data.bets;
      console.log('bets', bets);
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

  useEffect(() => {
    fetchBets();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBets();
    setRefreshing(false);
  };

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.headerLogo} />
        <Text style={styles.headerText}>ARENA</Text>
      </View>

      <FlatList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Add')}>
          <Image source={addIcon} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={homeIcon} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={profileIcon} style={styles.footerIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Rest of your styles and export.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row', // added for horizontal arrangement
    alignItems: 'center', // align items vertically center
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 15, // added padding for the logo and text
    backgroundColor: 'black',
  },
  headerLogo: {
    width: 30,
    height: 30,
    marginRight: 10, // added some margin to separate the logo and the text
  },
  headerText: {
    color: 'white',
    fontSize: 24,
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
