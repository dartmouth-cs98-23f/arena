// QuestionScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import backArrowIcon from '../logos/backArrowIcon.png';


function QuestionScreen({ route, navigation }) {
    const [question, setQuestion] = useState('');

    const goToNextStep = () => {
        if (question.trim() === '') {
            // If the question is empty, show an alert and do not navigate
            Alert.alert('Blank Question', 'Please enter a question before proceeding.');
        } else {
            // If the question is not empty, proceed with navigation
            navigation.navigate('Description', { question: question, apiToken: route.params?.apiToken });
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
                    <TouchableOpacity style={styles.nextButton} onPress={goToNextStep}>
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>Question</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setQuestion}
                    value={question}
                    placeholder="What's the question?"
                    placeholderTextColor="#999"
                />
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
    backButton: {
        padding: 10,
    },
    backIcon: {
        width: 25, // Adjust the size as needed
        height: 25, // Adjust the size as needed
        resizeMode: 'contain',
    },
    nextButton: {
        backgroundColor: '#34D399', // Theme color for the button
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    nextButtonText: {
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

export default QuestionScreen;