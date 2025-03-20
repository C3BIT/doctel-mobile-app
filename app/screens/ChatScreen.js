import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { initialMessages } from '../utils/data';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const scale = {
  w: (size) => (width * size) / 100,
  h: (size) => (height * size) / 100,
  font: (size) => (width * size) / 375,
};

const UI = {
  avatarSize: scale.w(10),
  smallAvatarSize: scale.w(8),
  borderRadius: scale.w(5),
  inputHeight: scale.h(6),
  spacing: {
    xs: scale.w(1),
    sm: scale.w(2),
    md: scale.w(3),
    lg: scale.w(4),
  },
};

const Header = ({ navigation, opacity }) => (
  <Animated.View style={[styles.header, { opacity }]}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
      activeOpacity={0.7}>
      <MaterialIcons name="arrow-back" size={scale.font(24)} color="#555" />
    </TouchableOpacity>
    <View style={styles.doctorInfo}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/128/2785/2785482.png',
        }}
        style={styles.doctorAvatar}
      />
      <View>
        <Text style={styles.doctorName}>Anonymous</Text>
        <Text style={styles.doctorStatus}>Online</Text>
      </View>
    </View>
  </Animated.View>
);

const MessageBubble = ({ message, animValue = new Animated.Value(0) }) => {
  const isUser = message.sender === 'user';
  
  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);
  
  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });
  
  const opacity = animValue;
  
  return (
    <Animated.View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.doctorMessageContainer,
        { opacity, transform: [{ translateY }] },
      ]}>
      {!isUser && (
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/2785/2785482.png',
          }}
          style={styles.messageSenderAvatar}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.doctorBubble,
        ]}>
        {message.image ? (
          <Image source={{ uri: message.image }} style={styles.messageImage} />
        ) : (
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.doctorText,
            ]}>
            {message.text}
          </Text>
        )}
      </View>
      {isUser && <Text style={styles.messageTime}>{message.time}</Text>}
    </Animated.View>
  );
};

