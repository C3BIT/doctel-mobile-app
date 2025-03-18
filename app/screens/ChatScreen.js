import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { initialMessages } from '../utils/data'; // Import the initial messages

const { width, height } = Dimensions.get('window');

// Dynamic sizing functions
const dynamicWidth = (percentage) => (width * percentage) / 100;
const dynamicHeight = (percentage) => (height * percentage) / 100;
const dynamicFontSize = (size) => (width * size) / 375; // Base width for font scaling

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [typing]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: (messages.length + 1).toString(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(false);

    // Simulate doctor typing
    setTyping(true);

    // Simulate doctor response after 2 seconds
    setTimeout(() => {
      const doctorResponse = {
        id: (updatedMessages.length + 1).toString(),
        text: 'Thank you for providing that information. Have you noticed any specific triggers for these headaches?',
        sender: 'doctor',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prevMessages) => [...prevMessages, doctorResponse]);
      setTyping(false);
    }, 2000);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.doctorMessageContainer,
        ]}>
        {!isUser && (
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/2785/2785482.png',
            }}
            style={styles.doctorAvatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.doctorBubble,
          ]}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.messageImage} />
          ) : (
            <Text
              style={[
                styles.messageText,
                isUser ? styles.userText : styles.doctorText,
              ]}>
              {item.text}
            </Text>
          )}
        </View>
        {isUser && <Text style={styles.messageTime}>{item.time}</Text>}
      </View>
    );
  };

  const renderDateSeparator = () => (
    <View style={styles.dateSeparator}>
      <Text style={styles.dateSeparatorText}>Today, 10:30 AM</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={dynamicFontSize(24)} color="#555" />
        </TouchableOpacity>
        <View style={styles.doctorInfo}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/2785/2785482.png',
            }}
            style={styles.doctorAvatar}
          />
          <View>
            <Text style={styles.doctorName}>Dr. Michael Smith</Text>
            <Text style={styles.doctorStatus}>Online</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="videocam-outline" size={dynamicFontSize(24)} color="green" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="phone" size={dynamicFontSize(22)} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? dynamicHeight(10) : 0}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          ListHeaderComponent={renderDateSeparator}
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
          contentInset={{ bottom: Platform.OS === 'ios' ? dynamicHeight(10) : 0 }}
          contentOffset={{ y: Platform.OS === 'ios' ? 0 : dynamicHeight(10) }}
        />

        {typing && (
          <View style={styles.typingContainer}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/2785/2785482.png',
              }}
              style={styles.typingAvatar}
            />
            <View style={styles.typingIndicator}>
              <View
                style={[
                  styles.typingDot,
                  { backgroundColor: typing ? '#4CAF50' : '#999' },
                ]}
              />
              <View
                style={[
                  styles.typingDot,
                  styles.typingDotMiddle,
                  { backgroundColor: typing ? '#4CAF50' : '#999' },
                ]}
              />
              <View
                style={[
                  styles.typingDot,
                  { backgroundColor: typing ? '#4CAF50' : '#999' },
                ]}
              />
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <View
            style={[
              styles.inputWrapper,
              { borderBottomColor: isTyping ? '#4B7BEC' : '#E0E0E0' },
            ]}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
                setIsTyping(text.length > 0);
              }}
              multiline
              onFocus={() =>
                flatListRef.current.scrollToEnd({ animated: true })
              }
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={dynamicFontSize(22)} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dynamicWidth(3),
    paddingVertical: dynamicHeight(2),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: dynamicWidth(1),
  },
  doctorInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: dynamicWidth(3),
  },
  doctorAvatar: {
    width: dynamicWidth(10),
    height: dynamicWidth(10),
    borderRadius: dynamicWidth(5),
    marginRight: dynamicWidth(3),
    backgroundColor: '#E0E0E0',
  },
  doctorName: {
    fontSize: dynamicFontSize(16),
    fontWeight: '600',
    color: '#333',
  },
  doctorStatus: {
    fontSize: dynamicFontSize(14),
    color: '#4CAF50',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: dynamicWidth(2),
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: dynamicHeight(2),
    paddingBottom: Platform.OS === 'ios' ? dynamicHeight(10) : 0,
  },
  dateSeparator: {
    alignItems: 'center',
    marginBottom: dynamicHeight(2),
  },
  dateSeparatorText: {
    fontSize: dynamicFontSize(14),
    color: '#999',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: dynamicWidth(3),
    paddingVertical: dynamicHeight(1),
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: dynamicHeight(2),
    paddingHorizontal: dynamicWidth(4),
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  doctorMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: dynamicWidth(4),
    paddingVertical: dynamicHeight(1.5),
    borderRadius: dynamicWidth(5),
  },
  userBubble: {
    backgroundColor: '#4B7BEC',
    borderBottomRightRadius: 5,
    marginRight: dynamicWidth(3),
  },
  doctorBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: dynamicFontSize(14),
    lineHeight: dynamicHeight(2.5),
  },
  userText: {
    color: '#FFFFFF',
  },
  doctorText: {
    color: '#333333',
  },
  messageTime: {
    fontSize: dynamicFontSize(12),
    color: '#999',
  },
  messageImage: {
    width: dynamicWidth(50),
    height: dynamicWidth(50),
    borderRadius: dynamicWidth(3),
  },
  typingContainer: {
    flexDirection: 'row',
    paddingHorizontal: dynamicWidth(4),
    paddingVertical: dynamicHeight(1.5),
    alignItems: 'center',
  },
  typingAvatar: {
    width: dynamicWidth(8),
    height: dynamicWidth(8),
    borderRadius: dynamicWidth(4),
    marginRight: dynamicWidth(3),
    backgroundColor: '#E0E0E0',
  },
  typingIndicator: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: dynamicWidth(3),
    paddingVertical: dynamicHeight(1),
    borderRadius: dynamicWidth(4),
    alignItems: 'center',
  },
  typingDot: {
    width: dynamicWidth(1.5),
    height: dynamicWidth(1.5),
    borderRadius: dynamicWidth(0.75),
    marginHorizontal: dynamicWidth(0.5),
    opacity: 0.6,
  },
  typingDotMiddle: {
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: dynamicWidth(3),
    paddingVertical: dynamicHeight(1.5),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    borderBottomWidth: 1,
    marginHorizontal: dynamicWidth(2),
  },
  input: {
    fontSize: dynamicFontSize(14),
    paddingHorizontal: dynamicWidth(3),
    paddingVertical: dynamicHeight(1),
    maxHeight: dynamicHeight(15),
  },
  sendButton: {
    backgroundColor: '#4B7BEC',
    width: dynamicWidth(10),
    height: dynamicWidth(10),
    borderRadius: dynamicWidth(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: dynamicWidth(3),
  },
});

export default ChatScreen;