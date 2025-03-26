import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  Dimensions,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
  BackHandler,
  AppState,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

import PdfIcon from '../assets/icons/pdf.svg';
import DeleteIcon from '../assets/icons/trash.svg';

const window = Dimensions.get('window');
const { width, height } = window;
const scale = Math.min(width, height) / 375;

const normalize = (size) => Math.round(scale * size);
const wp = (percentage) => width * (percentage / 100);
const hp = (percentage) => height * (percentage / 100);

const PrescriptionScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  const [prescriptions, setPrescriptions] = useState([
    { id: '1', name: 'Prescription 01', date: '24 Jul 07 05:12:13', status: 'Completed', pdfUrl: 'https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf' },
    { id: '2', name: 'Prescription 02', date: '24 Jul 07 05:12:13', status: 'Completed', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '3', name: 'Prescription 03', date: '24 Jul 07 05:12:13', status: 'Completed', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '4', name: 'Prescription 04', date: '24 Jul 07 05:12:13', status: 'Completed', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ]);

  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [pdfError, setPdfError] = useState(false);
  const [webViewSource, setWebViewSource] = useState(null);

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Any cleanup needed
      };
    }, [])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        if (pdfModalVisible) {
          closePdfViewer();
        }
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, pdfModalVisible]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (pdfModalVisible) {
        closePdfViewer();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [pdfModalVisible]);

  const handleDeletePrescription = (id) => {
    Alert.alert(
      "Delete Prescription",
      "Are you sure you want to delete this prescription?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => setPrescriptions(prescriptions.filter(item => item.id !== id)),
          style: "destructive"
        }
      ]
    );
  };
  const goBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };
  const openPdfInWebView = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
    setPdfLoading(true);
    setPdfError(false);
    const finalUrl = Platform.OS === 'android' 
      ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true` 
      : pdfUrl;
    
    setWebViewSource({ uri: finalUrl });
    setPdfModalVisible(true);
  };

  const closePdfViewer = useCallback(() => {
    setPdfModalVisible(false);
    setPdfLoading(false);
    setPdfError(false);
  
    setTimeout(() => {
      setWebViewSource(null);
      setSelectedPdf(null);
    }, 300);
  }, []);

  const renderPrescriptionItem = ({ item }) => (
    <View style={styles.prescriptionItem}>
      <TouchableOpacity 
        style={styles.itemContent}
        onPress={() => openPdfInWebView(item.pdfUrl)}
        activeOpacity={0.7}
      >
        <View style={styles.pdfIconContainer}>
          <PdfIcon width={normalize(30)} height={normalize(30)} />
        </View>
        <View style={styles.prescriptionDetails}>
          <Text style={styles.prescriptionName}>{item.name}</Text>
          <Text style={styles.prescriptionDate}>{item.date} • <Text style={styles.statusCompleted}>{item.status}</Text></Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDeletePrescription(item.id)}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <DeleteIcon width={normalize(20)} height={normalize(20)} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top - hp(2.5) }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goBack}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Feather name="chevron-left" size={normalize(24)} color="#1a3b5d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescription</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <FlatList
        data={prescriptions}
        renderItem={renderPrescriptionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.prescriptionList}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      <Modal
        visible={pdfModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closePdfViewer}
      >
        <View style={[styles.pdfContainer, { paddingTop: insets.top }]}>
          <View style={styles.pdfHeader}>
            <TouchableOpacity 
              onPress={closePdfViewer} 
              style={styles.closePdfButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Feather name="x" size={normalize(24)} color="#1a3b5d" />
            </TouchableOpacity>
            <Text style={styles.pdfHeaderTitle}>Prescription</Text>
            <View style={styles.rightPlaceholder} />
          </View>
          
          <View style={styles.pdfWrapper}>
            {pdfLoading && (
              <View style={styles.loadingIndicator}>
                <ActivityIndicator size="large" color="#1a3b5d" />
                <Text style={styles.loadingText}>Loading PDF...</Text>
              </View>
            )}
            
            {pdfError && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={normalize(50)} color="#e74c3c" />
                <Text style={styles.errorText}>Failed to load PDF</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={() => {
                    if (selectedPdf) {
                      setPdfError(false);
                      setPdfLoading(true);
                      openPdfInWebView(selectedPdf);
                    }
                  }}
                >
                  <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {webViewSource && (
              <WebView
                source={webViewSource}
                style={styles.webView}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                onLoadStart={() => setPdfLoading(true)}
                onLoad={() => setPdfLoading(false)}
                onLoadEnd={() => setPdfLoading(false)}
                onError={(error) => {
                  console.log('WebView Error:', error);
                  setPdfLoading(false);
                  setPdfError(true);
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    backgroundColor: '#f5f7fa',
    height: hp(7),
  },
  backButton: {
    padding: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
    width: normalize(35),
    height: normalize(35),
  },
  headerTitle: {
    fontSize: normalize(15),
    fontWeight: '600',
    color: '#1a3b5d',
  },
  rightPlaceholder: {
    width: normalize(40),
  },
  prescriptionList: {
    padding: wp(4),
    paddingBottom: hp(2),
  },
  prescriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: normalize(10),
    marginBottom: hp(1.5),
    padding: normalize(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pdfIconContainer: {
    height: normalize(30),
    width: normalize(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(12),
  },
  prescriptionDetails: {
    flex: 1,
  },
  prescriptionName: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#1a3b5d',
    marginBottom: normalize(4),
  },
  prescriptionDate: {
    fontSize: normalize(14),
    color: '#667b94',
  },
  statusCompleted: {
    color: '#4caf50',
  },
  deleteButton: {
    padding: normalize(8),
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  pdfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    backgroundColor: 'white',
    height: hp(7),
    zIndex: 10,
  },
  closePdfButton: {
    padding: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
    width: normalize(40),
    height: normalize(40),
  },
  pdfHeaderTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: '#1a3b5d',
  },
  pdfWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 1,
  },
  loadingText: {
    marginTop: normalize(12),
    fontSize: normalize(16),
    color: '#1a3b5d',
  },
  webView: {
    flex: 1,
    width: width,
    height: height - hp(7),
    backgroundColor: '#f5f7fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  errorText: {
    fontSize: normalize(18),
    color: '#1a3b5d',
    marginTop: normalize(20),
    marginBottom: normalize(20),
  },
  retryButton: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    backgroundColor: '#1a3b5d',
    borderRadius: normalize(8),
  },
  retryText: {
    color: 'white',
    fontSize: normalize(16),
    fontWeight: '600',
  },
});

export default PrescriptionScreen;