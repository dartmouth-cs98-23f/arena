// BetDetailScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function BetDetailScreen({ route }) {
  const { bet } = route.params; // Assuming bet details are passed as params

  return (
    <View style={styles.container}>
      <Text>{bet.title}</Text>
      <Text>{bet.description}</Text>
      <Text>Odds: {bet.odds}</Text>
      <Button title="Update Bet" onPress={() => {/* Update logic */}} />
      <Button title="Delete Bet" onPress={() => {/* Delete logic */}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BetDetailScreen;
