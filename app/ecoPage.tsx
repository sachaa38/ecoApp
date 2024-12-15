import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import colors from './colors';

export default function EconomiesPage() {
  const [dailyExpense, setDailyExpense] = useState('');
  const [frequency, setFrequency] = useState('');
  const [annualSavings, setAnnualSavings] = useState(null);

  const headerImage = require('../assets/images/bgImage.jpg');

  const calculateSavings = () => {
    if (!dailyExpense || !frequency) {
      alert('Veuillez entrer une dépense quotidienne et une fréquence valide.');
      return;
    }

    const daily = parseFloat(dailyExpense);
    const freq = parseInt(frequency, 10);

    if (isNaN(daily) || isNaN(freq) || daily <= 0 || freq <= 0 || freq > 7) {
      alert('Les valeurs doivent être positives et la fréquence entre 1 et 7.');
      return;
    }

    const yearlySavings = daily * freq * 52; // 52 semaines dans une année
    setAnnualSavings(yearlySavings);
  };

  return (
    <ImageBackground source={headerImage} style={styles.container}>
      <Text style={styles.desc}>
        Cette section permet de visualiser les économies possibles en réduisant
        certaines dépenses quotidiennes.
      </Text>
      <Text style={styles.title}>Calculez vos économies annuelles</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Dépense quotidienne (€)"
        value={dailyExpense}
        onChangeText={setDailyExpense}
      />

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Fréquence par semaine (1 à 7)"
        value={frequency}
        onChangeText={setFrequency}
      />

      <TouchableOpacity style={styles.button} onPress={calculateSavings}>
        <Text style={styles.buttonText}>Calculer</Text>
      </TouchableOpacity>

      {annualSavings !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            En évitant cette dépense, vous économiserez environ :
          </Text>
          <Text style={styles.savingsText}>
            {annualSavings.toFixed(2)}€ par an
          </Text>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.bgfoot,
  },
  resultText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  savingsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28a745',
  },
  desc: {
    position: 'absolute',
    top: 150,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
