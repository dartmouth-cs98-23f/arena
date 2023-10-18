import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

function CreateBetScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [odds, setOdds] = useState('');

  const handleCreateBet = () => {
    // Logic to create a new bet (to be implemented)
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
