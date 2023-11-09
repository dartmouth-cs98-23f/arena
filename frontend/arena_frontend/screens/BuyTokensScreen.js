// BuyTokensScreen.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';

const tokenPackages = [
  { id: '1', tokens: 100, price: '$0.99' },
  { id: '2', tokens: 500, price: '$4.99' },
  { id: '3', tokens: 1200, price: '$9.99' },
  { id: '4', tokens: 6500, price: '$49.99' },
];

function BuyTokensScreen({ navigation }) {
  const handleTokenPurchase = (tokens, price) => {
    console.log(`Purchased ${tokens} tokens for ${price}.`);
  };

  const renderTokenPackage = ({ item }) => (
    <TouchableOpacity
      style={styles.tokenPackage}
      onPress={() => handleTokenPurchase(item.tokens, item.price)}
    >
      <Text style={styles.tokenAmount}>{item.tokens}</Text>
      <Text style={styles.tokenPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>🔙</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy Tokens</Text>
        <Text style={styles.coinBalance}>50</Text>
      </View>
      <FlatList
        data={tokenPackages}
        renderItem={renderTokenPackage}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.tokenGrid}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  backButton: {
    padding: 10, // For easier touch
  },
  backIcon: {
    fontSize: 25,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  coinBalance: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tokenGrid: {
    alignItems: 'center',
    padding: 15,
  },
  tokenPackage: {
    width: '48%',
    backgroundColor: '#1A1A1A',
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderRadius: 8,
    margin: '1%', // Add a 1% margin for space between the items
  },
  tokenAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tokenPrice: {
    color: 'white',
    fontSize: 18,
  },
});

export default BuyTokensScreen;
