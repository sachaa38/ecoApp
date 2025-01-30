import { useState, useEffect } from 'react';
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ProgressBarAndroidBase,
  ScrollView,
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
import * as Progress from 'react-native-progress';

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
  const [previsonOpen, setPrevisionOpen] = useState(true);

  // depenses réelles

  const [totalDepenseReelle, setTotalDepenseReelle] = useState(0);
  const [depensesReelles, setDepensesReelles] = useState<Depense[]>([]);
  const [modalDepReelle, setModalDepReelle] = useState(false);

  //Details

  const [modalDetails, setModalDetails] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);

  //Historique

  const [modalAlert, setModalAlert] = useState(false);

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
      await AsyncStorage.setItem(
        'depensesReelles',
        JSON.stringify(depensesReelles)
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données', error);
    }
  };

  // Chargement des données au lancement
  const loadData = async () => {
    try {
      const savedRevenu = await AsyncStorage.getItem('revenu');
      const savedDepenses = await AsyncStorage.getItem('depenses');
      const savedDepensesReelles =
        await AsyncStorage.getItem('depensesReelles');

      if (savedRevenu) setRevenu(JSON.parse(savedRevenu));
      if (savedDepenses) setDepenses(JSON.parse(savedDepenses));
      if (savedDepensesReelles)
        setDepensesReelles(JSON.parse(savedDepensesReelles));
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [revenu, depenses, depensesReelles]);

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

  const handleDelete2 = (id: number) => {
    setDepensesReelles((prevDepenses) =>
      prevDepenses.filter((depense) => depense.id !== id)
    );
  };

  const handleValidation = () => {
    if (revenu >= 0) {
      setIsLocked(!isLocked);
    } else {
      setRevenu(0);
      setIsLocked(!isLocked);
    }
  };

  const handleReset = () => {
    setIsLocked(!isLocked);
  };

  const handleDeleteData = () => {
    setDepensesReelles([]);
    setModalAlert(!modalAlert);
  };

  const toggleAlert = () => {
    setModalAlert(!modalAlert);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleReelle = () => {
    setModalDepReelle(!modalDepReelle);
  };

  const toggleDetails = (selectedKey) => {
    if (
      depensesReelles.filter((depR) => depR.typeDepense === selectedKey)
        .length == 0
    ) {
      setModalDetails(false);
    } else {
      setModalDetails(!modalDetails);
    }
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

  useEffect(() => {
    const sumReelle = depensesReelles
      .map((depense) => Number(depense.montant))
      .reduce((a, b) => a + b, 0);
    setTotalDepenseReelle(sumReelle);
  }, [depensesReelles]);

  const calculerTotauxParType = () => {
    const totaux = depensesReelles.reduce(
      (acc, depense) => {
        const { typeDepense, montant } = depense;

        if (!acc[typeDepense]) {
          acc[typeDepense] = 0; // Initialise le total pour ce type de dépense
        }

        acc[typeDepense] += montant; // Ajoute le montant à ce type
        return acc;
      },
      {} as Record<string, number>
    );

    return totaux;
  };

  let totauxParType = calculerTotauxParType();

  const calculerTotauxParTypePrev = () => {
    const totaux = depenses.reduce(
      (acc, depense) => {
        const { typeDepense, montant } = depense;

        if (!acc[typeDepense]) {
          acc[typeDepense] = 0; // Initialise le total pour ce type de dépense
        }

        acc[typeDepense] += montant; // Ajoute le montant à ce type
        return acc;
      },
      {} as Record<string, number>
    );

    return totaux;
  };

  let totauxParTypePrev = calculerTotauxParTypePrev();

  const ajouterDepenseReelle = () => {
    if (titre.length > 0 && montant > 0 && typeDepense.length > 0) {
      const nouvelleDepenseReelle: Depense = {
        id: Date.now(),
        titre,
        montant: Number(montant),
        typeDepense,
      };
      if (!totauxParTypePrev[typeDepense]) {
        const nouvelleDepense: Depense = {
          id: Date.now(),
          titre: '(Imprévu)',
          montant: Number(0),
          typeDepense: typeDepense,
        };
        setDepenses([nouvelleDepense, ...depenses]);
        setTitre('');
        setMontant(0);
        setTypeDepense('');
      }

      setDepensesReelles([nouvelleDepenseReelle, ...depensesReelles]);

      setTitre('');
      setMontant(0);
      setTypeDepense('');
      setModalDepReelle(!modalDepReelle);
    } else {
      alert(
        'Tous les champs doivent être remplis. Pour les chiffres à virgule, utilisez le point.'
      );
    }
  };

  return isLocked ? (
    <View style={styles.bgFond}>
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
        <TouchableOpacity
          style={styles.buttonGeneric}
          onPress={handleValidation}
        >
          <Text style={styles.textButtonGeneric}>Valider</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  ) : (
    <View style={styles.bgFond}>
      <View style={styles.homePage}>
        <TouchableOpacity
          onPress={previsonOpen ? handleReset : toggleAlert}
          style={styles.btnModif}
        >
          {/* ? handleReset() : */}
          <Text style={styles.textModif}>
            {previsonOpen
              ? 'Modifier le revenu'
              : 'Effacer toutes les dépenses'}
          </Text>
        </TouchableOpacity>

        <View style={styles.navContainerButton}>
          <TouchableOpacity
            style={[styles.buttonNav, previsonOpen && styles.buttonNavAct]}
            onPress={() => {
              setPrevisionOpen(true);
            }}
          >
            <Text style={[styles.textNav, previsonOpen && styles.textNavAct]}>
              Prévision
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonNav, !previsonOpen && styles.buttonNavAct]}
            onPress={() => setPrevisionOpen(false)}
          >
            <Text style={[styles.textNav, !previsonOpen && styles.textNavAct]}>
              Dépenses réélles
            </Text>
          </TouchableOpacity>
        </View>
        {previsonOpen ? (
          <View style={{ flex: 1 }}>
            <ImageBackground source={headerImage} style={styles.divHeader}>
              <View style={styles.head}>
                <View style={styles.divRevenu}>
                  <Text style={{ color: colors.textSecondary }}>
                    Vos revenus
                  </Text>
                  <Text style={styles.texteRevenu}>{revenu}€</Text>
                </View>
              </View>
              <View style={styles.totaux}>
                <View style={styles.divNombre}>
                  <Text style={styles.texteTotaux}>Vos prévisions</Text>
                  <Text style={styles.texteNbTotaux}>
                    {totalDepense >= 1000000
                      ? `${(totalDepense / 1000000).toFixed(2)}M`
                      : totalDepense.toFixed(2)}
                    €
                  </Text>
                </View>
                <View style={styles.divNombre}>
                  <Text style={styles.texteTotaux}>Montant disponible</Text>
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
                    {revenu - totalDepense >= 1000000
                      ? `${((revenu - totalDepense) / 1000000).toFixed(2)}M`
                      : (revenu - totalDepense).toFixed(2)}
                    €
                  </Text>
                </View>
              </View>
              <View style={styles.navigation}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => setShowGraph(!showGraph)}>
                    <Text style={styles.buttonText}>
                      Répartition des dépenses
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.button}>
                  <TouchableOpacity onPress={toggleModal}>
                    <Text style={styles.buttonText}>Ajouter une prévision</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.button}>
                  <Link style={styles.buttonText} href="/ecoPage">
                    Economisez de l'argent
                  </Link>
                </View>
              </View>
            </ImageBackground>
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
                          <Text style={styles.cardTxtType}>
                            {item.typeDepense}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  style={styles.flatList}
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
        ) : (
          //  ********************** PAGE DEPENSES REELLES **********************
          <View style={{ flex: 1 }}>
            <ImageBackground source={headerImage} style={styles.divHeader}>
              <View style={styles.head}>
                <View style={styles.divRevenu}>
                  <Text style={{ color: colors.textSecondary }}>
                    Vos prévisions
                  </Text>
                  <Text style={styles.texteRevenu}>{totalDepense}€</Text>
                </View>
              </View>
              <View style={styles.totaux}>
                <View style={styles.divNombre}>
                  <Text style={styles.texteTotaux}>Déjà dépensé</Text>
                  <Text style={styles.texteNbTotaux}>
                    {totalDepenseReelle >= 1000000
                      ? `${(totalDepenseReelle / 1000000).toFixed(2)}M`
                      : totalDepenseReelle.toFixed(2)}
                    €
                  </Text>
                </View>
                <View style={styles.divNombre}>
                  <Text style={styles.texteTotaux}>Reste à dépenser </Text>
                  <Text
                    style={[
                      styles.texteNbTotaux,
                      {
                        color:
                          totalDepense - totalDepenseReelle < 0
                            ? colors.depense
                            : styles.texteNbTotaux.color,
                      },
                    ]}
                  >
                    {totalDepense - totalDepenseReelle >= 1000000
                      ? `${((totalDepense - totalDepenseReelle) / 1000000).toFixed(2)}M`
                      : (totalDepense - totalDepenseReelle).toFixed(2)}
                    €
                  </Text>
                </View>
              </View>
              <View style={styles.navigation}>
                {/* <View style={styles.button}>
                <TouchableOpacity onPress={() => toggleHisto()}>
                  <Text style={styles.buttonText}>Historique</Text>
                </TouchableOpacity>
              </View> */}
                <View style={styles.button}>
                  <TouchableOpacity onPress={toggleReelle}>
                    <Text style={styles.buttonText}>Ajouter une dépense</Text>
                  </TouchableOpacity>
                </View>
                {/* <View style={styles.button}>
                <Link style={styles.buttonText} href="/ecoPage">
                  Autre
                </Link>
              </View> */}
              </View>
            </ImageBackground>
            <View style={styles.cardsContainer}>
              {depenses.length > 0 ? (
                <ScrollView
                  style={styles.flatList}
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  {Object.entries(totauxParTypePrev).map(([key, value]) => (
                    <View key={key} style={styles.card}>
                      <TouchableOpacity
                        style={styles.contentCard}
                        onPress={() => {
                          setSelectedKey(key);
                          toggleDetails(key);
                        }}
                      >
                        <Text style={styles.cardTxtType}>{key}</Text>

                        <View
                          style={[
                            styles.headerCard,
                            { justifyContent: 'flex-start' },
                          ]}
                        >
                          <Text style={styles.cardTxt}>
                            {!totauxParType[key] ? 0 : totauxParType[key]}€
                          </Text>
                          <View style={styles.progressBarView}>
                            <Progress.Bar
                              progress={
                                !totauxParType[key]
                                  ? 0
                                  : (totauxParType[key] * 100) /
                                    totauxParTypePrev[key] /
                                    100
                              }
                              width={screenWidth * 0.48}
                              height={10}
                              color={
                                totauxParType[key] / totauxParTypePrev[key] >= 1
                                  ? 'red' // Rouge à 100 %
                                  : totauxParType[key] /
                                        totauxParTypePrev[key] >
                                      0.8
                                    ? 'orange' // Orange proche de 100 %
                                    : 'rgb(22, 185, 214)' // Autres cas
                              }
                            />
                          </View>
                          <Text style={styles.cardTxt}>
                            {totauxParTypePrev[key]}€
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* ******************* MODALE DETAILS ***************** */}
                      <View>
                        <Modal
                          visible={modalDetails}
                          transparent={true}
                          animationType="none"
                        >
                          <View
                            style={[
                              styles.cardsContainer,
                              {
                                marginVertical: 150,
                                marginHorizontal: 30,
                                borderWidth: 3,
                                borderColor: 'orange',
                                borderRadius: 10,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.cardTxtType,
                                {
                                  marginLeft: 10,
                                  paddingVertical: 10,
                                  paddingHorizontal: 20,
                                  borderRadius: 20,
                                },
                              ]}
                            >
                              {selectedKey}
                            </Text>
                            <ScrollView>
                              {depensesReelles
                                .filter(
                                  (depR) => depR.typeDepense === selectedKey
                                )
                                .map((depR) => (
                                  <View
                                    style={[styles.card, { height: 70 }]}
                                    key={depR.id}
                                  >
                                    <TouchableOpacity
                                      onPress={() => handleDelete2(depR.id)}
                                      style={styles.deleteButton}
                                    >
                                      <Text style={styles.X}>X</Text>
                                    </TouchableOpacity>

                                    <View
                                      style={[
                                        styles.contentCard,
                                        { justifyContent: 'center' },
                                      ]}
                                    >
                                      <View style={styles.headerCard}>
                                        <Text
                                          style={[
                                            styles.cardTxt,
                                            {
                                              width: '40%',
                                              overflow: 'hidden',
                                            },
                                          ]}
                                          numberOfLines={1}
                                        >
                                          {depR.titre}
                                        </Text>

                                        <Text style={styles.cardTxt}>
                                          {depR.montant}€
                                        </Text>
                                        <Text style={styles.cardTxt}>
                                          {new Date(depR.id).toLocaleString(
                                            'fr-FR',
                                            {
                                              day: '2-digit',
                                              month: '2-digit',
                                            }
                                          )}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                ))}
                            </ScrollView>
                            <Button
                              color={colors.depense}
                              title="Annuler"
                              onPress={() => setModalDetails(!modalDetails)}
                            />
                          </View>
                        </Modal>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View>
                  <Text style={{ textAlign: 'center' }}>
                    Aucune dépense renseignée
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

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
            <View style={styles.modal}>
              <Text style={styles.titleModal}>Nouvelle prévision</Text>
              <TextInput
                placeholder="Titre"
                value={titre}
                onChangeText={(text) => setTitre(text)}
                style={styles.inputModal}
              />
              <TextInput
                placeholder="Montant"
                keyboardType="numeric"
                value={montant}
                onChangeText={(text) => setMontant(text)}
                style={styles.inputModal}
              />

              <Text>Type de dépense</Text>
              <Picker
                selectedValue={typeDepense}
                onValueChange={(itemValue) => setTypeDepense(itemValue)}
                style={styles.picker}
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
        </View>

        {/* DEPENSES REELLES */}

        <View style={styles.divModalPlusContenair}>
          <Modal
            visible={modalDepReelle}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modal}>
              <Text style={styles.titleModal}>Nouvelle dépense</Text>
              <TextInput
                placeholder="Titre"
                value={titre}
                onChangeText={(text) => setTitre(text)}
                style={styles.inputModal}
              />
              <TextInput
                placeholder="Montant"
                keyboardType="numeric"
                value={montant}
                onChangeText={(text) => setMontant(text)}
                style={styles.inputModal}
              />

              <Text>Type de dépense</Text>
              <Picker
                selectedValue={typeDepense}
                onValueChange={(itemValue) => setTypeDepense(itemValue)}
                style={styles.picker}
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
                  onPress={ajouterDepenseReelle}
                />
                <Button
                  color={colors.depense}
                  title="Annuler"
                  onPress={() => setModalDepReelle(!modalDepReelle)}
                />
              </View>
            </View>
          </Modal>
        </View>
        <View>
          <Modal visible={modalAlert} transparent={true} animationType="slide">
            <View style={styles.modalAlert}>
              <Text style={styles.titleAlert}>ATTENTION !</Text>
              <Text style={styles.textAlert}>
                Vous êtes sur le point d'effacer vos dépenses. Voulez vous
                continuer ?
              </Text>
              <View style={styles.btnContAlert}>
                <TouchableOpacity
                  style={styles.btnAlert}
                  onPress={handleDeleteData}
                >
                  <Text style={styles.btnTxtAlert}>Continuer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnAlert}
                  onPress={() => setModalAlert(!modalAlert)}
                >
                  <Text style={styles.btnTxtAlert}>Retour</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalAlert: {
    backgroundColor: 'white', // Arrière-plan blanc pour mieux contraster
    marginHorizontal: 20,
    marginTop: '30%', // Pour centrer la modal verticalement
    padding: 20,
    borderRadius: 10, // Ajoute des bords arrondis
    elevation: 10, // Pour une ombre portée
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'red',
  },
  titleAlert: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red', // Titre en rouge pour attirer l'attention
    marginBottom: 10, // Un peu d'espace sous le titre
  },
  textAlert: {
    fontSize: 16,
    marginBottom: 20, // Un peu d'espace sous le texte
    color: '#333', // Couleur de texte un peu plus douce
  },
  btnContAlert: {
    flexDirection: 'row',
    gap: 30,
  },
  btnAlert: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxtAlert: {
    color: 'white',
    fontSize: 16,
  },
  secondPage: {
    flex: 1, // Remplit tout l'écran
    width: '100%', // Limite horizontale
    height: '100%', // Limite verticale
    resizeMode: 'cover', // Pour ajuster l'image à l'écran
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '15%',
    overflow: 'hidden',
    borderRadius: 15,
  },

  progressBarView: {
    height: 5,
    justifyContent: 'center',
    alignItems: 'stretch',
    // width: '70%',
    // gap: 10,
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
    marginTop: '15%',
    flex: 1,
    maxHeight: '100%',
    backgroundColor: colors.bgfoot,
    overflow: 'hidden',
    borderRadius: 15,
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
    fontSize: 30,
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
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: colors.buttonPrimary,
    height: 90,
    paddingVertical: 15,
    paddingHorizontal: 15,
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
    alignItems: 'center',
    gap: 10,
    paddingRight: 50,
  },
  contentCard: {
    gap: 5,
    justifyContent: 'center',
    paddingTop: 6,
  },
  divModalPlusContenair: {
    flex: 1,
  },
  cardsContainer: {
    height: screenHeight / 2,
    paddingVertical: 10,
    backgroundColor: colors.bgfoot,
    zIndex: 0,
    paddingBottom: 10,
  },
  flatList: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
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
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
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
    marginTop: 20,
  },

  // Navigation

  btnModif: {
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    padding: 10,
  },

  navContainerButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonNav: {
    backgroundColor: colors.buttonSecondary,
    padding: 20,
    width: '50%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
  },
  buttonNavAct: {
    backgroundColor: colors.buttonActivated,
    padding: 20,
    width: '50%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  textNav: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  textNavAct: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textModif: {
    fontSize: 16,
  },
  modal: {
    marginHorizontal: 15,
    marginBottom: 220,
    marginTop: '5%',
    padding: 20,
    borderWidth: 5,
    borderColor: 'orange',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  titleModal: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.buttonPrimary,
  },
  inputModal: {
    marginTop: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  picker: {
    height: 60,
    backgroundColor: '#e3e3e3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 8,
    marginBottom: 10,
  },
  bgFond: {
    flex: 1,
    backgroundColor: 'black',
  },
});
