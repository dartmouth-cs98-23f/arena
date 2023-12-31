// BuyTokensScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image } from 'react-native';
import addIcon from '../logos/addIcon.png';
import homeIcon from '../logos/homeIcon.png';
import profileIcon from '../logos/profileIcon.png';
import backArrowIcon from '../logos/backArrowIcon.png';

const tokenPackages = [
    { id: '1', tokens: 100, price: '$0.99' },
    { id: '2', tokens: 500, price: '$4.99' },
    { id: '3', tokens: 1200, price: '$9.99' },
    { id: '4', tokens: 6500, price: '$49.99' },
];

function BuyTokensScreen({ route, navigation }) {
    const [myTokens, setMyTokens] = useState(50); // Initialize myTokens state


    const handleTokenPurchase = async (tokens, price) => {
        const apiToken = '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d';
        const headers = {
            'access_token': apiToken,
            'Content-Type': 'application/json',
        };
        const apiEndpointPost = 'https://arena-backend.fly.dev/user/balance';

        const payload = {
            "additional_balance": tokens,
        };

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        };

        console.log(`Purchased ${tokens} tokens for ${price}.`);

        try {
            await fetch(apiEndpointPost, requestOptions);
            navigation.navigate("Profile", { myTokens });
        } catch (error) {
            console.error('Error during token purchase:', error);
        }
    };

    async function fetchBalance() {
        try {
            const apiToken = '4UMqJxFfCWtgsVnoLgydl_UUGUNe_N7d';
            const headers = {
                'access_token': apiToken,
                'Content-Type': 'application/json',
            };
            const apiEndpoint = 'https://arena-backend.fly.dev/user/balance';
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
            // console.log('myTokens on token purchase screen', myTokens);
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
            {/* Footer Section */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Image source={homeIcon} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Question')}>
                    <Image source={addIcon} style={styles.footerIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image source={profileIcon} style={styles.footerIcon} />
                </TouchableOpacity>
            </View>
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
});

export default BuyTokensScreen;