import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image } from 'react-native';
import backArrowIcon from '../logos/backArrowIcon.png';
import { useStripe, PaymentSheet } from '@stripe/stripe-react-native';

const tokenPackages = [
    { id: '1', tokens: 100, price: '$0.99' },
    { id: '2', tokens: 500, price: '$4.99' },
    { id: '3', tokens: 1200, price: '$9.99' },
    { id: '4', tokens: 6500, price: '$49.99' },
];

function BuyTokensScreen({ route, navigation }) {
    // console.log(route.params)
    const [myTokens, setMyTokens] = useState(50); // Initialize myTokens state
    const { initPaymentSheet, presentPaymentSheet } = useStripe(); // Moved inside the component

    const handleTokenPurchase = async (tokens, price) => {
        try {
            // Step 1: Create the Payment Intent

            const amountInCents = Math.round(parseFloat(price.replace('$', '')) * 100);

            // Update with your FastAPI backend endpoint for creating a payment intent
            const apiToken = route.params?.apiToken;
            const createIntentResponse = await fetch('https://api.arena.markets/stripe/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': apiToken, // Assume this is your authentication method
                },
                body: JSON.stringify({ amount: amountInCents }),
            });
    
            if (!createIntentResponse.ok) {
                throw new Error(`Failed to create payment intent, status: ${createIntentResponse.status}`);
            }
    
            const { clientSecret } = await createIntentResponse.json();
    
            // Initialize and present the payment sheet with the client secret
            const { error: initError } = await initPaymentSheet({ paymentIntentClientSecret: clientSecret });
            if (initError) {
                throw new Error(`Error initializing payment sheet: ${initError.message}`);
            }
    
            const { error: presentError } = await presentPaymentSheet();
            if (presentError) {
                throw new Error(`Error presenting payment sheet: ${presentError.message}`);
            }
    
            console.log('Payment successful, updating token balance...');
    
            // Step 2: Update User's Balance after successful payment

            fetchBalance();
            navigation.reset({
                index: 0, // Resets the stack to have only the new route
                routes: [{ name: 'Home', params: { apiToken: apiToken } }],
            });
    
        } catch (error) {
            console.log(`Error during token purchase and balance update: ${error.message}`);
        }
    };
    

    async function fetchBalance() {
        try {
            const apiToken = route.params?.apiToken;
            const headers = {
                'access_token': apiToken,
                'Content-Type': 'application/json',
            };
            console.log("api token when fetch balance: " + apiToken)
            const apiEndpoint = 'https://api.arena.markets/user/balance';
            const requestOptions = {
                method: 'GET',
                headers: headers,
            };
            const response = await fetch(apiEndpoint, requestOptions);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            const data = await response.json();
            // console.log('Buy Tokens Screen Balance fetched successfully!', data.balance);
            setMyTokens(data.balance); // Update the myTokens state with the fetched balance
            console.log('myTokens on token purchase screen', myTokens);
            console.log('myTokens on data.balance purchase screen', myTokens);

        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    useEffect(() => {
        fetchBalance();
    });

    const renderTokenPackage = ({ item }) => (
        <TouchableOpacity
            style={styles.tokenPackage}
            onPress={() => handleTokenPurchase(item.tokens, item.price)}
        >
            <Text style={styles.tokenAmount}>{item.tokens}</Text>
            <Text style={styles.tokenPrice}>{item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image source={backArrowIcon} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Buy Tokens</Text>
                <Text style={styles.coinBalance}>💰{myTokens}</Text>
            </View>
            <FlatList
                data={tokenPackages}
                renderItem={renderTokenPackage}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.tokenGrid}
            />
            <Text style={styles.descriptionText}>There's no cash out available. Any proceeds will be donated to charity. Look at the help section to see our blog with more details about donating.</Text>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    backButton: {
        padding: 10, // For easier touch
    },
    backIcon: {
        fontSize: 25,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    coinBalance: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    tokenGrid: {
        alignItems: 'center',
        padding: 15,
    },
    tokenPackage: {
        width: '48%',
        backgroundColor: '#1A1A1A',
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        borderRadius: 8,
        margin: '1%', // Add a 1% margin for space between the items
    },
    tokenAmount: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    tokenPrice: {
        color: 'white',
        fontSize: 18,
    },
    footer: {
        position: 'absolute', // Ensures footer sticks to the bottom
        bottom: 0, // Align to the bottom
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'black',
        borderTopWidth: 1, // Add a border top if needed for design
        paddingVertical: 10, // Padding inside the footer
    },
    footerIcon: {
        width: 30,
        height: 30,
    },
    backButton: {
        padding: 10,
    },
    backIcon: {
        width: 25, // Adjust the size as needed
        height: 25, // Adjust the size as needed
        resizeMode: 'contain',
    },
    descriptionText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'normal', // or 'bold' if you prefer
        padding: 75, // Adjust the padding as needed
        textAlign: 'center', // Center the text if you like
      },
});

export default BuyTokensScreen;