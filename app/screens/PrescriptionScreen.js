import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Share,
  TextInput,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import PdfIcon from "../assets/icons/pdf.svg";
import ShareIcon from "../assets/icons/share.svg";
import DownloadIcon from "../assets/icons/download.svg";
import RenameIcon from "../assets/icons/rename.svg";
import DeleteIcon from "../assets/icons/trash2.svg";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrescriptions } from "../redux/features/prescriptions/prescriptionSlice";
import Loader from "../components/common/Loader";
import { formatDate } from "../utils/constants";
import FlashMessage from "../components/shared/FlashMessage";
import { useTranslation } from "react-i18next";

const window = Dimensions.get("window");
const { width, height } = window;
const scale = Math.min(width, height) / 375;

const normalize = (size) => Math.round(scale * size);
const wp = (percentage) => width * (percentage / 100);
const hp = (percentage) => height * (percentage / 100);

const PrescriptionScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.auth);
  const { list, isLoading } = useSelector((state) => state.prescriptions);
  
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [retryCount, setRetryCount] = useState(0);
  const [webViewSource, setWebViewSource] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  
  const MAX_RETRY_COUNT = 3;

  useEffect(() => {
    dispatch(fetchPrescriptions(token));
  }, [dispatch, token]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState === "active" && nextAppState.match(/inactive|background/)) {
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
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (pdfModalVisible) {
          closePdfViewer();
          return true;
        }
        if (menuVisible !== null) {
          closeMenu();
          return true;
        }
        if (renameModalVisible) {
          setRenameModalVisible(false);
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [pdfModalVisible, menuVisible, renameModalVisible]);

  const openPdfInWebView = (pdfUrl) => {
    if (!pdfUrl) {
      FlashMessage.error("Invalid prescription URL");
      return;
    }
    
    setSelectedPdf(pdfUrl);
    setPdfLoading(true);
    setRetryCount(0);
    
    const finalUrl = Platform.OS === "android"
      ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
      : pdfUrl;

    setWebViewSource({ uri: finalUrl });
    setPdfModalVisible(true);
  };

  const closePdfViewer = useCallback(() => {
    setPdfModalVisible(false);
    setPdfLoading(false);

    setTimeout(() => {
      setWebViewSource(null);
      setSelectedPdf(null);
    }, 300);
  }, []);

  const handleWebViewError = (error) => {
    setPdfLoading(false);
    
    if (retryCount < MAX_RETRY_COUNT) {
      setRetryCount(prev => prev + 1);
      FlashMessage.info(`Retrying to load PDF (${retryCount + 1}/${MAX_RETRY_COUNT})...`);
      
      setTimeout(() => {
        if (selectedPdf) {
          const finalUrl = Platform.OS === "android"
            ? `https://docs.google.com/viewer?url=${encodeURIComponent(selectedPdf)}&embedded=true`
            : selectedPdf;
          setWebViewSource({ uri: finalUrl });
          setPdfLoading(true);
        }
      }, 1500);
    } else {
      FlashMessage.error("Failed to load PDF. Please try again later.");
      closePdfViewer();
    }
  };

  const handleManualRetry = () => {
    if (selectedPdf) {
      setPdfLoading(true);
      setRetryCount(0);
      
      const finalUrl = Platform.OS === "android"
        ? `https://docs.google.com/viewer?url=${encodeURIComponent(selectedPdf)}&embedded=true`
        : selectedPdf;
      
      setWebViewSource({ uri: finalUrl });
      FlashMessage.info("Retrying to load PDF...");
    }
  };

  const toggleMenu = (index) => {
    if (menuVisible !== null && menuVisible !== index) {
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setMenuVisible(null);
        setTimeout(() => {
          setMenuVisible(index);
          setSelectedItem(list[index]);
          Animated.timing(menuAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }, 50);
      });
    } else if (menuVisible === index) {
      closeMenu();
    } else {
      setMenuVisible(index);
      setSelectedItem(list[index]);
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(null);
      setSelectedItem(null);
    });
  };
  
  const handleShare = async (item) => {
    try {
      closeMenu();
      
      const result = await Share.share({
        message: `Check out this prescription: ${item.prescriptionURL}`,
        url: item.prescriptionURL,
        title: item.name,
      });
      
      if (result.action === Share.sharedAction) {
        FlashMessage.success("Prescription shared successfully");
      }
    } catch (error) {
      FlashMessage.error("Error sharing prescription");
    }
  };

  const handleDownload = async (item) => {
    closeMenu();
    
    if (!item.prescriptionURL) {
      FlashMessage.error("Invalid prescription URL");
      return;
    }
    
    try {
      setIsDownloading(true);
      
      const fileName = `prescription_${Date.now()}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      const downloadResumable = FileSystem.createDownloadResumable(
        item.prescriptionURL,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );
      
      const { uri } = await downloadResumable.downloadAsync();
      
      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(uri);
      } else {
        const UTI = 'application/pdf';
        await Sharing.shareAsync(uri, { UTI });
      }
      
      FlashMessage.success("Prescription downloaded successfully");
    } catch (error) {
      FlashMessage.error("Error downloading prescription");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleRename = (item) => {
    closeMenu();
    setRenameText(item.name);
    setRenameModalVisible(true);
  };

  const confirmRename = () => {
    if (selectedItem && renameText.trim()) {
      FlashMessage.success("Prescription renamed successfully");
      setRenameModalVisible(false);
    } else {
      FlashMessage.error("Please enter a valid name");
    }
  };

  const handleDeletePrescription = (item) => {
    closeMenu();
    
    Alert.alert(
      "Delete Prescription",
      "Are you sure you want to delete this prescription?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            console.log(`Deleting prescription with ID: ${item.id}`);
            FlashMessage.success("Prescription deleted successfully");
          },
          style: "destructive",
        },
      ]
    );
  };

  const goBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const renderPrescriptionItem = ({ item, index }) => {
    const isMenuOpen = menuVisible === index;
    const menuOpacity = menuAnimation;
  
    return (
      <View style={styles.prescriptionItemContainer}>
        <View style={styles.prescriptionItem}>
          <TouchableOpacity
            style={styles.itemContent}
            onPress={() => openPdfInWebView(item.prescriptionURL)}
            activeOpacity={0.7}
          >
            <View style={styles.pdfIconContainer}>
              <PdfIcon
                width={normalize(24)}
                height={normalize(24)}
                fill="#20ACE2"
              />
            </View>

            <View style={styles.prescriptionDetails}>
              <Text style={styles.prescriptionName}>{item.name}</Text>
              <Text style={styles.prescriptionDate}>{item.date}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => toggleMenu(index)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Feather
              name="more-vertical"
              size={normalize(20)}
              color="#1a3b5d"
            />
          </TouchableOpacity>
        </View>

        {isMenuOpen && (
          <Animated.View
            style={[
              styles.menuContainer,
              {
                opacity: menuOpacity,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleShare(item)}
            >
              <ShareIcon width={normalize(20)} height={normalize(20)} />
              <Text style={[styles.menuItemText, { color: '#864FFD' }]}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleDownload(item)}
            >
              <DownloadIcon width={normalize(20)} height={normalize(20)} />
              <Text style={[styles.menuItemText, { color: '#29E9CC' }]}>Download</Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleRename(item)}
            >
              <RenameIcon width={normalize(20)} height={normalize(20)} />
              <Text style={[styles.menuItemText, { color: '#FFBE7D' }]}>Rename</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleDeletePrescription(item)}
            >
              <DeleteIcon width={normalize(20)} height={normalize(20)} />
              <Text style={[styles.menuItemText, { color: '#FB8CAB' }]}>Delete</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>{t("prescription")}</Text>
        <View style={styles.rightPlaceholder} />
      </View>
      
      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={list.map((item, index) => ({
            ...item,
            name: `Prescription ${index + 1}`,
            id: item.id || `${index}`,
            status: 'Completed',
            date: formatDate(item.createdAt)
          }))}
          renderItem={renderPrescriptionItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.prescriptionList}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          windowSize={5}
          extraData={menuVisible}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="file-text" size={normalize(50)} color="#1a3b5d" />
              <Text style={styles.emptyText}>No prescriptions found</Text>
            </View>
          }
        />
      )}
      <Modal
        visible={pdfModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closePdfViewer}
      >
        <View style={styles.pdfContainer}>
          <View style={styles.pdfHeader}>
            <TouchableOpacity
              onPress={closePdfViewer}
              style={styles.closePdfButton}
              hitSlop={{ top: 5, right: 10, bottom: 10, left: 10 }}
            >
              <Feather name="x" size={normalize(24)} color="#1a3b5d" />
            </TouchableOpacity>
            <Text style={styles.pdfHeaderTitle}>{t("prescription")}</Text>
            <View style={styles.rightPlaceholder} />
          </View>

          <View style={styles.pdfWrapper}>
            {pdfLoading && (
              <View style={styles.loadingIndicator}>
                <ActivityIndicator size="large" color="#1a3b5d" />
                <Text style={styles.loadingText}>Loading PDF...</Text>
              </View>
            )}

            {webViewSource && (
              <WebView
                source={webViewSource}
                style={styles.webView}
                originWhitelist={["*"]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                onLoadStart={() => setPdfLoading(true)}
                onLoad={() => {
                  setPdfLoading(false);
                }}
                onLoadEnd={() => setPdfLoading(false)}
                onError={handleWebViewError}
                renderError={() => (
                  <View style={styles.errorContainer}>
                    <Feather
                      name="alert-circle"
                      size={normalize(50)}
                      color="#e74c3c"
                    />
                    <Text style={styles.errorText}>Failed to load PDF</Text>
                    <TouchableOpacity
                      style={styles.retryButton}
                      onPress={handleManualRetry}
                    >
                      <Text style={styles.retryText}>Try Again</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
      
      <Modal
        visible={renameModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRenameModalVisible(false)}
        >
          <View style={styles.renameModalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.renameModalTitle}>Rename Prescription</Text>
            <TextInput
              style={styles.renameInput}
              value={renameText}
              onChangeText={setRenameText}
              placeholder="Enter new name"
              placeholderTextColor="#667b94"
              autoCapitalize="none"
              autoFocus={true}
            />
            <View style={styles.renameButtonsContainer}>
              <TouchableOpacity
                style={[styles.renameButton, styles.cancelButton]}
                onPress={() => setRenameModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.renameButton, styles.saveButton]}
                onPress={confirmRename}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {isDownloading && (
        <View style={styles.downloadProgressContainer}>
          <View style={styles.downloadProgressContent}>
            <ActivityIndicator size="small" color="#1a3b5d" />
            <Text style={styles.downloadProgressText}>
              Downloading... {Math.round(downloadProgress * 100)}%
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
    backgroundColor: "#f5f7fa",
    height: hp(7),
  },
  backButton: {
    padding: normalize(8),
    alignItems: "center",
    justifyContent: "center",
    width: normalize(35),
    height: normalize(35),
  },
  headerTitle: {
    fontSize: normalize(15),
    fontWeight: "600",
    color: "#1a3b5d",
  },
  rightPlaceholder: {
    width: normalize(40),
  },
  prescriptionList: {
    padding: wp(4),
    paddingBottom: hp(2),
  },
  prescriptionItemContainer: {
    marginBottom: hp(1.5),
    borderRadius: normalize(10),
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  prescriptionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: normalize(10),
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  pdfIconContainer: {
    height: normalize(40),
    width: normalize(40),
    alignItems: "center",
    justifyContent: "center",
    marginRight: normalize(12),
    backgroundColor: "#f0f4ff",
    borderRadius: normalize(8),
  },
  prescriptionDetails: {
    flex: 1,
  },
  prescriptionName: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#20ACE2",
    marginBottom: normalize(4),
  },
  prescriptionDate: {
    fontSize: normalize(14),
    color: "#20ACE2",
  },
  menuButton: {
    padding: normalize(8),
    borderRadius: normalize(20),
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(5),
    backgroundColor: "#f0f4ff",
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
    height: normalize(80),
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: normalize(5),
  },
  menuItemText: {
    fontSize: normalize(12),
    marginTop: normalize(5),
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  pdfHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
    backgroundColor: "white",
    height: hp(7),
    zIndex: 10,
  },
  closePdfButton: {
    padding: normalize(8),
    alignItems: "center",
    justifyContent: "center",
    width: normalize(40),
    height: normalize(40),
  },
  pdfHeaderTitle: {
    fontSize: normalize(15),
    fontWeight: "600",
    color: "#1a3b5d",
  },
  pdfWrapper: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },
  loadingIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    zIndex: 1,
  },
  loadingText: {
    marginTop: normalize(12),
    fontSize: normalize(16),
    color: "#1a3b5d",
  },
  webView: {
    flex: 1,
    width: width,
    height: height - hp(7),
    backgroundColor: "#f5f7fa",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    padding: normalize(20),
  },
  errorText: {
    fontSize: normalize(18),
    color: "#1a3b5d",
    marginTop: normalize(20),
    marginBottom: normalize(20),
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    backgroundColor: "#1a3b5d",
    borderRadius: normalize(8),
  },
  retryText: {
    color: "white",
    fontSize: normalize(16),
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(10),
  },
  emptyText: {
    fontSize: normalize(16),
    color: "#667b94",
    marginTop: normalize(10),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  renameModalContent: {
    width: wp(80),
    backgroundColor: "white",
    borderRadius: normalize(12),
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(15),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  renameModalTitle: {
    fontSize: normalize(18),
    fontWeight: "600",
    color: "#1a3b5d",
    marginBottom: normalize(15),
    textAlign: "center",
  },
  renameInput: {
    borderWidth: 1,
    borderColor: "#e1e8ed",
    borderRadius: normalize(8),
    padding: normalize(12),
    fontSize: normalize(16),
    color: "#1a3b5d",
    marginBottom: normalize(20),
    backgroundColor: "#f9fafb",
  },
  renameButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  renameButton: {
    flex: 1,
    paddingVertical: normalize(12),
    borderRadius: normalize(8),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: normalize(5),
  },
  cancelButton: {
    backgroundColor: "#f0f2f5",
  },
  saveButton: {
    backgroundColor: "#1a3b5d",
  },
  cancelButtonText: {
    color: "#1a3b5d",
    fontSize: normalize(16),
    fontWeight: "600",
  },
  saveButtonText: {
    color: "white",
    fontSize: normalize(16),
    fontWeight: "600",
  },
  downloadProgressContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: hp(3),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  downloadProgressContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
    borderRadius: normalize(25),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  downloadProgressText: {
    marginLeft: normalize(10),
    fontSize: normalize(14),
    color: "#1a3b5d",
  },
});

export default PrescriptionScreen;