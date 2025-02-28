import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
export const Header = ({
  title,
  onBackPress,
  showBackButton = true,
  style,
  titleStyle,
  rightComponent,
}) => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#20ACE2"
        translucent={false}
      />
      <SafeAreaView style={[styles.container, style]}>
        <View style={styles.contentContainer}>
          <View style={styles.leftContainer}>
            {showBackButton && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBackPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          
          <View style={styles.rightContainer}>
            {rightComponent}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#20ACE2',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
    }),
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 21.78, 
    letterSpacing: 0.36, 
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
    fontFamily: "Inter",
  },
  
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
});