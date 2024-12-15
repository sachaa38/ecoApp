import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import colors from './colors';

interface Depense {
  id: number;
  titre: string;
  montant: number;
  typeDepense: string;
}

interface OngletProps {
  depenses: Depense[];
  totalDepense: number;
}

const Onglet: React.FC<OngletProps> = ({ depenses, totalDepense }) => {
  const groupedDepenses = depenses.reduce(
    (acc: Record<string, number>, depense) => {
      acc[depense.typeDepense] =
        (acc[depense.typeDepense] || 0) + Number(depense.montant);
      return acc;
    },
    {}
  );

  const chartData = Object.keys(groupedDepenses).map((key, index) => {
    const amount = groupedDepenses[key];
    return {
      name: `${key}`,
      amount,
      color: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#C9CBCF',
        '#6A5ACD',
        '#00FA9A',
        '#FF4500',
        '#DA70D6',
        '#8A2BE2',
        '#00CED1',
        '#FFD700',
        '#87CEEB',
        '#A52A2A',
        '#7FFF00',
        '#DC143C',
      ][index % 18],
      legendFontColor: colors.textSecondary,
      legendFontSize: 12,
    };
  });

  const headerImage = require('../assets/images/bgpage3.jpg');

  return (
    <ImageBackground source={headerImage} style={styles.container}>
      <Text style={styles.title}>Répartition des dépenses</Text>
      {chartData.length > 0 ? (
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={Dimensions.get('window').width - 10}
            height={220}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute={false}
            chartConfig={{
              backgroundColor: '#1E2923',
              backgroundGradientFrom: '#1E2923',
              backgroundGradientTo: '#08130D',
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            }}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>Détails</Text>
            <View style={styles.legendContainer}>
              {chartData.map((item, index) => (
                <Text key={index} style={styles.legendText}>
                  {item.name}: {item.amount.toFixed(2)}€
                </Text>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.noData}>Aucune donnée disponible</Text>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsContainer: {
    marginTop: 50,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  noData: {
    marginTop: 20,
    color: colors.textSecondary,
  },
  chartContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 0,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginTop: 0,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginHorizontal: 5,
    marginBottom: 5,
  },
});

export default Onglet;
