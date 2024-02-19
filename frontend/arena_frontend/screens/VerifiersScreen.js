// VerifiersScreen.js
import React, { useEffect, useState } from 'react';
import { RefreshControl, View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert, ScrollView } from 'react-native';
import verifiersIcon from '../logos/verifiersIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';
import addIcon from '../logos/addIcon.png';

function VerifiersScreen({ route, navigation }) {

    const [refreshing, setRefreshing] = useState(false);

    const [invitations, setInvitations] = useState([]);
    const [inProcess, setInProcess] = useState([]);

    const apiToken = route.params?.apiToken;

    const headers = {
        'access_token': apiToken,
        'Content-Type': 'application/json',
    };
    
    // Fetch invitations and verifications
    useEffect(() => {
        fetchInvitations();
        fetchVerifications();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchInvitations();
        fetchVerifications();
        setRefreshing(false);
    }, []);

    const fetchInvitations = async () => {
        try {
            const response = await fetch('https://api.arena.markets/verifiers/invites/', {
                method: 'GET',
                headers: headers,
            });
            const data = await response.json();
            console.log(data);
            if (data.success.ok) {
                setInvitations(data.bets);
            } else {
                Alert.alert("Error", data.success.error || "Failed to fetch invitations");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchVerifications = async () => {
        try {
            const response = await fetch('https://api.arena.markets/verifiers/verifications/', {
                method: 'GET',
                headers: headers,
            });
            const data = await response.json();
            console.log(data);
            if (data.success.ok) {
                setInProcess(data.bets);
            } else {
                Alert.alert("Error", data.success.error || "Failed to fetch verifications");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateBalances = async (betUuid, resolve) => {
        try {
            const response = await fetch('https://api.arena.markets/bets/settle', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    bet_uuid: betUuid,
                    outcome: resolve
                })
            });
            const data = await response.json();
            console.log(data);
            if (!data.success.ok) {
                console.log(data.success.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Function to handle accept/decline for invitations
    const handleInvitationResponse = async (betUuid, accept) => {
        Alert.alert(
            "Confirm Action",
            `Are you sure you want to ${accept ? 'accept' : 'decline'} this invitation?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Proceed",
                    onPress: async () => {
                        try {
                            const response = await fetch('https://api.arena.markets/verifiers/accept', {
                                method: 'POST',
                                headers: headers,
                                body: JSON.stringify({
                                    bet_uuid: betUuid.toString(),
                                    accept: accept,
                                }),
                            });
                            const data = await response.json();
                            console.log(data);
                            if (data.ok) {
                                Alert.alert("Success", "Invitation response updated successfully");
                                fetchInvitations();
                                fetchVerifications();
                            }
                            else {
                                Alert.alert("Error", data.error || "Failed to update invitation response");
                            }
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Error", "Could not update invitation response");
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };
    

    // Function to handle yes/no for in-process verifications
    const handleInProcessResponse = async (betUuid, resolve) => {
        Alert.alert(
            "Confirm Resolution",
            `Are you sure the result is ${resolve ? 'Yes' : 'No'}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Proceed",
                    onPress: async () => {
                        try {
                            const response = await fetch('https://api.arena.markets/verifiers/resolve', {
                                method: 'POST',
                                headers: headers,
                                body: JSON.stringify({
                                    bet_uuid: betUuid.toString(),
                                    resolve: resolve,
                                }),
                            });
                            const data = await response.json();
                            console.log(data);
                            if (data.ok) {
                                Alert.alert("Success", "Bet resolved successfully");
                                fetchVerifications();
                                updateBalances(betUuid, resolve);
                            }
                            else {
                                Alert.alert("Error", data.error || "Failed to resolve bet");
                            }
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Error", "Could not resolve bet");
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>

            <Text style={styles.headerText}>My Verifications</Text>

            <ScrollView
                contentContainerStyle={styles.scrollViewContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#fff"
                    />
                }>

            <Text style={styles.subheader}>Invitations</Text>
            {invitations.map((invitation, index) => (
                <View key={index} style={styles.invitationItem}>
                    <Text style={styles.question}>{invitation.title}</Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.button, styles.acceptButton]}
                            onPress={() => handleInvitationResponse(invitation.uuid, true)}
                        >
                            <Text style={styles.buttonTextBlack}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.declineButton]}
                            onPress={() => handleInvitationResponse(invitation.uuid, false)}
                        >
                            <Text style={styles.buttonTextBlack}>Decline</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            <Text style={styles.subheader}>In process</Text>
            {inProcess.map((processItem, index) => (
                <View key={index} style={styles.processItem}>
                    <Text style={styles.question}>{processItem.title}</Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.button, styles.yesButton]}
                            onPress={() => handleInProcessResponse(processItem.uuid, true)}
                        >
                            <Text style={styles.buttonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.noButton]}
                            onPress={() => handleInProcessResponse(processItem.uuid, false)}
                        >
                            <Text style={styles.buttonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.replace('Home', { apiToken: apiToken })}>
                    <Image source={homeIcon} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Question', { apiToken: apiToken })}>
                    <Image source={addIcon} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('Profile', { apiToken: apiToken })}>
                    <Image source={profileIcon} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('Verifiers', { apiToken: apiToken })}>
                    <Image source={verifiersIcon} style={styles.footerIcon} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black', // Background color of the entire screen
    },
    scrollViewContainer: {
        flexGrow: 1, // Ensures the container can grow to accommodate its children
        paddingBottom: 60, // Adjust this value to ensure nothing is hidden behind the footer
      },
    headerText: {
        color: 'white', // Text color for the header
        fontSize: 24, // Size of the header text
        fontWeight: 'bold', // Bold font weight for the header text
        textAlign: 'center', // Center the text horizontally
        marginVertical: 20, // Add vertical margin for spacing from the top of the screen
    },
    subheader: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16, // Space below the header for the subheader
        marginBottom: 10, // Space above the content
        marginHorizontal: 16,
    },
    invitationItem: {
        marginBottom: 10,
        padding: 16,
        backgroundColor: 'black', // Card appearance
        borderWidth: 1, // Outline width for the container
    },
    processItem: {
        marginBottom: 10,
        padding: 16,
        backgroundColor: 'black', // Card appearance
        borderWidth: 1, // Outline width for the container
    },
    question: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20, // Rounded corners for buttons
        flexGrow: 1, // Flex to fill available space
        marginHorizontal: 5, // Space between buttons
        backgroundColor: 'black', // Button background color
        fontWeight: 'bold',
        borderColor: '#34D399', // Button border color
        borderWidth: 1, // Button border width
    },
    acceptButton: {

        backgroundColor: 'black', // White background for accept button
        borderColor: '#34D399', // Border color for the button
    },
    declineButton: {
        backgroundColor: 'black', // White background for decline button
        borderColor: '#34D399', // Border color for the button
    },
    yesButton: {

        backgroundColor: '#34D399',
    },
    noButton: {

        backgroundColor: '#34D399',
    },
    buttonText: {
        color: 'black', // Text color for buttons with a black background
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonTextBlack: {
        color: 'white', // Text color for buttons with a white background
        fontWeight: 'bold',
        textAlign: 'center',
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



export default VerifiersScreen;
