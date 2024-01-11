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

function VerifiersScreen({ navigation }) {
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
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.declineButton]}
                            onPress={() => handleInvitationResponse(invitation.question, false)}
                        >
                            <Text style={styles.buttonText}>Decline</Text>
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
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Image source={homeIcon} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Add')}>
                    <Image source={addIcon} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image source={profileIcon} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Verifiers')}>
                    <Image source={verifiersIcon} style={styles.footerIcon} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black', // Use the same background color as HomeScreen
         padding: 10,
    },
    container: {
        flex: 1, // Takes up the entire safe area
    },
    header: {
        flexDirection: 'row', // Aligns items horizontally
        alignItems: 'center', // Centers items vertically within the header
        justifyContent: 'center', // Centers the header content horizontally
        padding: 15, // Padding inside the header, which creates space around the content
    },
    headerText: {
        color: 'white', // Text color for the header
        fontSize: 30, // Size of the header text
        fontWeight: 'bold', // Bold font weight for the header text
        marginBottom: 20, // Additional space below the header text if needed
        alignSelf: 'center',
    },
    subheader: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16, // Space below the header for the subheader
    },
    invitationItem: {
        marginBottom: 10,
        padding: 16,
        backgroundColor: '#1A1A1A', // Card appearance
    },
    processItem: {
        marginBottom: 10,
        padding: 16,
        backgroundColor: '#1A1A1A', // Card appearance
    },
    question: {
        color: '#FFF',
        fontSize: 16,
        marginBottom: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10, // Space above the button group
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25, // Rounded corners
        flexGrow: 1, // Flex to fill available space
        marginHorizontal: 5, // Space between buttons
    },
    acceptButton: {
        backgroundColor: '#34C759', // Green button
    },
    declineButton: {
        backgroundColor: '#FF3B30', // Red button
    },
    yesButton: {
        backgroundColor: '#34C759', // Green button
    },
    noButton: {
        backgroundColor: '#FF3B30', // Red button
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',  // Position the footer absolutely
        bottom: 0,            // Align it to the bottom of the parent container
        left: 0,              // Align it to the left of the parent container
        right: 0,             // Align it to the right of the parent container
        paddingVertical: 20,  // Padding at top and bottom
        backgroundColor: 'black',
    },
    footerIcon: {
        width: 30,
        height: 30,
    },
      
});



export default VerifiersScreen;