const TypingIndicator = ({ isTyping }) => {
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));
  
  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot2, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot3, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(dot1, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot2, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot3, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        if (isTyping) animateDots();
      });
    };
    
    if (isTyping) {
      animateDots();
    }
    
    return () => {
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    };
  }, [isTyping, dot1, dot2, dot3]);
  
  const translateY1 = dot1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });
  
  const translateY2 = dot2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });
  
  const translateY3 = dot3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });
  
  return (
    <View style={styles.typingContainer}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/128/2785/2785482.png',
        }}
        style={styles.typingAvatar}
      />
      <View style={styles.typingIndicator}>
        <Animated.View
          style={[
            styles.typingDot,
            { transform: [{ translateY: translateY1 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.typingDot,
            styles.typingDotMiddle,
            { transform: [{ translateY: translateY2 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.typingDot,
            { transform: [{ translateY: translateY3 }] },
          ]}
        />
      </View>
    </View>
  );
};

const MessageInput = ({ inputText, setInputText, setIsTyping, sendMessage }) => {
  const [inputAnimation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.timing(inputAnimation, {
      toValue: inputText.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [inputText]);
  
  const borderColor = inputAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', '#4B7BEC'],
  });
  
  const buttonScale = inputAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });
  
  return (
    <View style={styles.inputContainer}>
      <Animated.View
        style={[
          styles.inputWrapper,
          { borderBottomColor: borderColor },
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
        />
      </Animated.View>
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
          activeOpacity={0.7}>
          <Ionicons name="send" size={scale.font(22)} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
      
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      return () => {
        headerOpacity.setValue(0);
      };
    }, [])
  );

  useEffect(() => {
    let timer;
    if (typing) {
      timer = setTimeout(() => {
        setTyping(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [typing]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = useCallback(() => {
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

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(false);

    setTyping(true);
    setTimeout(() => {
      const doctorResponse = {
        id: (messages.length + 2).toString(),
        text: 'Thank you for providing that information. Have you noticed any specific triggers for these headaches?',
        sender: 'doctor',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages(prev => [...prev, doctorResponse]);
      setTyping(false);
    }, 2000);
  }, [inputText, messages]);

  const renderDateSeparator = () => (
    <View style={styles.dateSeparator}>
      <Text style={styles.dateSeparatorText}>Today, 10:30 AM</Text>
    </View>
  );

  return (
    <>
      <StatusBar 
        translucent={true}
        backgroundColor="transparent" 
        barStyle="dark-content" 
      />
      
      <SafeAreaView style={styles.safeArea}>
        <Header navigation={navigation} opacity={headerOpacity} />
        
        <KeyboardAvoidingView
          behavior={isIOS ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
          keyboardVerticalOffset={isIOS ? scale.h(5) : 0}>
          
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item, index }) => (
              <MessageBubble 
                message={item} 
                animValue={new Animated.Value(0)}
              />
            )}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            ListHeaderComponent={renderDateSeparator}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />

          {typing && <TypingIndicator isTyping={typing} />}
          
          <MessageInput
            inputText={inputText}
            setInputText={setInputText}
            setIsTyping={setIsTyping}
            sendMessage={sendMessage}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: isIOS ? 0 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: UI.spacing.md,
    paddingTop: isIOS ? scale.h(4) : scale.h(4),
    paddingBottom: UI.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 0,
    shadowColor: 'transparent',
  },
  backButton: {
    padding: UI.spacing.xs,
  },
  doctorInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: UI.spacing.md,
  },
  doctorAvatar: {
    width: UI.avatarSize,
    height: UI.avatarSize,
    borderRadius: UI.avatarSize / 2,
    marginRight: UI.spacing.md,
    backgroundColor: '#E0E0E0',
  },
  doctorName: {
    fontSize: scale.font(16),
    fontWeight: '600',
    color: '#333',
  },
  doctorStatus: {
    fontSize: scale.font(14),
    color: '#4CAF50',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: UI.spacing.md,
    paddingBottom: isIOS ? scale.h(10) : UI.spacing.lg,
  },
  dateSeparator: {
    alignItems: 'center',
    marginBottom: UI.spacing.md,
  },
  dateSeparatorText: {
    fontSize: scale.font(14),
    color: '#999',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: UI.spacing.md,
    paddingVertical: UI.spacing.xs,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: UI.spacing.md,
    paddingHorizontal: UI.spacing.lg,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  doctorMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageSenderAvatar: {
    width: UI.smallAvatarSize,
    height: UI.smallAvatarSize,
    borderRadius: UI.smallAvatarSize / 2,
    marginRight: UI.spacing.md,
    backgroundColor: '#E0E0E0',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: UI.spacing.lg,
    paddingVertical: UI.spacing.md,
    borderRadius: UI.borderRadius,
  },
  userBubble: {
    backgroundColor: '#4B7BEC',
    borderBottomRightRadius: 5,
    marginRight: UI.spacing.md,
  },
  doctorBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  messageText: {
    fontSize: scale.font(14),
    lineHeight: scale.h(2.5),
  },
  userText: {
    color: '#FFFFFF',
  },
  doctorText: {
    color: '#333333',
  },
  messageTime: {
    fontSize: scale.font(12),
    color: '#999',
  },
  messageImage: {
    width: scale.w(50),
    height: scale.w(50),
    borderRadius: scale.w(3),
  },
  typingContainer: {
    flexDirection: 'row',
    paddingHorizontal: UI.spacing.lg,
    paddingVertical: UI.spacing.sm,
    alignItems: 'center',
  },
  typingAvatar: {
    width: UI.smallAvatarSize,
    height: UI.smallAvatarSize,
    borderRadius: UI.smallAvatarSize / 2,
    marginRight: UI.spacing.md,
    backgroundColor: '#E0E0E0',
  },
  typingIndicator: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: UI.spacing.md,
    paddingVertical: UI.spacing.sm,
    borderRadius: UI.borderRadius,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  typingDot: {
    width: scale.w(1.5),
    height: scale.w(1.5),
    borderRadius: scale.w(0.75),
    marginHorizontal: scale.w(0.7),
    backgroundColor: '#4CAF50',
  },
  typingDotMiddle: {
    width: scale.w(1.5),
    height: scale.w(1.5),
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: UI.spacing.md,
    paddingVertical: UI.spacing.md,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    borderBottomWidth: 1.5,
    marginHorizontal: UI.spacing.sm,
    borderRadius: UI.spacing.xs,
  },
  input: {
    fontSize: scale.font(14),
    paddingHorizontal: UI.spacing.md,
    paddingVertical: UI.spacing.sm,
    maxHeight: scale.h(15),
  },
  sendButton: {
    backgroundColor: '#4B7BEC',
    width: UI.avatarSize,
    height: UI.avatarSize,
    borderRadius: UI.avatarSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: UI.spacing.md,
  },
});

export default ChatScreen;