// AddScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function AddScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Bet</Text>
      {/* Add your bet creation form and functionalities here */}
      <TouchableOpacity style={styles.button} onPress={() => {/* Add bet function here */}}>
        <Text style={styles.buttonText}>Add Bet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#34D399',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default AddScreen;
