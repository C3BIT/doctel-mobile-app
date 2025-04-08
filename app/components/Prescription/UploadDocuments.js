import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import PrescriptionIcon from '../../assets/icons/Prescription.svg';
import UploadIcon from '../../assets/icons/Upload.svg';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get("window");
const BASE_WIDTH = 375;

const responsiveWidth = (w) => (width * w) / BASE_WIDTH;
const responsiveFontSize = (size) => (width * size) / BASE_WIDTH;

const UploadDocuments = ({ navigation }) => {
  const { t } = useTranslation();
  const documentTypes = [
    {
      icon: PrescriptionIcon,
      title: t("prescription"),
      subtitle: t("viewPreviousPrescription"),
      navigateTo: 'Prescription'
    },
    {
      icon: UploadIcon,
      title: t("upload"),
      subtitle: t("uploadLabReports"),
      navigateTo: 'Upload'
    }
  ];

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t("uploadDocuments")}</Text>
      <View style={styles.container}>
        {documentTypes.map((item, index) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity 
              key={index}
              style={styles.documentCard}
              onPress={() => navigation.navigate(item.navigateTo)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon width={45} height={45} />
              </View>
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: responsiveWidth(10),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: '700',
    color: '#333333',
    marginBottom: responsiveWidth(10),
    paddingHorizontal: responsiveWidth(16),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: responsiveWidth(16),
    marginHorizontal: responsiveWidth(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: responsiveWidth(10),
  },
  cardTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: '#333333',
    marginBottom: responsiveWidth(4),
  },
  cardSubtitle: {
    fontSize: responsiveFontSize(12),
    color: '#666666',
    lineHeight: responsiveFontSize(16),
  },
});

export default UploadDocuments;