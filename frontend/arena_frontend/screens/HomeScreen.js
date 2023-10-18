// HomeScreen.js

import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      <Button title="Bets List" onPress={() => navigation.navigate('Bets List')} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
      <Button title="Wallet" onPress={() => navigation.navigate('Wallet')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Added some padding for better spacing
  },
});

export default HomeScreen;
