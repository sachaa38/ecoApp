import { Button, Pressable, Text, View, ImageBackground } from 'react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import colors from './colors';

export default function Index() {
  const headerImage = require('../assets/images/bgImage.jpg');
  return (
    <ImageBackground source={headerImage} style={styles.container}>
      <Text style={styles.title}>Coin Calculator</Text>
      <Text style={styles.desc}>
        Prenez le contrôle de vos finances grâce à notre application ! Analysez
        vos dépenses, éliminez les superflus et commencez à économiser
        efficacement pour ce qui compte vraiment.
      </Text>

      <Link style={styles.button} href="/home">
        Commencer
      </Link>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    gap: 25,
    flex: 1,
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
    color: colors.textSecondary,
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
