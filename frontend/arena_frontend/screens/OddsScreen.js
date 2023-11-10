// DescriptionScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';
import homeIcon from '../logos/homeIcon.png';
import addIcon from '../logos/addIcon.png';
import profileIcon from '../logos/profileIcon.png';

function DescriptionScreen({ route, navigation }) {
  const { question, description } = route.params;
  const [odds, setOdds] = useState(50);

  const apiToken = '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d';
    const submitBet = () => {
        // Pass the question state to the next screen
        console.log('Bet Submitted:', { question, description, odds });
        payload = {
            "title": question.toString(),
            "description": "...",
            "win_justification": "...",
            "verifier_uuid": "...",
            "odds": odds / 100
        };

        // Set the headers for the request
        const headers = {
            'access_token': apiToken,
            'Content-Type': 'application/json',
        };

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
          };

        const apiEndpoint = 'https://arena-backend.fly.dev/bets/create';

        fetch(apiEndpoint, requestOptions)
            .then((response) => {
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
            })
            .then((data) => {
            console.log('POST request successful!');
            // Handle the response data here if needed
            console.log(data);
            })
            .catch((error) => {
            console.error('An error occurred:', error);
        });

        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>           Create Bet</Text>
                    <TouchableOpacity style={styles.submitButton} onPress={submitBet}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
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
                <TouchableOpacity onPress={submitBet} style={styles.button}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
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
        fontSize: 24,
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

export default DescriptionScreen;
