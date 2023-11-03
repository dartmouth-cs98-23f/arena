// ProfileScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {/* Add your profile details and functionalities here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    color: 'white',
    fontSize: 24,
  },
});

export default ProfileScreen;
