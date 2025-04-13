import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { saveToStorage, loadFromStorage, removeFromStorage } from "./storage";
import colours from "./colours";

export default function App() {
  // Init state variables to store the username, profile picture, and error message.
  const [photoState, setPhotoState] = useState({});
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  // Boolean to track if a photo is present.
  const hasPhoto = Boolean(photoState.uri);

  // Try load the username and photo from storage when the component mounts.
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedUsername = await loadFromStorage("username");
        const storedPhoto = await loadFromStorage("photo");

        if (storedUsername) {
          setUsername(storedUsername);
        }
        if (storedPhoto) {
          setPhotoState({ uri: storedPhoto });
        }
      } catch (error) {
        setError("Failed to load profile data");
      }
    };

    loadProfileData();
  }, []);

  // Save the username to storage when it changes.
  function handleUsernameChange(text) {
    setUsername(text);
    saveToStorage("username", text);
  }

  // Open the image picker and save the selected photo to storage.
  async function handleChangePress() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedPhoto = result.assets[0];
      setPhotoState(selectedPhoto);
      saveToStorage("photo", selectedPhoto.uri);
    }
  }

  // Remove the photo from storage and reset the state.
  function handleRemovePress() {
    setPhotoState({});
    removeFromStorage("photo");
  }

  // Display the photo if present, or a placeholder if not.
  function Photo() {
    if (hasPhoto) {
      return (
        <View className="mb-5 rounded-lg overflow-hidden">
          <Image
            className="w-full h-96"
            resizeMode="cover"
            source={{ uri: photoState.uri }}
          />
        </View>
      );
    } else {
      return (
        <View className="border-3 border-gray-400 bg-gray-200 border-dashed rounded-lg w-full h-96 mb-5" />
      );
    }
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    // KeyboardAvoidingView to prevent the username field being covered when the keyboard is open.
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={120}
    >
      {/* ScrollView to allow the view to scroll when the keyboard is open. */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-4 mt-10">
          <Icon
            name="person-circle-outline"
            size={80}
            color={colours.primary}
          />
          <Text
            style={{ color: colours.primary }}
            className="text-lg font-bold mt-2"
          >
            Your Profile
          </Text>
        </View>

        {/* Photo Frame */}
        <View className="px-5 py-5">
          <Photo />
          <View className="flex-row justify-around">
            <TouchableOpacity
              onPress={handleChangePress}
              className="bg-primary px-4 py-2 rounded-md"
            >
              <Text className="text-white text-center">
                {hasPhoto ? "Change Photo" : "Add Photo"}
              </Text>
            </TouchableOpacity>
            {hasPhoto && (
              <TouchableOpacity
                onPress={handleRemovePress}
                className="bg-red-500 px-4 py-2 rounded-md"
              >
                <Text className="text-white text-center">Remove Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Username Field */}
        <View className="justify-center items-center mt-4">
          <TextInput
            placeholder="Enter Username"
            value={username}
            onChangeText={handleUsernameChange}
            className="text-lg border-b border-gray-300 w-56 text-center bg-white rounded-md"
            cursorColor={colours.primary}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
