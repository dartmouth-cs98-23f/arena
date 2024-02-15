// AssignVerifierScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import backArrowIcon from '../logos/backArrowIcon.png';


function AssignVerifierScreen({ route, navigation }) {
    const question = route.params?.question;
    const description = route.params?.description;
    const odds = route.params?.odds;
    const [verifierEmail, setVerifierEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const apiToken = route.params?.apiToken;

    const submitBet = async () => {
        try {
            const verifierUuid = await searchForUser(); // Get the verifier's UUID
            const payload = {
                title: question.toString(),
                description: description.toString(),
                win_justification: "...",
                verifier_uuid: verifierUuid.toString(), // Use the verifier's UUID
                odds: odds / 100,
            };

            const headers = {
                'access_token': apiToken,
                'Content-Type': 'application/json',
            };

            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            };

            const apiEndpoint = 'https://api.arena.markets/bets/create';

            const response = await fetch(apiEndpoint, requestOptions);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            const data = await response.json();
            console.log('POST request successful!', data);
            console.log('Bet Submitted:', { question, description, odds, verifierEmail, verifierUuid });
            navigation.navigate('Home', { apiToken : apiToken });
        } catch (error) {
            console.log('An error occurred:', error);
            // If the error was thrown from searchForUser, it will be handled here
            if (error.message === 'Verifier does not exist') {
                console.log('Error', 'Verifier does not exist, please enter a valid email address.');
                Alert.alert("Verifier Not Found", "Verifier does not exist, please enter a valid email address.");
            } else {
                console.log('Error', 'An error occurred while submitting the bet.');
            }
        }
    };


    const searchForUser = async () => {
        const searchEndpoint = 'https://api.arena.markets/user/search'; // Adjust with your actual search API endpoint
        const headers = {
            'access_token': apiToken,
            'Content-Type': 'application/json',
        };
        try {
            const response = await fetch(`${searchEndpoint}?email_query=${encodeURIComponent(verifierEmail)}`, {
                method: 'GET',
                headers: headers,
            });
            const data = await response.json();
            if (data.success.ok && data.user) {
                return data.user.uuid; // Return the UUID of the found user
            } else {
                throw new Error('Verifier does not exist');
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
            throw error; // Re-throw to prevent further execution
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image source={backArrowIcon} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.header}>Create Bet</Text>
                    <TouchableOpacity style={styles.submitButton} onPress={submitBet}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>Assign Verifier</Text>
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setVerifierEmail}
                    value={verifierEmail}
                    placeholder="Enter the email address of the verifier."
                    placeholderTextColor="#999"
                />
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black', // or the color of the page background
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
    backButton: {
        padding: 10,
    },
    backIcon: {
        width: 25, // Adjust the size as needed
        height: 25, // Adjust the size as needed
        resizeMode: 'contain',
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

export default AssignVerifierScreen;