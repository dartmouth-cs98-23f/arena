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
  console.log("Received bet UUID-:", route.params?.betUuid);

  const apiToken = '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d';
  const [betDetails, setBetDetails] = useState(null);
  const [ownedYes, setOwnedYes] = useState(0);
  const [ownedNo, setOwnedNo] = useState(0);
  const [myTokens, setMyTokens] = useState(50);
  const [betTitle, setBetTitle] = useState('');
  const [computedOdds, setComputedOdds] = useState('Loading...');
  const [holdingsData, setHoldingsData] = useState(0);

  const [graphData, setGraphData] = useState({
    labels: [], // will hold our label data for the graph
    datasets: [
      {
        data: [], // will hold our numerical data for the graph
        strokeWidth: 2, // optional, default 2
      },
    ],
  });

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

      const data = await response.json();
      console.log("Response received:", data);

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
    const url = 'https://arena-backend.fly.dev/bets/wager';
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

  const getFormattedLabels = (oddsArray) => {
    return oddsArray.map(() => 'Previous odds');
  };

  const getOddsForBet = async () => {
    if (!betDetails) return; // Make sure betDetails is defined

    // Construct the URL with the bet UUID and limit
    const oddsURL = `https://arena-backend.fly.dev/bets/odds/?uid=${betDetails.uuid}&limit=8`;
    try {
      // Fetch the odds data from the server
      const oddsResponse = await fetch(oddsURL, {
        method: 'GET',
        headers: headers,
      });

      const oddsData = await oddsResponse.json();
      if (oddsData.odds && oddsData.odds.length > 0) {
        // Reverse the odds array to have the most recent odds at the end
        const reversedOddsData = [...oddsData.odds].reverse();

        // Map the reversed odds data to percentage values for the graph
        const oddsValues = reversedOddsData.map(odds => odds.odds * 100);

        // Create labels for the graph, with the most recent odds last
        const labels = reversedOddsData.map((_, index) => `#${index + 1}`);

        // Update the graphData state with the new values and labels
        setGraphData({
          labels: labels,
          datasets: [{
            data: oddsValues,
            strokeWidth: 2, // Maintain any existing styling
          }],
        });

        // Update the displayed computed odds with the most recent value
        const newComputedOdds = `${oddsValues[oddsValues.length - 1].toFixed(0)}%`;
        setComputedOdds(newComputedOdds);
      } else {
        console.log("No odds data found");
      }
    } catch (error) {
      console.error('Error fetching odds:', error);
    }
  };


  const getHoldings = async () => {

    if (!betDetails) return; // Make sure betDetails is available
    console.log("testing holdings call")
    const oddsURL = `https://arena-backend.fly.dev/bets/holdings?betUuid=${betDetails.uuid}`;
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
      getOddsForBet();
      getHoldings();
    }
  }, [betDetails]);

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
          <Text style={styles.coinBalance}>💰{myTokens}</Text>
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

      {/* Title for the graph */}
      <Text style={styles.graphTitle}>Previous Betting Odds</Text>

      {/* Graph Section */}
      <View style={styles.graphContainer}>
        {graphData.labels.length > 0 && (
          <LineChart
            data={graphData}
            width={Dimensions.get('window').width - 30}
            height={220}
            chartConfig={chartConfig}
            bezier
          // Uncomment the line below if 'formatXLabel' is supported in your library version
          // formatXLabel={() => ''}
          />
        )}
      </View>
      {/* Add this Text component for the bet description */}

      <Text style={styles.descriptionText}>Description: {betDetails?.description || 'No description available'}</Text>

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
  graphTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10, // Add some padding at the top and bottom of the title
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
  descriptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'normal', // or 'bold' if you prefer
    padding: 10, // Adjust the padding as needed
    textAlign: 'center', // Center the text if you like
  },
  // Add any additional styles you may need here
});

export default BetDetailScreen;