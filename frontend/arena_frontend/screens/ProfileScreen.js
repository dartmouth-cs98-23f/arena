import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  RefreshControl,
} from 'react-native';
import addIcon from '../logos/addIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';

function ProfileScreen({ route, navigation }) {
  const [myTokens, setMyTokens] = useState(50);
  const [positionsData, setFeedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchBalance() {
    try {
      const apiToken = '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d';
      const headers = {
        'access_token': apiToken,
        'Content-Type': 'application/json',
      };
      const apiEndpoint = 'https://api.arena.markets/user/balance';
      const requestOptions = {
        method: 'GET',
        headers: headers,
      };
      const response = await fetch(apiEndpoint, requestOptions);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      setMyTokens(data.balance);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  async function fetchBets() {
    try {
      const apiToken = '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d';
      const headers = {
        'access_token': apiToken,
        'Content-Type': 'application/json',
      };
      const response = await fetch('https://api.arena.markets/bets/positions/', {
        method: 'GET',
        headers: headers,
      });
      const data = await response.json();
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
          id: bet._id.$oid,
          uuid: bet.uuid,
          question: bet.title,
          percentage: computedOdds,
        };
      });
      const oddsResults = await Promise.all(oddsPromises);
      setFeedData(oddsResults);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    fetchBalance();
    fetchBets();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBalance();
    await fetchBets();
    setRefreshing(false);
  };

  const renderPosition = ({ item }) => {
    const textColor = item.trend === 'Up' ? '#34D399' : '#FF4500';

    return (
      <TouchableOpacity onPress={() => navigation.navigate('BetDetail', { betUuid: item.uuid })}>
        <View style={styles.positionItem}>
          <View style={styles.questionContainer}>
            <Text style={styles.positionQuestion}>{item.question}</Text>
          </View>
          <View style={styles.oddsContainer}>
            <Text style={styles.oddsPercentage}>
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
        <Text style={styles.tokenCount}>💰{myTokens}</Text>
        <TouchableOpacity
          style={styles.buyTokensButton}
          onPress={() => navigation.navigate('BuyTokens', { myTokens })}
        >
          <Text style={styles.buyTokensText}>Buy Tokens</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={positionsData}
        renderItem={renderPosition}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff" // iOS spinner color
            colors={["#fff"]} // Android spinner colors
          />
        }
      />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tokenSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    justifyContent: 'space-between',
    padding: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  questionContainer: {
    flex: 0.8,
  },
  positionQuestion: {
    color: 'white',
    fontSize: 18,
  },
  oddsContainer: {
    flex: 0.2,
    alignItems: 'flex-end',
  },
  oddsPercentage: {
    color: '#34D399',
    fontSize: 27,
    fontWeight: 'bold',
  },
  trend: {
    fontSize: 16,
    marginTop: 4,
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
