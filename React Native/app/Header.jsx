import React from "react";
import { View, Text, Image } from "react-native";

import logo from "../assets/images/icon.png";

/**
 * Header component
 * @param {string} props.title - The title to display in the header.
 * @returns {React.Component} - A header with the given title on the left and logo on the right.
 */
export default function Header({ title }) {
  return (
    <View className="flex-row justify-between items-center w-full">
      <Text className="text-[20px] text-black flex-1">{title}</Text>
      <View className="flex-row items-center">
        <Text className="text-[20px] font-bold text-black">StoryPath</Text>
        <Image source={logo} className="ml-2 w-[30px] h-[30px]" />
      </View>
    </View>
  );
}
