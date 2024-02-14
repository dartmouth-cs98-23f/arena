// VerifiersScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import verifiersIcon from '../logos/verifiersIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';
import addIcon from '../logos/addIcon.png';

// Mock data for the invitations and in-process items
const mockData = {
    invitations: [
        {
            question: 'Will Hanover, NH get more than 12 inches of snow before January 4, 2024?',
        },
    ],
    inProcess: [
        {
            question: 'Will Psi Upsilon get suspended before January 4, 2024?',
            response: null, // null for unanswered, true for yes, false for no
        },
        {
            question: 'Will any students fail COSC 98 in Fall 2023?',
            response: null,
        },
    ],
};

function VerifiersScreen({ route, navigation }) {

    const apiToken = route.params?.apiToken;

    // Function to handle accept/decline for invitations
    const handleInvitationResponse = (question, accept) => {
        console.log(`Invitation to '${question}' was ${accept ? 'accepted' : 'declined'}.`);
        // Here you would typically update the state or call an API to register the response
    };

    // Function to handle yes/no for in-process verifications
    const handleInProcessResponse = (question, yes) => {
        console.log(`Response to '${question}' was ${yes ? 'Yes' : 'No'}.`);
        // Similar to invitations, update the state or call an API to register the response
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* <View style={styles.container}></View> */}

            <Text style={styles.headerText}>My Verifications</Text>

            <Text style={styles.subheader}>Invitations</Text>
            {mockData.invitations.map((invitation, index) => (
                <View key={index} style={styles.invitationItem}>
                    <Text style={styles.question}>{invitation.question}</Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.button, styles.acceptButton]}
                            onPress={() => handleInvitationResponse(invitation.question, true)}
                        >
                            <Text style={styles.buttonTextBlack}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.declineButton]}
                            onPress={() => handleInvitationResponse(invitation.question, false)}
                        >
                            <Text style={styles.buttonTextBlack}>Decline</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            <Text style={styles.subheader}>In process</Text>
            {mockData.inProcess.map((processItem, index) => (
                <View key={index} style={styles.processItem}>
                    <Text style={styles.question}>{processItem.question}</Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.button, styles.yesButton]}
                            onPress={() => handleInProcessResponse(processItem.question, true)}
                        >
                            <Text style={styles.buttonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.noButton]}
                            onPress={() => handleInProcessResponse(processItem.question, false)}
                        >
                            <Text style={styles.buttonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home', { apiToken: apiToken })}>
                    <Image source={homeIcon} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Question', { apiToken: apiToken })}>
                    <Image source={addIcon} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile', { apiToken: apiToken })}>
                    <Image source={profileIcon} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Verifiers', { apiToken: apiToken })}>
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
