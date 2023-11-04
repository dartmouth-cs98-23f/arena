// AddScreen.js

import React, { useState } from 'react';
import Slider from '@react-native-community/slider';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';

// Replace with the actual paths to your icons
import addIcon from '../logos/addIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';

function AddScreen({ navigation }) {
    const [question, setQuestion] = useState('');
    const [details, setDetails] = useState('');
    const [odds, setOdds] = useState(50);

    // Function to handle the submit action
    const handleSubmit = () => {
        // Here you would handle the submission of the bet
        console.log('Bet Submitted:', { question, details, odds });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>           Create Bet</Text>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Question</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setQuestion}
                    value={question}
                    placeholder="What's in the arena?"
                    placeholderTextColor="#999" // Placeholder text color
                />

                <Text style={styles.label}>Details</Text>
                <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    onChangeText={setDetails}
                    value={details}
                    multiline
                    placeholder="Specify any definitions in your question, as well as how the bet will be settled."
                    placeholderTextColor="#999" // Placeholder text color
                />

                <Text style={styles.label}>Initial Odds</Text>
                <Slider
                    style={styles.slider}
                    value={odds}
                    onValueChange={value => setOdds(value)}
                    minimumValue={1}
                    maximumValue={99}
                    step={1}
                    minimumTrackTintColor='#34D399' // Slider active track color
                    maximumTrackTintColor='#FFFFFF' // Slider inactive track color
                    thumbTintColor='#34D399' // Slider thumb color
                />
                <Text style={styles.oddsValue}>{`${odds}%`}</Text>

                <Text style={styles.disclaimer}>
                    Please note that all bets are subject to approval by the Arena team before they are made public.
                    Users who submit inflammatory content may be permanently banned.
                </Text>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Image source={homeIcon} style={styles.footerIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Add')}>
                        <Image source={addIcon} style={styles.footerIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Image source={profileIcon} style={styles.footerIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black', // or the color of the page background
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
      },
      container: {
        flex: 1,
        justifyContent: 'space-between', // Ensures footer sticks to bottom
        backgroundColor: 'black',
        paddingHorizontal: 15,
      },
      headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20, // push the content down if SafeAreaView is not enough
        paddingBottom: 10, // additional space from header text to the content
      },
      header: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1, // makes sure it takes up the space between the button and the edge
      },
      submitButton: {
        backgroundColor: '#34D399', // Theme color for the button
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
      },
      submitButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
      },
    label: {
        color: 'white',
        marginLeft: 15,
        marginTop: 15,
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        backgroundColor: 'black',
        color: 'white',
        borderRadius: 5,
        fontSize: 16,
        padding: 10,
        marginHorizontal: 15,
        marginBottom: 15,
    },
    inputMultiline: {
        height: 100, // Adjust the height for multiline input
    },
    slider: {
        marginHorizontal: 15,
        height: 40, // Adjust height if needed
    },
    oddsValue: {
        color: 'white',
        fontSize: 18,
        marginLeft: 15,
        marginBottom: 20,
    },
    disclaimer: {
        color: 'grey',
        fontSize: 12,
        textAlign: 'center',
        marginHorizontal: 15,
    },
    footerIcon: {
        width: 30,
        height: 30,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: 'black',
    },
});

export default AddScreen;