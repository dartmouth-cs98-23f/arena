// HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

function HomeScreen({ navigation }) {
  const predictions = [
    { id: '1', title: "Will any students fail COSC 98 in Fall 2023?", percentage: "48%" },
    { id: '2', title: "Will Psi Upsilon get suspended before March 1, 2024?", percentage: "2%" },
    { id: '3', title: "Will Hanover, NH get more than 12 inches of snow before January 4, 2024?", percentage: "4%" },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={predictions}
        renderItem={({ item }) => <PredictionCard title={item.title} percentage={item.percentage} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

function PredictionCard({ title, percentage }) {
  return (
    <View style={styles.card}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.percentageText}>{percentage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  titleText: {
    fontSize: 16,
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
