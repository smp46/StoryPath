import { View, Text } from "react-native";
import React from "react";

export default function About() {
  return (
    <View className="flex-1 justify-center align-middle items-center">
      <Text className="justify-center text-center text-bold font-semibold">
        This project was written for COMP2140 by Samuel Paynter (s4742372)
      </Text>
    </View>
  );
}
