// ProfileScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native';
import addIcon from '../logos/addIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';


function ProfileScreen({ route, navigation }) {
  const [myTokens, setMyTokens] = useState(50); // Initialize myTokens state
  const [positionsData, setFeedData] = useState([
  ]);


  async function fetchBalance() {
    try {
        const apiToken = '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d';
        const headers = {
            'access_token': apiToken,
            'Content-Type': 'application/json',
        };
        const apiEndpoint = 'https://arena-backend.fly.dev/user/balance';
        const requestOptions = {
            method: 'GET',
            headers: headers,
          };
        const response = await fetch(apiEndpoint, requestOptions);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        setMyTokens(data.balance); // Update the myTokens state with the fetched balance
        // console.log('myTokens on token purchase screen', myTokens);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

  useEffect(() => {
    fetchBalance();
  }); 

  
  const apiToken = '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d';
  const [refreshing, setRefreshing] = useState(false);

  // Set the headers for the request
  const headers = {
    'access_token': apiToken,
    'Content-Type': 'application/json',
  };

  const fetchBets = async () => {
    try {
      const response = await fetch('https://arena-backend.fly.dev/bets/positions/', {
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

  useEffect(() => {
    fetchBets();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBets();
    setRefreshing(false);
  };

  useEffect(() => {
    onRefresh(); // Call onRefresh instead of fetchBets directly
  }, []);

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
      // console.log('Balance fetched successfully!');
      setMyTokens(data.balance); // Update the myTokens state with the fetched balance
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
  }, []); // The empty dependency array ensures this effect runs only once after the initial render



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
      // console.log('Balance fetched successfully!');
      setMyTokens(data.balance); // Update the myTokens state with the fetched balance
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
  }, []); // The empty dependency array ensures this effect runs only once after the initial render


  const renderPosition = ({ item }) => {
    const textColor = item.trend === 'Up' ? '#34D399' : '#FF4500'; // Green for Up, Red for Down
    
    return (
      <TouchableOpacity onPress={() => navigation.navigate('BetDetail', { itemId: item.id })}>
        <View style={styles.positionItem}>
          <View style={styles.questionContainer}>
            <Text style={styles.positionQuestion}>{item.question}</Text>
          </View>
          <View style={styles.oddsContainer}>
            <Text style={[styles.oddsPercentage, { color: textColor }]}>
              {item.percentage}
            </Text>
            <Text style={[styles.trend, { color: textColor }]}>
              {item.trend} {item.count}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Positions</Text>
      </View>
      <View style={styles.tokenSection}>
        <Text style={styles.tokenCount}>{myTokens}</Text>
        <TouchableOpacity
          style={styles.buyTokensButton}
          onPress={() => navigation.navigate('BuyTokens', { myTokens })} // Add navigation here
        >

          <Text style={styles.buyTokensText}>Buy Tokens</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={positionsData}
        renderItem={renderPosition}
        keyExtractor={item => item.id}
      />

      {/* Footer Section */}
      <View style={styles.footer}>
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

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    justifyContent: 'center', // Center the title
    alignItems: 'center', // Align items in the center for the cross-axis
    paddingVertical: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tokenSection: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Evenly space the token count and buy tokens button
    alignItems: 'center',
    paddingVertical: 10,
  },
  tokenCount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buyTokensButton: {
    backgroundColor: '#34D399',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buyTokensText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  positionItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  questionContainer: {
    flex: 0.7,
  },
  positionQuestion: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  oddsContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center', // Center align the child components
  },
  oddsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  oddsPercentage: {
    color: 'white', // Set odds percentage color to white
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2, // Add a small vertical margin for spacing
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
  trend: {
    fontSize: 16,
    marginTop: 4, // Additional margin at the top for spacing
  },
});

export default ProfileScreen;