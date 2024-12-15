import { useState, useEffect } from 'react';
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import { Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FlatList } from 'react-native';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { Link } from 'expo-router';
import Onglet from './onglet';
import colors from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [showGraph, setShowGraph] = useState(false);
  const [revenu, setRevenu] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [totalDepense, setTotalDepense] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [titre, setTitre] = useState<string>('');
  const [montant, setMontant] = useState<number>(0);
  const [typeDepense, setTypeDepense] = useState<string>('');
  const [depenses, setDepenses] = useState<Depense[]>([]);

  interface Depense {
    id: number;
    titre: string;
    montant: number;
    typeDepense: string;
  }

  const headerImage = require('../assets/images/bgpage4.jpg');
  const bgImage = require('../assets/images/bgpage2.jpg');

  // Sauvegarde des données
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('revenu', JSON.stringify(revenu));
      await AsyncStorage.setItem('depenses', JSON.stringify(depenses));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données', error);
    }
  };

  // Chargement des données au lancement
  const loadData = async () => {
    try {
      const savedRevenu = await AsyncStorage.getItem('revenu');
      const savedDepenses = await AsyncStorage.getItem('depenses');

      if (savedRevenu) setRevenu(JSON.parse(savedRevenu));
      if (savedDepenses) setDepenses(JSON.parse(savedDepenses));
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
    }
  };

  useEffect(() => {
    console.log('Chargement initial :', revenu, depenses);
    loadData();
  }, []);

  useEffect(() => {
    console.log('Sauvegarde déclenchée :', revenu, depenses);
    saveData();
  }, [revenu, depenses]);

  useEffect(() => {
    const sum = depenses
      .map((depense) => Number(depense.montant))
      .reduce((a, b) => a + b, 0);
    setTotalDepense(sum);
  }, [depenses]);

  const handleDelete = (id: number) => {
    setDepenses((prevDepenses) =>
      prevDepenses.filter((depense) => depense.id !== id)
    );
  };

  const handleValidation = () => {
    setIsLocked(!isLocked);
  };

  const handleReset = () => {
    setIsLocked(!isLocked);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const ajouterDepense = () => {
    if (titre.length > 0 && montant > 0 && typeDepense.length > 0) {
      const nouvelleDepense: Depense = {
        id: Date.now(),
        titre,
        montant: Number(montant),
        typeDepense,
      };
      setDepenses([nouvelleDepense, ...depenses]);
      setTitre('');
      setMontant(0);
      setTypeDepense('');
      setModalVisible(!isModalVisible);
    } else {
      alert('Tous les champs doivent être remplis');
    }
  };

  useEffect(() => {
    const sum = depenses
      .map((depense) => Number(depense.montant))
      .reduce((a, b) => a + b, 0);
    setTotalDepense(sum);
  }, [depenses]);

  return isLocked ? (
    <ImageBackground source={bgImage} style={styles.secondPage}>
      <Text style={styles.texte}>Ajoutez vos revenus mensuels</Text>
      <TextInput
        style={styles.input}
        placeholder="Revenus mensuels (€)"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
        value={revenu}
        onChangeText={(text) => {
          setRevenu(text);
        }}
      />
      <TouchableOpacity style={styles.buttonGeneric} onPress={handleValidation}>
        <Text style={styles.textButtonGeneric}>Valider</Text>
      </TouchableOpacity>
    </ImageBackground>
  ) : (
    <View style={styles.homePage}>
      <Button
        color={colors.buttonPrimary}
        title="Modifier le revenu"
        onPress={handleReset}
      />
      <ImageBackground source={headerImage} style={styles.divHeader}>
        <View style={styles.head}>
          <View style={styles.divRevenu}>
            <Text style={{ color: colors.textSecondary }}>Vos revenus</Text>
            <Text style={styles.texteRevenu}>{revenu}€</Text>
          </View>
        </View>
        <View style={styles.totaux}>
          <View style={styles.divNombre}>
            <Text style={styles.texteTotaux}>Dépenses </Text>
            <Text style={styles.texteNbTotaux}>{totalDepense}€</Text>
          </View>
          <View style={styles.divNombre}>
            <Text style={styles.texteTotaux}>Reste </Text>
            <Text
              style={[
                styles.texteNbTotaux,
                {
                  color:
                    revenu - totalDepense < 0
                      ? colors.depense
                      : styles.texteNbTotaux.color,
                },
              ]}
            >
              {revenu - totalDepense}€
            </Text>
          </View>
        </View>
        <View style={styles.navigation}>
          <View style={styles.button}>
            <TouchableOpacity onPress={() => setShowGraph(!showGraph)}>
              <Text style={styles.buttonText}>Répartition des dépenses</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.buttonText}>Ajouter une dépense</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <Link style={styles.buttonText} href="/ecoPage">
              Economisez de l'argent
            </Link>
          </View>
        </View>
      </ImageBackground>
      <View>
        {showGraph ? (
          <View>
            <Modal>
              <Onglet depenses={depenses} totalDepense={totalDepense} />
              <Button
                color={colors.buttonPrimary}
                title="Fermer"
                onPress={() => setShowGraph(!showGraph)}
              />
            </Modal>
          </View>
        ) : null}
      </View>
      <View style={styles.divModalPlusContenair}>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View
            style={{
              marginHorizontal: 15,
              marginVertical: 250,
              padding: 20,
              backgroundColor: colors.textSecondary,
              borderRadius: 10,
            }}
          >
            <Text>Nouvelle dépense</Text>
            <TextInput
              placeholder="Titre"
              value={titre}
              onChangeText={(text) => setTitre(text)}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Montant"
              keyboardType="numeric"
              value={montant}
              onChangeText={(text) => setMontant(text)}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />

            <Text>Type de dépense</Text>
            <Picker
              selectedValue={typeDepense}
              onValueChange={(itemValue) => setTypeDepense(itemValue)}
            >
              <Picker.Item label="Sélectionner..." value="" />
              <Picker.Item label="Loyer" value="Loyer" />
              <Picker.Item label="Alimentation" value="Alimentation" />
              <Picker.Item label="Transport" value="Transport" />
              <Picker.Item label="Loisirs" value="Loisirs" />
              <Picker.Item label="Santé" value="Sante" />
              <Picker.Item label="Éducation" value="Education" />
              <Picker.Item label="Famille" value="Famille" />
              <Picker.Item label="Animaux" value="Animaux" />
              <Picker.Item label="Investissements" value="Investissements" />
              <Picker.Item label="Voyages" value="Voyages" />
              <Picker.Item label="Vétements" value="Vetements" />
              <Picker.Item label="Impôts" value="Impots" />
              <Picker.Item label="Services" value="Services" />
              <Picker.Item label="Dons" value="Dons" />
              <Picker.Item label="Epargne" value="Epargne" />
              <Picker.Item label="Culture" value="Culture" />
              <Picker.Item label="Communication" value="Communication" />
              <Picker.Item label="Autre" value="Autre" />
            </Picker>
            <View style={styles.divButtonModal}>
              <Button
                color={colors.buttonPrimary}
                title="Ajouter"
                onPress={ajouterDepense}
              />
              <Button
                color={colors.depense}
                title="Annuler"
                onPress={() => setModalVisible(!isModalVisible)}
              />
            </View>
          </View>
        </Modal>
        <View style={styles.cardsContainer}>
          {depenses.length > 0 ? (
            <FlatList
              data={depenses}
              renderItem={({ item }) => {
                return (
                  <View style={styles.card}>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.X}>X</Text>
                    </TouchableOpacity>
                    <View style={styles.contentCard}>
                      <View style={styles.headerCard}>
                        <Text style={styles.cardTxt}>{item.titre}</Text>
                        <Text style={styles.cardTxt}>{item.montant}€</Text>
                      </View>
                      <Text style={styles.cardTxtType}>{item.typeDepense}</Text>
                    </View>
                  </View>
                );
              }}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <View>
              <Text style={{ textAlign: 'center' }}>
                Aucune dépense renseignée
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  secondPage: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texte: {
    fontSize: 22,
    marginTop: 20,
    color: colors.textPrimary,
    padding: 20,
    fontWeight: 'bold',
    borderRadius: 8,
    textAlign: 'center',
  },
  homePage: {
    paddingTop: 55,
    backgroundColor: colors.background,
    flex: 1,
  },
  divHeader: {
    borderColor: colors.buttonPrimary,
    paddingBottom: 15,
  },
  head: {
    paddingTop: 0,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  divRevenu: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  texteRevenu: {
    color: colors.textPrimary,
    padding: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  totaux: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 30,
    margin: 20,
  },
  texteTotaux: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  texteNbTotaux: {
    padding: 10,
    color: colors.textPrimary,
    fontWeight: 'bold',
    borderRadius: 8,
    fontSize: 40,
  },
  divNombre: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigation: {
    flexDirection: 'row', // Place les éléments en rangée
    justifyContent: 'space-between', // Espacement égal entre les boutons
    alignItems: 'center', // Centre verticalement les boutons
    width: '100%', // Utilise toute la largeur disponible
    height: 80,
    gap: 5,
    paddingHorizontal: 5,
    paddingTop: 5,
    // backgroundColor: colors.bgfoot,
  },
  button: {
    flex: 1,
    height: '100%',
    backgroundColor: colors.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    paddingHorizontal: 4,
    color: colors.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    position: 'relative',
    width: screenWidth - 20,
    height: 'auto',
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 0,
    paddingTop: 8,
    paddingBottom: 15,
    paddingLeft: 15,
    elevation: 3,
  },
  cardTxt: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '700',
  },
  cardTxtType: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '700',
    backgroundColor: 'orange',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 15,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  X: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 50,
  },
  contentCard: {
    gap: 5,
    justifyContent: 'center',
  },
  divModalPlusContenair: {
    flex: 1,
  },
  cardsContainer: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: colors.bgfoot,
    zIndex: 10,
  },
  buttonGeneric: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 100,
    marginTop: 10,
    borderRadius: 8,
  },
  textButtonGeneric: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: colors.textSecondary,
    marginVertical: 10,
    borderColor: colors.textSecondary,
    backgroundColor: colors.background,
  },
  divButtonModal: {
    gap: 15,
  },
});
