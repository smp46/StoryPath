import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import map from "../assets/images/map.png";
import logo from "../assets/images/icon.png";
import { loadFromStorage } from "./storage";

export default function Index() {
  // Init a state variable to store the username.
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  // When the component is focused, load the username from storage.
  useFocusEffect(() => {
    async function loadProfileData() {
      try {
        const storedUsername = await loadFromStorage("username");

        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        setError(error.message);
      }
    }

    loadProfileData();
  });

  // If there is an error when fetching the username, display it.
  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={map} className="flex-1 justify-center">
      {/* Title and Subtitle */}
      <View className="flex-1 justify-center items-center p-5 bg-white/80 mx-5 rounded-lg my-5">
        <Image source={logo} className="w-24 h-24 mb-5" resizeMode="contain" />
        <Text className="text-2xl font-bold text-primary mb-2 text-center">
          Welcome to StoryPath
        </Text>
        <Text className="text-base text-secondary mb-5 text-center">
          Explore Unlimited Location-based Experiences
        </Text>

        {/* Short description */}
        <View className="bg-white p-4 rounded-lg shadow-md shadow-black mb-8">
          <Text className="text-sm text-center text-gray-800">
            With StoryPath, you can discover and create amazing location-based
            adventures. From city tours to treasure hunts, the possibilities are
            endless!
          </Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="bg-primary py-3 px-8 rounded mt-3 w-4/5 items-center shadow-md shadow-black"
        >
          {username === "" ? (
            <Text className="text-base text-white font-bold">
              CREATE PROFILE
            </Text>
          ) : (
            <Text className="text-base text-white font-bold">VIEW PROFILE</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/projectsList")}
          className="bg-primary py-3 px-8 rounded mt-3 w-4/5 items-center shadow-md shadow-black"
        >
          <Text className="text-base text-white font-bold">
            EXPLORE PROJECTS
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
