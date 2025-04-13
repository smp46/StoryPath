import React, { useState, useEffect, useCallback } from "react";
import { Appearance, View, SafeAreaView, Text } from "react-native";
import MapView, { Circle } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import { useFocusEffect } from "@react-navigation/native";
import { useGlobalSearchParams } from "expo-router";

import { getLocations, getTrackingByUserProj } from "../api";
import { loadFromStorage } from "../storage";

// Get light or dark mode
const colorScheme = Appearance.getColorScheme();

// Component to display the nearby location.
function NearbyLocation(props) {
  if (typeof props.location !== "undefined") {
    return (
      <SafeAreaView className="bg-primary rounded-t-md">
        <View className="p-5">
          <Text className="text-white leading-6">{props.location}</Text>
          {props.distance.nearby && (
            <Text className="font-bold text-white leading-6">
              Within 100 Metres!
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

// Main component to display the map and nearby location.
export default function ShowMap() {
  const globalParams = useGlobalSearchParams();
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [mapState, setMapState] = useState({
    locationPermission: false,
    locations: [],
    userLocation: {
      latitude: -27.4927871781,
      longitude: 153.014217483,
    },
    nearbyLocation: {},
  });

  // Load username and request location permission on initial mount
  useEffect(() => {
    async function loadProfileData() {
      try {
        const storedUsername = await loadFromStorage("username");
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          setError("Please navigate to Profile and set a Username to continue");
        }
      } catch (err) {
        setError("Error loading username.");
      }
    }

    async function requestLocationPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setMapState((prevState) => ({
          ...prevState,
          locationPermission: true,
        }));
      }
    }

    loadProfileData();
    requestLocationPermission();
  }, []);

  // Initial data fetching when projectId is given
  useEffect(() => {
    async function fetchInitialLocations() {
      // Ensure username and projectId is loaded
      if (!username || !globalParams.projectId) return;
      try {
        const data = await getLocations(globalParams.projectId);
        const trackings = await getTrackingByUserProj(
          username,
          globalParams.projectId,
        );

        // Filter locations based on whether their id matches any location_id in the trackings
        const updatedLocations = data
          .filter((location) =>
            trackings.some((tracking) => tracking.location_id === location.id),
          )
          .map((location) => {
            // Convert string-based latlong to object-based on each location
            const latlong = location.location_position
              .replace(/[()]/g, "")
              .split(",");
            location.coordinates = {
              latitude: parseFloat(latlong[0]),
              longitude: parseFloat(latlong[1]),
            };
            return location;
          });

        setMapState((prevState) => ({
          ...prevState,
          locations: updatedLocations,
        }));
      } catch (err) {
        setError(err.message || "Error fetching locations data");
      }
    }

    fetchInitialLocations();
  }, [username, globalParams.projectId]); // Run on initial load when projectId or username changes

  // Logic to update when the screen is focused or locationId changes
  useFocusEffect(
    useCallback(() => {
      async function fetchUpdatedLocations() {
        if (!username || !globalParams.projectId) return; // Ensure username is loaded
        try {
          const data = await getLocations(globalParams.projectId);
          const trackings = await getTrackingByUserProj(
            username,
            globalParams.projectId,
          );

          // Filter locations based on whether their id matches any location_id in the trackings
          const updatedLocations = data
            .filter((location) =>
              trackings.some(
                (tracking) => tracking.location_id === location.id,
              ),
            )
            .map((location) => {
              // Convert string-based latlong to object-based on each location
              const latlong = location.location_position
                .replace(/[()]/g, "")
                .split(",");
              location.coordinates = {
                latitude: parseFloat(latlong[0]),
                longitude: parseFloat(latlong[1]),
              };
              return location;
            });

          setMapState((prevState) => ({
            ...prevState,
            locations: updatedLocations,
          }));
        } catch (err) {
          setError(err.message || "Error fetching locations data");
        }
      }

      fetchUpdatedLocations();
    }, [username, globalParams.projectId, globalParams.locationId]),
  );

  // Function to retrieve the nearest locations to the user
  useEffect(() => {
    function calculateDistance(userLocation) {
      const nearestLocations = mapState.locations
        .map((location) => {
          const metres = getDistance(userLocation, location.coordinates);
          location["distance"] = {
            metres: metres,
            nearby: metres <= 100 ? true : false,
          };
          return location;
        })
        .sort((previousLocation, thisLocation) => {
          return (
            previousLocation.distance.metres - thisLocation.distance.metres
          );
        });
      return nearestLocations.shift();
    }

    let locationSubscription = null;

    if (mapState.locationPermission) {
      (async () => {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // in meters
          },
          (location) => {
            const userLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            const nearbyLocation = calculateDistance(userLocation);
            setMapState((prevState) => ({
              ...prevState,
              userLocation,
              nearbyLocation: nearbyLocation,
            }));
          },
        );
      })();
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [mapState.locationPermission]);

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-600">Error: {error}</Text>
      </View>
    );
  }

  return (
    <>
      <MapView
        camera={{
          center: mapState.userLocation,
          pitch: 0, // Angle of 3D map
          heading: 0, // Compass direction
          altitude: 3000, // Zoom level for iOS
          zoom: 15, // Zoom level For Android
        }}
        showsUserLocation={mapState.locationPermission}
        className="flex-1"
      >
        {mapState.locations.map((location) => (
          <Circle
            key={location.id}
            center={location.coordinates}
            radius={100}
            strokeWidth={3}
            strokeColor="#A42DE8"
            fillColor={
              colorScheme === "dark"
                ? "rgba(128,0,128,0.5)"
                : "rgba(210,169,210,0.5)"
            }
          />
        ))}
      </MapView>
      <NearbyLocation {...mapState.nearbyLocation} />
    </>
  );
}
