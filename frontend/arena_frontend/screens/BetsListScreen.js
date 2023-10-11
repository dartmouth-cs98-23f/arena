import React from 'react';
import { View, FlatList, Text, Button, StyleSheet } from 'react-native';

function BetsListScreen({ navigation }) {
  const bets = []; // Sample data or fetched data

  return (
    <View style={styles.container}>
      <Button title="Create a Bet" onPress={() => navigation.navigate('CreateBet')} />
      <FlatList
        data={bets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.title}</Text>
            <Button
              title="View Details"
              onPress={() => navigation.navigate('BetDetail', { bet: item })}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default BetsListScreen;
