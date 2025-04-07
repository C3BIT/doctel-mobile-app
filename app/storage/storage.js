import { storage } from "./mmkvInstance"; 

export const StorageKeys = {
    User: "user",
    Token: "token",
    phone: "phone",
    IsAuthenticated: "is_authenticated",
    Language: "language_preference",
};

export const saveUserData = (user = {}, token, phone) => {
  try {
    storage.set(StorageKeys.User, JSON.stringify(user));
    storage.set(StorageKeys.Token, token);
    storage.set(StorageKeys.phone, phone);
    storage.set(StorageKeys.IsAuthenticated, true);
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};


export const getUserData = () => {
  try {
    const user = storage.getString(StorageKeys.User);
    const token = storage.getString(StorageKeys.Token);
    const phone = storage.getString(StorageKeys.phone);
    const isAuthenticated = storage.getBoolean(StorageKeys.IsAuthenticated);

    return token
      ? { user: user ? JSON.parse(user) : null, token, phone, isAuthenticated }
      : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};


export const removeUserData = () => {
  try {
    storage.delete(StorageKeys.User);
    storage.delete(StorageKeys.Token);
    storage.delete(StorageKeys.phone);
    storage.delete(StorageKeys.IsAuthenticated);
  } catch (error) {
    console.error("Error removing user data:", error);
  }
};

export const saveLanguagePreference = (isEnglish) => {
    storage.set(StorageKeys.Language, isEnglish);
};

export const getLanguagePreference = () => {
    return storage.getBoolean(StorageKeys.Language) ?? true;
};