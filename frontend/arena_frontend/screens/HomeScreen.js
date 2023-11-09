// HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import logo from '../logos/ArenaLogo.png';
import addIcon from '../logos/addIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';

function HomeScreen({ navigation }) {

  const feedData = [
    // Add more bet items here
    { id: '1', question: 'Will Hanover, NH get more than 12 inches of snow before January 4, 2024', percentage: '4%' },
    { id: '2', question: 'Will Psi Upsilon get suspended before Janurary 4, 2024?', percentage: '48%' },
    { id: '3', question: 'Will any students fail COSC 98 in Fall 2023', percentage: '64%' },
    { id: '4', question: 'Will any stduents fail COSC 1 in Fall 2023', percentage: '97%' }

    // ...
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('BetDetail', { itemId: item.id })}>

      <View style={styles.textContainer}>
        <Text style={styles.questionText}>{item.question}</Text>
      </View>

      <View style={styles.percentageContainer}>
        <Text style={styles.percentageText}>{item.percentage}</Text>
      </View>

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.headerLogo} />
        <Text style={styles.headerText}>ARENA</Text>
        {/* Add dropdown icon here if needed */}
      </View>

      <FlatList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <View style={styles.footer}>
        {/* Add footer navigation icons here */}
        <TouchableOpacity onPress={() => navigation.navigate('Add')}>
          <Image source={addIcon} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={homeIcon} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={profileIcon} style={styles.footerIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row', // added for horizontal arrangement
    alignItems: 'center', // align items vertically center
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 15, // added padding for the logo and text
    backgroundColor: 'black',
  },
  headerLogo: {
    width: 30,
    height: 30,
    marginRight: 10, // added some margin to separate the logo and the text
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold', // made the text bold
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 0.8, // takes up 80% of the item container
  },
  percentageContainer: {
    flex: 0.2, // takes up 20% of the item container
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    color: 'white',
    fontSize: 18,
  },
  percentageText: {
    color: '#34D399',
    fontSize: 30,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'black', // Adjust the background color as needed
  },
  footerIcon: {
    width: 30, // Adjust the width as needed
    height: 30, // Adjust the height as needed
  },
});

export default HomeScreen;