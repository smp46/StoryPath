import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Save data to AsyncStorage
 *
 * @param {string} key - The key under which the value is stored
 * @param {string} value - The value to be stored
 */
export const saveToStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(`Failed to save ${key}: `, error);
  }
};

/**
 * Load data from AsyncStorage
 *
 * @param {string} key - The key for the value to retrieve
 * @returns {Promise<string|null>} - The value associated with the key, or null if not found
 */
export const loadFromStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 *
 * @param {string} key - The key to remove from storage
 */
export const removeFromStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(`Failed to remove ${key}: `, error);
  }
};
