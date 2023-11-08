import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

function CreateBetScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [odds, setOdds] = useState('');

  const handleCreateBet = () => {
    // Logic to create a new bet (to be implemented)
    const axios = require('axios');
    const jsonData = {
      title: title,
      description: description,
      win_justification: "cause I said so",
      verifier_uuid: "string",
      odds: odds
    };

    axios.post('https://arena-backend.fly.dev/docs#/bets/create_bet_bets_create_post', jsonData)
      .then(response => {
        // Handle the response here
        console.log(response.data);
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Bet Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Odds"
        value={odds}
        onChangeText={setOdds}
      />
      <Button title="Create Bet" onPress={handleCreateBet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default CreateBetScreen;
