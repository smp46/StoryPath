import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router, usePathname } from "expo-router";

import logo from "../assets/images/icon.png";
import Header from "./Header.jsx";
import colours from "./colours.js";
import { loadFromStorage } from "./storage";

const CustomDrawerContent = (props) => {
  const pathname = usePathname();
  const [photoState, setPhotoState] = useState({});
  const [username, setUsername] = useState("Not Signed In");
  const hasPhoto = Boolean(photoState.uri);

  useFocusEffect(() => {
    const loadProfileData = async () => {
      const storedUsername = await loadFromStorage("username");
      const storedPhoto = await loadFromStorage("photo");

      if (storedUsername) {
        setUsername(storedUsername);
      }
      if (storedPhoto) {
        setPhotoState({ uri: storedPhoto });
      }
    };

    loadProfileData();
  });

  return (
    <DrawerContentScrollView {...props}>
      {/* Title and Logo*/}
      <View className="flex-row px-4 py-5 border-b border-gray-300">
        <View className="mt-6 ml-2">
          <View className="flex-row items-center">
            <Image source={logo} className="w-12 h-12 resize-contain" />
            <Text className="text-2xl font-bold ml-3">StoryPath</Text>
          </View>
        </View>
      </View>
      {/* User Info*/}
      <View className="px-4 py-3 border-b border-gray-300">
        <View className="flex-row items-center">
          {hasPhoto ? (
            <Image
              source={{ uri: photoState.uri }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <Feather name="user" size={48} color={colours.primary} />
          )}
          <View className="ml-4">
            <Text className="text-lg font-semibold">Current User:</Text>
            <Text className="text-xl font-semibold mt-1">{username}</Text>
          </View>
        </View>
      </View>

      {/* Drawer Items */}
      <DrawerItem
        icon={({ size }) => (
          <Feather
            name="home"
            size={size}
            color={pathname === "/" ? "#fff" : "#000"}
          />
        )}
        label={"Welcome"}
        labelStyle={{
          marginLeft: -20,
          fontSize: 18,
          color: pathname === "/" ? "#fff" : "#000",
        }}
        style={{
          backgroundColor: pathname === "/" ? colours.primary : "#fff",
        }}
        onPress={() => {
          router.push("/");
        }}
      />
      <DrawerItem
        icon={({ size }) => (
          <Feather
            name="user"
            size={size}
            color={pathname === "/profile" ? "#fff" : "#000"}
          />
        )}
        label={"Profile"}
        labelStyle={{
          marginLeft: -20,
          fontSize: 18,
          color: pathname === "/profile" ? "#fff" : "#000",
        }}
        style={{
          backgroundColor: pathname === "/profile" ? colours.primary : "#fff",
        }}
        onPress={() => {
          router.push("/profile");
        }}
      />
      <DrawerItem
        icon={({ size }) => (
          <Feather
            name="list"
            size={size}
            color={pathname === "/projects" ? "#fff" : "#000"}
          />
        )}
        label={"Projects"}
        labelStyle={{
          marginLeft: -20,
          fontSize: 18,
          color: pathname === "/projects" ? "#fff" : "#000",
        }}
        style={{
          backgroundColor: pathname === "/projects" ? colours.primary : "#fff",
        }}
        onPress={() => {
          router.push("/projectsList");
        }}
      />
      <DrawerItem
        icon={({ size }) => (
          <Feather
            name="info"
            size={size}
            color={pathname === "/about" ? "#fff" : "#000"}
          />
        )}
        label={"About"}
        labelStyle={{
          marginLeft: -20,
          fontSize: 18,
          color: pathname === "/about" ? "#fff" : "#000",
        }}
        style={{
          backgroundColor: pathname === "/about" ? colours.primary : "#fff",
        }}
        onPress={() => {
          router.push("/about");
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  const pathname = usePathname();

  // Check if the current path is inside the projects tab group
  const isInProjectsTab = pathname.startsWith("/projects/");

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: !isInProjectsTab, // Hide the header if in the projects tab group
        unmountOnBlur: true,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: () => <Header title="Welcome" />,
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          headerTitle: () => <Header title="About" />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          headerTitle: () => <Header title="Profile" />,
        }}
      />
      <Drawer.Screen
        name="projectsList"
        options={{
          headerTitle: () => <Header title="Projects" />,
        }}
      />
    </Drawer>
  );
}
