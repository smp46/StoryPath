import React, { useEffect, useState, useContext } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import Feather from "@expo/vector-icons/Feather";
import { TouchableOpacity } from "react-native";

import {
  getLocations,
  getProject,
  getTrackingByUserProj,
  createTracking,
} from "../api";
import { loadFromStorage } from "../storage";
import { LocationContext } from "./LocationContext";

export default function Project() {
  const globalParams = useGlobalSearchParams(); // Get the url params
  const { locationId } = useContext(LocationContext); // Get the locationId from the context
  const [project, setProject] = useState(null); // State to store the project data
  const [error, setError] = useState(null); // State to store error messages
  const [displayClue, setDisplayClue] = useState(true); // Boolean state to toggle display of all locations or initial clue.
  const [locations, setLocations] = useState([]); // State to store the locations list.
  const [loading, setLoading] = useState(true); // State to track loading status
  const [username, setUsername] = useState(""); // State to store the username
  const [scorePoints, setScorePoints] = useState(0); // State to store the total scored points
  const [visitedCount, setVisitedCount] = useState(0); // State to store the total visited locations
  const [currentLoc, setCurrentLoc] = useState(null); // State to store the current location data.

  // Fetch project and profile data on initial load
  useEffect(() => {
    async function loadProfileData() {
      try {
        const storedUsername = await loadFromStorage("username");
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          setError(
            "Please navigate to Profile and set a Username to continue.",
          );
        }
      } catch (err) {
        setError("Error loading username.");
      }
    }

    async function fetchProjectData() {
      try {
        const data = await getProject(globalParams.projectId); // Fetch project data from API
        setProject(data[0]);

        if (
          // Use the homescreen_display field to determine if all locations should be displayed.
          data[0].homescreen_display.toUpperCase() === "DISPLAY ALL LOCATIONS"
        ) {
          setDisplayClue(false);
          const locationData = await getLocations(globalParams.projectId);
          setLocations(locationData); // Set the locations state
        }
      } catch (err) {
        setError(err.message || "Error fetching project data.");
      }
    }

    loadProfileData();
    fetchProjectData();

    setLoading(false);
  }, [globalParams.projectId]);

  // Retrieve the location content from the API
  async function getLocationContent() {
    try {
      const locationData = await getLocations(globalParams.projectId);

      // Filter the location to only include the one that matches the locationId
      const filteredLocation = locationData.find(
        (loc) => parseInt(loc.id) === parseInt(locationId),
      );

      if (filteredLocation) {
        return filteredLocation; // Return the filtered location
      } else {
        setError("Location not found.");
      }
    } catch (err) {
      setError("Error fetching location content.");
    }
  }

  // Logic to check if the location has been visited and update the tracking data.
  async function visitedLogic() {
    try {
      if (locationId !== null) {
        // Don't proceed if locationId is null
        const locationData = await getLocationContent();
        setCurrentLoc(locationData);
        const userTrackings = await getTrackingByUserProj(
          username,
          globalParams.projectId,
        );
        // Filter the userTrackings to only include the one that matches the locationId.
        const thisLocation = userTrackings.filter(
          (row) => parseInt(row.location_id) === parseInt(locationId),
        );

        if (thisLocation.length === 0) {
          // If no tracking records exist, it means the location hasn't been visited yet
          const trackingData = {
            participant_username: username,
            project_id: globalParams.projectId,
            location_id: locationId,
            points: locationData.score_points,
          };

          // Create a new tracking record
          await createTracking(trackingData);
        }
      }
    } catch (err) {
      setError("Error processing tracking data.");
    }
  }

  // Calculate the total score points and visited locations count and update their states.
  async function scoreAndVisitUpdate() {
    // Fetch tracking data and update visitedCount and scorePoints
    const trackings = await getTrackingByUserProj(
      username,
      globalParams.projectId,
    );
    setVisitedCount(trackings.length);

    const totalPoints = trackings.reduce(
      (sum, tracking) => sum + tracking.points,
      0,
    );
    setScorePoints(totalPoints);
  }

  // Update score and visited count when the screen comes into focus.
  useFocusEffect(() => {
    scoreAndVisitUpdate();
  });

  // If the locationId changes, update the visited locations and score points and run visit logic.
  useFocusEffect(
    React.useCallback(() => {
      // Re-run logic when screen comes into focus
      if (locationId !== null) {
        visitedLogic();
        scoreAndVisitUpdate();
      }
    }, [locationId]),
  );

  // Function to inject meta viewport tag into the HTML content (allows for WebView content to scale to screen size)
  function injectViewport(htmlContent) {
    const viewportMetaTag = `
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    `;

    // Inject the meta tag inside the head tag (or before the body if no head exists)
    const headTagIndex = htmlContent.indexOf("<head>");
    if (headTagIndex !== -1) {
      return htmlContent.replace("<head>", `<head>${viewportMetaTag}`);
    }

    // If no <head> tag is found, inject the meta tag before the <body> tag
    const bodyTagIndex = htmlContent.indexOf("<body>");
    if (bodyTagIndex !== -1) {
      return htmlContent.replace(
        "<body>",
        `<head>${viewportMetaTag}</head><body>`,
      );
    }

    // If no <head> or <body> tags are found, just prepend the meta tag
    return `${viewportMetaTag}${htmlContent}`;
  }

  // Display loading indicator while fetching data
  if (loading) {
    return (
      <View className="flex-1 justify-center align-middle items-center">
        <ActivityIndicator size="large" color="#51247a" />
        <Text className="text-primary text-bold text-center justify-center flex-1">
          Project loading...
        </Text>
      </View>
    );
  }

  // Display error message if there is an error
  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red">Error: {error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Project Card */}
      <View className="bg-white rounded-lg shadow-lg w-full p-5 flex-1 justify-between">
        {/* Project Title */}
        <View className="bg-primary px-4 py-2">
          <Text className="text-white text-xl font-bold text-center">
            {project?.title}
          </Text>
        </View>

        {/* Instructions or Clue*/}
        <View className="mt-6">
          {locationId === null || currentLoc === null ? (
            <>
              <Text className="text-lg font-bold mb-2 text-center">
                Instructions:
              </Text>
              <Text className="text-base text-gray-700 leading-6 text-center">
                {project?.instructions || "No instructions provided."}
              </Text>
            </>
          ) : (
            <>
              <Text className="text-lg font-bold mb-2 text-center">
                Next Clue:
              </Text>
              <Text className="text-base text-gray-700 leading-6 text-center">
                {currentLoc?.clue || "No instructions provided."}
              </Text>
            </>
          )}
        </View>

        {/* Section Divider */}
        <View className="border-t border-gray-200 my-4"></View>

        {/* Location Content */}
        <ScrollView className="mt-2">
          {locationId === null || currentLoc === null ? (
            displayClue ? (
              <>
                <Text className="text-lg font-bold mb-2 text-center">
                  Initial Clue:
                </Text>
                <Text className="text-base text-gray-700 leading-6 text-center">
                  {project?.initial_clue || "No initial clue provided."}
                </Text>
              </>
            ) : (
              <>
                <Text className="text-lg font-bold mb-2 text-center">
                  All Locations:
                </Text>
                <View className="text-base text-gray-700 leading-6">
                  {locations && locations.length > 0 ? (
                    locations.map((location, index) => (
                      <Text key={index} className="text-center">
                        • {location.location_name}
                      </Text>
                    ))
                  ) : (
                    <Text>No locations available.</Text>
                  )}
                </View>
              </>
            )
          ) : (
            <>
              <Text className="text-lg font-bold mb-2 text-center">
                {currentLoc?.location_name || "No Location Name Found"}
              </Text>

              {/* Render HTML content in WebView */}
              {currentLoc?.location_content ? (
                <WebView
                  originWhitelist={["*"]}
                  source={{ html: injectViewport(currentLoc.location_content) }} // Use the modified HTML content
                  style={{ height: 300, width: "100%" }} // Set appropriate height for the WebView
                  scalesPageToFit={true} // Scales the page to fit the view
                />
              ) : (
                <Text className="text-base text-gray-700 leading-6 text-center">
                  No content was found for this location.
                </Text>
              )}
            </>
          )}
        </ScrollView>

        {/* A button to return to project homepage */}
        {locationId !== null && currentLoc != null && (
          <>
            <View className="mt-auto">
              <TouchableOpacity
                className="bg-primary px-4 py-2 self-center"
                onPress={() => resetLocation()}
              >
                <Feather name="home" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </>
        )}
        {/* Footer */}
        <View className="flex-row mt-3 border-t border-gray-200">
          <View className="w-1/2 py-3 bg-primary">
            <Text className="text-center text-white font-bold">
              Score: {scorePoints}
            </Text>
          </View>
          <View className="w-1/2 py-3 bg-primary">
            <Text className="text-center text-white font-bold">
              Locations Visited: {visitedCount}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
