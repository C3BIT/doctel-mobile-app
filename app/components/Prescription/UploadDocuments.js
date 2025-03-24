import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Platform 
} from 'react-native';
import PrescriptionIcon from '../../assets/icons/Prescription.svg';
import UploadIcon from '../../assets/icons/Upload.svg';

const { width, height } = Dimensions.get("window");

const dynamicWidth = (percentage) => (width * percentage) / 100;
const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicFontSize = (size) => (width * size) / 375;

const UploadDocuments = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.documentCard}    onPress={() => navigation.navigate('Prescription')}>
        <View style={styles.iconContainer}>
          <PrescriptionIcon 
            width={dynamicWidth(8)} 
            height={dynamicWidth(8)} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Prescription</Text>
          <Text style={styles.cardSubtitle}>View Your Previous Prescription</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.documentCard}>
        <View style={styles.iconContainer}>
          <UploadIcon 
            width={dynamicWidth(8)} 
            height={dynamicWidth(8)} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Upload</Text>
          <Text style={styles.cardSubtitle}>Upload Lab reports, prescription etc</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: dynamicHeight(1),
    paddingBottom: dynamicHeight(2.5),
  },
  documentCard: {
    width: dynamicWidth(45),
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: dynamicWidth(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: dynamicWidth(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: dynamicFontSize(16),
    fontWeight: '600',
    color: '#333333',
  },
  cardSubtitle: {
    fontSize: dynamicFontSize(12),
    color: '#666666',
    marginTop: dynamicHeight(0.5),
  },
});

export default UploadDocuments;