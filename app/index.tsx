import { Button, Pressable, Text, View, ImageBackground } from 'react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import colors from './colors';

export default function Index() {
  const headerImage = require('../assets/images/bgImage.jpg');
  return (
    <View style={styles.bgFond}>
      <ImageBackground source={headerImage} style={styles.container}>
        <Text style={styles.title}>EcoApp</Text>
        <Text style={styles.desc}>
          Prenez le contrôle de vos finances grâce à notre application !
          Analysez vos dépenses, éliminez les superflus et commencez à
          économiser efficacement pour ce qui compte vraiment.
        </Text>

        <Link style={styles.button} href="/home">
          Commencer
        </Link>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  bgFond: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 15,

    marginTop: '15%',
    gap: 25,
    flex: 1,
    overflow: 'hidden',
  },
  title: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    padding: 10,
    marginTop: 150,
    textAlign: 'center',
    fontSize: 35,
  },
  desc: {
    textAlign: 'center',
    marginTop: -20,
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 5,
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    padding: 20,
    margin: 70,
    marginTop: 150,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
    borderRadius: 8,
  },
});
