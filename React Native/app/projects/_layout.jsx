import React from "react";
import { Tabs } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";

import colours from "../colours.js";
import Header from "../Header.jsx";
import { LocationProvider } from "./LocationContext";

export default function ProjectsLayout() {
  return (
    // Wrap the tabs in the location provider to provide a global locationId context for the tab group.
    <LocationProvider>
      <Tabs
        className="mb-50"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: colours.primary,
          // Combine drawer button and title in the header
          headerLeft: () => <DrawerToggleButton />,
          // Set the title based on the current tab
          headerTitle: () => {
            const titleMap = {
              project: "Project Details",
              map: "Project Map",
              qr: "QR Code Scanner",
            };

            return <Header title={titleMap[route.name] || "Projects"} />;
          },
        })}
      >
        <Tabs.Screen
          name="project"
          options={{
            tabBarIcon: ({ color }) => (
              <Feather name="book-open" size={24} color={color} />
            ),
            tabBarLabel: "Project",
            headerShown: true,
            detachPreviousScreen: true,
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            tabBarIcon: ({ color }) => (
              <Feather name="map" size={24} color={color} />
            ),
            tabBarLabel: "Map",
            headerShown: true,
            detachPreviousScreen: true,
          }}
        />
        <Tabs.Screen
          name="qr"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="qr-code" size={24} color={color} />
            ),
            tabBarLabel: "QR Scanner",
            headerShown: true,
            detachPreviousScreen: true,
          }}
        />
      </Tabs>
    </LocationProvider>
  );
}
