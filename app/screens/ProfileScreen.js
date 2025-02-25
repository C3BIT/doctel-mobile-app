import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'lucide-react-native';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Dropdown } from '../components/common/Dropdown';
import { DatePicker } from '../components/common/DatePicker';

export const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: 'Amar name ki',
    bloodGroup: 'O+',
    gender: 'Male',
    dateOfBirth: '1999/09/21',
    mobileNumber: '0123 456 789',
    height: '1.65',
    weight: '48'
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBloodGroupDropdown, setShowBloodGroupDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  const handleUpdate = () => {
    console.log('Profile updated:', profile);
  };

  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '/');
    setProfile({...profile, dateOfBirth: formattedDate});
    setShowDatePicker(false);
  };

  const handleSelectBloodGroup = (value) => {
    setProfile({...profile, bloodGroup: value});
    setShowBloodGroupDropdown(false);
  };

  const handleSelectGender = (value) => {
    setProfile({...profile, gender: value});
    setShowGenderDropdown(false);
  };

  const handleImageUpload = () => {
    console.log('Opening image picker', Platform.OS);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          
          <View style={styles.cardWrapper}>
            <View style={styles.avatarOuterContainer}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require('../assets/avatar.png')}
                  style={styles.avatar}
                />
                <TouchableOpacity 
                  style={styles.cameraIconContainer}
                  onPress={handleImageUpload}
                >
                  <Camera size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.spacer} />
                
                <Input
                  label="First name & Last name"
                  value={profile.name}
                  onChangeText={(text) => setProfile({...profile, name: text})}
                />

                <View style={styles.row}>
                  <Dropdown
                    label="Blood group"
                    value={profile.bloodGroup}
                    options={bloodGroups}
                    onSelect={handleSelectBloodGroup}
                    isOpen={showBloodGroupDropdown}
                    onToggle={() => setShowBloodGroupDropdown(!showBloodGroupDropdown)}
                    containerStyle={styles.halfInput}
                  />
                  <Dropdown
                    label="Gender"
                    value={profile.gender}
                    options={genders}
                    onSelect={handleSelectGender}
                    isOpen={showGenderDropdown}
                    onToggle={() => setShowGenderDropdown(!showGenderDropdown)}
                    containerStyle={styles.halfInput}
                  />
                </View>

                <DatePicker
                  label="Date of birth"
                  value={profile.dateOfBirth}
                  onPress={() => setShowDatePicker(true)}
                  isVisible={showDatePicker}
                  onDateSelect={handleDateSelect}
                  onCancel={() => setShowDatePicker(false)}
                />

                <Input
                  label="Mobile Number"
                  value={profile.mobileNumber}
                  onChangeText={(text) => setProfile({...profile, mobileNumber: text})}
                  keyboardType="phone-pad"
                />

                <View style={styles.row}>
                  <Input
                    label="Height (m)"
                    value={profile.height}
                    onChangeText={(text) => setProfile({...profile, height: text})}
                    keyboardType="decimal-pad"
                    containerStyle={styles.halfInput}
                  />
                  <Input
                    label="Weight (kg)"
                    value={profile.weight}
                    onChangeText={(text) => setProfile({...profile, weight: text})}
                    keyboardType="decimal-pad"
                    containerStyle={styles.halfInput}
                  />
                </View>

                <Button
                  title="Update"
                  onPress={handleUpdate}
                  style={styles.updateButton}
                />
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20ACE2',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardWrapper: {
    position: 'relative',
    paddingTop: 40,
  },
  card: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  avatarOuterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'white',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#20ACE2',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  spacer: {
    height: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  updateButton: {
    backgroundColor: '#223972',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
  }
  
});