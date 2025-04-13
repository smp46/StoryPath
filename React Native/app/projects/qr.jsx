import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Camera, CameraView } from "expo-camera"; // Use Camera instead of CameraView
import { router } from "expo-router";

import { LocationContext } from "./LocationContext";

export default function QR() {
  const [hasPermission, setHasPermission] = useState(null); // State to store camera permission status
  const [scanned, setScanned] = useState(false); // State to store if a QR code has been scanned
  const [scannedData, setScannedData] = useState(""); // State to store the scanned QR code data
  const [badQR, setBadQR] = useState(false); // State to store if the scanned QR code is invalid
  const { saveLocationId } = useContext(LocationContext); // Get the saveLocationId function from the LocationContext

  // On component mount, request camera permissions
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  // Function to navigate to the location content page on successful QR scan.
  function goToLocationContent() {
    const ids = scannedData.split(",");

    if (ids.length === 2) {
      setScannedData("");
      setScanned(false);
      saveLocationId(ids[1]);
      router.navigate(`projects/project?projectId=${ids[0]}`);
    } else {
      // If the QR code does not match the expected format, set badQR to true.
      setBadQR(true);
    }
  }

  // Function to handle the scanned QR code data
  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
  };

  // If camera permissions are still loading, display a loading message.
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  // If camera permissions are denied, display a message.
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // If the QR code is invalid, display an error message.
  if (badQR) {
    return (
      <Text className="text-red text-center">
        Uh oh! That QR did not match the expected format of: projectId,
        locationId
      </Text>
    );
  }

  return (
    <View className="flex-1 flex-col justify-center">
      {/* Camera view to scan QR codes */}
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      <View className="justify-center items-center">
        <View className="border-4 border-primary w-64 h-64 opacity-90" />
      </View>

      {/* Display actions buttons when a QR code is scanned */}
      {scanned && (
        <View className="flex flex-row justify-center items-center mt-4">
          <TouchableOpacity
            onPress={() => setScanned(false)}
            className="bg-primary py-2 px-4 rounded-md"
          >
            <Text className="text-white text-base">Tap to Scan Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => goToLocationContent()}
            className="bg-secondary py-2 px-4 rounded-md ml-2"
          >
            <Text className="text-white text-base">Visit Location</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
