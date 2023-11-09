import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import BetsListScreen from './screens/BetsListScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import WalletScreen from './screens/WalletScreen';
import HomeScreen from './screens/HomeScreen';
import BetDetailScreen from './screens/BetDetailScreen';
import AddScreen from './screens/AddScreen';
import BuyTokensScreen from './screens/BuyTokensScreen';

import addIcon from './logos/addIcon.png';
import homeIcon from './logos/homeIcon.png';
import profileIcon from './logos/profileIcon.png';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = homeIcon;
          else if (route.name === 'Add') iconName = addIcon;
          else if (route.name === 'Profile') iconName = profileIcon;
          return <Image source={iconName} style={{ width: 30, height: 30 }} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {/* Add more Tab.Screen components here for other tabs */}
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} // Hide the header globally
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Bets List" component={BetsListScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="BetDetail" component={BetDetailScreen} />
        <Stack.Screen name="Add" component={AddScreen} />
        <Stack.Screen name="BuyTokens" component={BuyTokensScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
