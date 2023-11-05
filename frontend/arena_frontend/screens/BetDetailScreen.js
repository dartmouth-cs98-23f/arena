// BetDetailScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import betDetailGraph from '../logos/betDetailGraph.png';
import addIcon from '../logos/addIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';

function BetDetailScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.flexContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* Replace with your actual icon */}
            <Text style={styles.iconPlaceholder}>🔙</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bet Details</Text>
          {/* Replace with your actual icon */}
          <Text style={styles.iconPlaceholder}>💰50</Text>
        </View>

        {/* Bet Details Section */}
        <Text style={styles.questionTitle}>Will any students fail COSC 98 in Fall 2023?</Text>
        <Text style={styles.oddsTitle}>Current odds</Text>
        <Text style={styles.percentage}>64%</Text>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.yesButton}>
            <Text style={styles.buttonTextYesNo}>Yes</Text>
            <Text style={styles.buttonText}>💰 10</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.noButton}>
            <Text style={styles.buttonTextYesNo}>No</Text>
            <Text style={styles.buttonText}>💰 10</Text>
          </TouchableOpacity>
        </View>

        {/* Graph */}
        <View style={styles.graphContainer}>
          <Image source={betDetailGraph} style={styles.graph} />
        </View>

        {/* Additional Info */}
        <Text style={styles.additionalInfo}>This bet settles to Yes if at least one student enrolled in COSC 98 does not pass the class. Settles to No otherwise.</Text>
      </View>
      {/* Footer Section */}
      <View style={styles.footer}>
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
    padding: 15,
  },
  flexContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30, // added some top margin to lower the header
  },
  backButton: {
    marginRight: 20, // added some margin for better spacing
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  iconPlaceholder: {
    color: 'white',
    fontSize: 20,
  },
  questionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold', // Make the question title bold
    marginBottom: 5,
    textAlign: 'center',
  },
  oddsTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
  },
  percentage: {
    color: '#34D399',
    fontSize: 40, // Increase the font size of the percentage
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  yesButton: {
    backgroundColor: '#34D399',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
  },
  noButton: {
    backgroundColor: '#34D399',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    marginLeft: 10,
  },
  buttonTextYesNo: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold', // Made the text bold as per your request
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
  },
  graph: {
    height: 200,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 392,
    height: 256,
  },
  additionalInfo: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
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

export default BetDetailScreen;


