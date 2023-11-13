// BetDetailScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, SafeAreaView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import addIcon from '../logos/addIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';
import coinIcon from '../logos/coinIcon.png';
import backArrowIcon from '../logos/backArrowIcon.png';

function BetDetailScreen({ route, navigation }) {

  // const itemId = route.params?.itemId || 'default_bet_id'; 
  // console.log("Received item ID:", route.params?.itemId);

  const betUuid = route.params?.betUuid;

  const apiToken = '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d';
  const [betDetails, setBetDetails] = useState(null);
  const [ownedYes, setOwnedYes] = useState(0);
  const [ownedNo, setOwnedNo] = useState(0);
  const [myTokens, setMyTokens] = useState(50);
  const [betTitle, setBetTitle] = useState('');
  const [computedOdds, setComputedOdds] = useState('Loading...');
  const [holdingsData, setHoldingsData] = useState(0);
  const betCost = 10;

  const headers = {
    'access_token': apiToken,
    'Content-Type': 'application/json',
  };
  const apiEndpoint = 'https://arena-backend.fly.dev/user/balance';

  const fetchBetDetails = async () => {
    try {
      console.log("Attempting to fetch details for bet ID:", betUuid);

      const url = `https://arena-backend.fly.dev/bets/get_single_bet?uuid=${betUuid}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access_token': '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d'
        }
      });

      // console.log("Response received:", response);

      const data = await response.json();

      // console.log("Data received:", data);

      if (!response.ok) {
        throw new Error(data?.detail || 'Failed to fetch bet details');
      }

      if (data.success && data.success.ok) {
        // console.log("Bet details fetched successfully:", data.bet);
        setBetDetails(data.bet); // Set the betDetails state to the bet object
      } else {
        console.error('Failed to fetch bet details:', data.success?.error);
      }

    } catch (error) {
      console.error('Error fetching bet details:', error);
    }
  };

  const fetchBalance = async () => {
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
      // console.log('Balance fetched successfully!');
      setMyTokens(data.balance); // Update the myTokens state with the fetched balance
      // console.log('myTokens', myTokens);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  const purchaseYes = async () => {
    const url = 'http://127.0.0.1:5000/bets/wager';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d'
      },
      body: JSON.stringify({ amount: 10, yes: true, bet_uuid: betUuid })
    });
    const result = await response.json();
    console.log("test", result)
    fetchBalance();
    getOddsForBet();
    getHoldings();
  };

  const purchaseNo = async () => {
    const url = 'https://arena-backend.fly.dev/bets/wager';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d'
      },
      body: JSON.stringify({ amount: 10, yes: false, bet_uuid: betUuid })
    });
    const result = await response.json();
    console.log("test", result)
    fetchBalance();
    getOddsForBet();
    getHoldings();

  };

  const getOddsForBet = async () => {
    if (!betDetails) return; // Make sure betDetails is available

    const oddsURL = `https://arena-backend.fly.dev/bets/odds/?uid=${betDetails.uuid}`;
    const oddsResponse = await fetch(oddsURL, {
      method: 'GET',
      headers: headers,
    });

    const oddsData = await oddsResponse.json();
    const newComputedOdds = (oddsData.odds[0].odds * 100).toFixed(0) + '%';
    setComputedOdds(newComputedOdds); // Update state with new odds
    
  };

  const getHoldings = async () => {

    if (!betDetails) return; // Make sure betDetails is available
    console.log("testing holdings call")
    const oddsURL = `http://127.0.0.1:5000/bets/holdings?betUuid=${betDetails.uuid}`;
    const holdingsResponse = await fetch(oddsURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d'
      }
    });
    const holdingsData = await holdingsResponse.json();
    setHoldingsData(holdingsData)
  }

  useEffect(() => {

    if (betUuid) {
      fetchBetDetails();
    }

    fetchBalance();

  }, [betUuid]);

  useEffect(() => {
    getOddsForBet(); // Call this when betDetails changes
  }, [betDetails]);

  useEffect(() => {
    if (betDetails) {
      getHoldings();
    }
  }, [betDetails]);

  // Sample data for the graph
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
        strokeWidth: 2,
      },
    ],
  };

  // Chart configuration
  const chartConfig = {
    backgroundColor: '#000000',
    color: (opacity = 1) => `rgba(52, 211, 153, ${opacity})`,
    strokeWidth: 2,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={backArrowIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bet Details</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('BuyTokens')}
          style={styles.tokenButton}>
          <Image source={coinIcon} style={styles.coinIcon} />
          <Text style={styles.coinBalance}>{myTokens}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.questionTitle}>{betDetails?.title || 'Loading...'}</Text>

      <Text style={styles.oddsTitle}>Current odds</Text>
      <Text style={styles.percentage}>{computedOdds}</Text>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity onPress={purchaseYes} style={styles.choiceButton}>
            <Text style={styles.buttonText}>Yes {betCost}</Text>
          </TouchableOpacity>
          <Text style={styles.ownedText}>Owned: {holdingsData.yes}</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity onPress={purchaseNo} style={styles.choiceButton}>
            <Text style={styles.buttonText}>No {betCost}</Text>
          </TouchableOpacity>
          <Text style={styles.ownedText}>Owned: {holdingsData.no}</Text>
        </View>
      </View>

      {/* Graph Section */}
      <View style={styles.graphContainer}>
        <LineChart
          data={data}
          width={Dimensions.get('window').width - 30} // from react-native
          height={220}
          chartConfig={chartConfig}
          bezier
        />
      </View>

      {/* Additional Info */}
      <Text style={styles.additionalInfo}>
        This bet settles to Yes if at least one student enrolled in COSC 98 does not pass the class. Settles to No otherwise.
      </Text>
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
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
    justifyContent: 'space-between', // Space items evenly
    paddingHorizontal: 10, // Add padding on the sides
    height: 60,
  },
  tokenButton: {
    flexDirection: 'row', // Positions the coin icon and balance text in a row
    alignItems: 'center',
  },
  mainContent: {
    flex: 1, // This will ensure this view takes up all space between header and footer
    // Other styling as needed
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    width: 25, // Adjust the size as needed
    height: 25, // Adjust the size as needed
    resizeMode: 'contain',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  coinBalance: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  oddsTitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  percentage: {
    color: '#34D399',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  graphContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  additionalInfo: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  flexContainer: {
    flex: 1, // This will ensure that the container takes up all available space
  },
  footer: {
    position: 'absolute', // Ensures footer sticks to the bottom
    bottom: 0, // Align to the bottom
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'black',
    borderTopWidth: 1, // Add a border top if needed for design
    paddingVertical: 10, // Padding inside the footer
  },
  footerIcon: {
    width: 30,
    height: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  buttonWrapper: {
    alignItems: 'center',
    flex: 1,
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
  buttonText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  ownedText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5, // Space between the bet amount and the owned count
  },
  // Add any additional styles you may need here
});

export default BetDetailScreen;