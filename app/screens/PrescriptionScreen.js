// PrescriptionScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  FlatList,
  Dimensions,
  StatusBar,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
  BackHandler,
  AppState
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PdfIcon from '../assets/icons/pdf.svg';
import DeleteIcon from '../assets/icons/trash.svg';

const { width, height } = Dimensions.get('window');

const PrescriptionScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [prescriptions, setPrescriptions] = useState([
    { id: '1', name: 'Prescription 01', date: '24 Jul 07 05:12:13', status: 'Completed', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '2', name: 'Prescription 02', date: '24 Jul 07 05:12:13', status: 'Completed', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '3', name: 'Prescription 03', date: '24 Jul 07 05:12:13', status: 'Completed', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '4', name: 'Prescription 04', date: '24 Jul 07 05:12:13', status: 'Completed', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ]);

  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [localPdfPath, setLocalPdfPath] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);

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
    setPrescriptions(prescriptions.filter(item => item.id !== id));
  };

  const goBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const openPdfViewer = async (pdfUrl) => {
    setPdfLoading(true);
    setPdfModalVisible(true);
    
    try {
      const fileDir = Platform.OS === 'ios' ? 
        ReactNativeBlobUtil.fs.dirs.DocumentDir : 
        ReactNativeBlobUtil.fs.dirs.DownloadDir;
      
      const fileName = `prescription-${Date.now()}.pdf`;
      const localPath = `${fileDir}/${fileName}`;
      
      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        path: localPath,
        addAndroidDownloads: {
          useDownloadManager: false,
          notification: false,
          path: localPath,
        },
        timeout: 15000
      }).fetch('GET', pdfUrl);
      
      if (response.info().status === 200) {
        const filePath = Platform.OS === 'ios' ? 
          `file://${response.path()}` : 
          `file://${response.path()}`;
          
        setLocalPdfPath(filePath);
      } else {
        throw new Error('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Alert.alert(
        'Error',
        'Failed to load the prescription PDF. Please try again later.',
        [{ text: 'OK', onPress: closePdfViewer }]
      );
    }
  };

  const closePdfViewer = () => {
    setPdfModalVisible(false);
    setPdfLoading(false);
    
    if (localPdfPath) {
      ReactNativeBlobUtil.fs.unlink(localPdfPath.replace('file://', ''))
        .catch(err => console.error('Error deleting temp file:', err));
    }
    setTimeout(() => {
      setLocalPdfPath(null);
    }, 300);
  };

  const renderPrescriptionItem = ({ item }) => (
    <View style={styles.prescriptionItem}>
      <TouchableOpacity 
        style={styles.itemContent}
        onPress={() => openPdfViewer(item.pdfUrl)}
      >
        <View style={styles.pdfIconContainer}>
          <PdfIcon width={30} height={30} />
        </View>
        <View style={styles.prescriptionDetails}>
          <Text style={styles.prescriptionName}>{item.name}</Text>
          <Text style={styles.prescriptionDate}>{item.date} • <Text style={styles.statusCompleted}>{item.status}</Text></Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDeletePrescription(item.id)}
      >
        <DeleteIcon width={20} height={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top - height*0.02 }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goBack}
        >
          <Feather name="chevron-left" size={24} color="#1a3b5d" />
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
      />

      <Modal
        visible={pdfModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closePdfViewer}
      >
        <View style={[styles.pdfContainer, { paddingTop: insets.top }]}>
          <View style={styles.pdfHeader}>
            <TouchableOpacity onPress={closePdfViewer} style={styles.closePdfButton}>
              <Feather name="x" size={24} color="#1a3b5d" />
            </TouchableOpacity>
            <Text style={styles.pdfHeaderTitle}>Prescription</Text>
            <View style={styles.rightPlaceholder} />
          </View>
          
          <View style={styles.pdfWrapper}>
            {pdfLoading && !localPdfPath && (
              <View style={styles.loadingIndicator}>
                <ActivityIndicator size="large" color="#1a3b5d" />
                <Text style={styles.loadingText}>Loading PDF...</Text>
              </View>
            )}
            
            {localPdfPath && (
              <Pdf
                source={{ uri: localPdfPath }}
                onLoadComplete={(numberOfPages) => {
                  console.log(`PDF loaded: ${numberOfPages} pages`);
                  setPdfLoading(false);
                }}
                onError={(error) => {
                  console.log('PDF Error:', error);
                  setPdfLoading(false);
                  Alert.alert(
                    'Error',
                    'Failed to display the PDF. Please try again later.',
                    [{ text: 'OK', onPress: closePdfViewer }]
                  );
                }}
                style={styles.pdf}
                enablePaging={true}
                renderActivityIndicator={() => <ActivityIndicator color="#1a3b5d" size="large" />}
                enableAnnotationRendering={false}
                maxFileSize={20 * 1024 * 1024}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    backgroundColor: '#f5f7fa',
    height: 56,
  },
  backButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a3b5d',
  },
  rightPlaceholder: {
    width: 40,
  },
  prescriptionList: {
    padding: 16,
  },
  prescriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 12,
    padding: 16,
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
    height: 36,
    width: 36,
    borderRadius: 8,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  prescriptionDetails: {
    flex: 1,
  },
  prescriptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a3b5d',
    marginBottom: 4,
  },
  prescriptionDate: {
    fontSize: 14,
    color: '#667b94',
  },
  statusCompleted: {
    color: '#4caf50',
  },
  deleteButton: {
    padding: 8,
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  pdfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    backgroundColor: 'white',
    height: 56,
    zIndex: 10,
  },
  closePdfButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  pdfHeaderTitle: {
    fontSize: 18,
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
    marginTop: 12,
    fontSize: 16,
    color: '#1a3b5d',
  },
  pdf: {
    flex: 1,
    width: width,
    height: height - 56,
    backgroundColor: '#f5f7fa',
  },
});

export default PrescriptionScreen;