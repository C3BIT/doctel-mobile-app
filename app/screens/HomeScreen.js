import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Dynamic sizing functions for responsive design
const dynamicWidth = (percentage) => (width * percentage) / 100;
const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicFontSize = (size) => (width * size) / 375;

const HomeScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#20ACE2" />
        
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>DOCTEL</Text>
          </View>
          
          <View style={styles.languageSelector}>
            <TouchableOpacity 
              style={[
                styles.languageButton, 
                selectedLanguage === 'EN' && styles.activeLanguage
              ]}
              onPress={() => handleLanguageChange('EN')}
            >
              <Text style={[
                styles.languageText, 
                selectedLanguage === 'EN' ? styles.activeLanguageText : styles.inactiveLanguageText
              ]}>
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.languageButton, 
                selectedLanguage === 'BN' && styles.activeLanguage
              ]}
              onPress={() => handleLanguageChange('BN')}
            >
              <Text style={[
                styles.languageText, 
                selectedLanguage === 'BN' ? styles.activeLanguageText : styles.inactiveLanguageText
              ]}>
                BN
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.question}>
            How are you feeling today?
          </Text>

          <View style={styles.wellnessCard}>
            <View style={styles.cardContent}>
              <View style={styles.scoreSection}>
                <Text style={styles.scoreLabel}>Wellness Score</Text>
                <Text style={styles.scoreValue}>100</Text>
              </View>
              
              <View style={styles.testSection}>
                <View style={styles.testHeader}>
                  <Text style={styles.testTitle}>WELLNESS TEST</Text>
                  <Text style={styles.testScore}>8/10</Text>
                </View>
                <Text style={styles.testDescription}>
                  Lets do all the tests and update score
                </Text>
                <TouchableOpacity>
                  <Text style={styles.moreDetails}>More Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <Image 
          source={require('../assets/leaves.png')} 
          style={styles.leavesBackground}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentContainer}>
      <TouchableOpacity style={styles.appointmentButton}>
          <View style={styles.appointmentContent}>
            <View style={styles.iconContainer}>
              <Image 
                source={require('../assets/calender.png')} 
                style={styles.calendarIcon}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.appointmentText}>Book Appointment</Text>
              <Text style={styles.appointmentSubtext}>View Your Previous Call History</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#20ACE2',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: dynamicWidth(5),
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: dynamicHeight(8),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: dynamicFontSize(18),
    fontWeight: 'bold',
  },
  languageSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 2,
  },
  languageButton: {
    paddingHorizontal: dynamicWidth(2),
    paddingVertical: dynamicHeight(0.5),
    borderRadius: 20,
  },
  activeLanguage: {
    backgroundColor: '#FFFFFF',
  },
  languageText: {
    fontSize: dynamicFontSize(14),
    fontWeight: '600',
  },
  activeLanguageText: {
    color: '#00B0ED',
  },
  inactiveLanguageText: {
    color: '#FFFFFF',
  },
  headerContent: {
    paddingHorizontal: dynamicWidth(5),
    paddingBottom: dynamicHeight(2),
  },
  question: {
    color: '#fff',
    fontSize: dynamicFontSize(18),
    fontWeight: '500',
    marginBottom: dynamicHeight(2),
  },
  wellnessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: dynamicWidth(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
  },
  scoreSection: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dynamicWidth(2),
  },
  scoreLabel: {
    color: '#888',
    fontSize: dynamicFontSize(12),
    marginBottom: dynamicHeight(0.5),
  },
  scoreValue: {
    fontSize: dynamicFontSize(28),
    fontWeight: 'bold',
    color: '#333',
  },
  testSection: {
    width: '60%',
    justifyContent: 'center',
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dynamicHeight(0.5),
  },
  testTitle: {
    color: '#00B0ED',
    fontWeight: 'bold',
    fontSize: dynamicFontSize(14),
  },
  testScore: {
    color: '#00B0ED',
    fontWeight: 'bold',
    fontSize: dynamicFontSize(14),
  },
  testDescription: {
    color: '#666',
    fontSize: dynamicFontSize(12),
    marginBottom: dynamicHeight(1),
  },
  moreDetails: {
    color: '#00B0ED',
    fontSize: dynamicFontSize(12),
    textDecorationLine: 'underline',
  },
  leavesBackground: {
    position: 'absolute',
    right: 0,
    top: dynamicHeight(10),
    width: dynamicWidth(30),
    height: dynamicHeight(15),
    opacity: 0.7,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: dynamicWidth(4),
  },
  appointmentButton: {
    backgroundColor: '#192F5D',
    borderRadius: 12,
    padding: dynamicWidth(4),
    marginBottom: dynamicHeight(2),
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: dynamicWidth(10),
    height: dynamicWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dynamicWidth(4),
  },
  calendarIcon: {
    width: dynamicWidth(5),
    height: dynamicWidth(5),
  },
  appointmentText: {
    color: '#fff',
    fontSize: dynamicFontSize(16),
    fontWeight: '600',
  },
  appointmentSubtext: {
    color: '#fff',
    opacity: 0.8,
    fontSize: dynamicFontSize(12),
    marginTop: dynamicHeight(0.5),
  },
});

export default HomeScreen;