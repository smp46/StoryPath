import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import { getProjects, getTrackingByProjectId } from "./api";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all projects
        const data = await getProjects();

        // Filter out projects that are not published
        const publishedProjects = data.filter(
          (project) => project.is_published,
        );

        // Fetch participants count for each project
        const projectsWithTrack = await Promise.all(
          publishedProjects.map(async (project) => {
            const trackingRecords = await getTrackingByProjectId(project.id);
            return {
              ...project,
              // Store the number of participants (tracking records) for each project
              participantsCount: trackingRecords.length,
            };
          }),
        );

        setProjects(projectsWithTrack);
      } catch (error) {
        setError(error.message || "Error fetching project data");
      }
    }

    fetchData();
    setLoading(false);
  }, []);

  // If the projects are still loading, display a loading indicator.
  if (loading) {
    return (
      <View className="flex-1 justify-center align-middle items-center">
        <ActivityIndicator size="large" color={"#51247a"} />
        <Text className="text-primary text-bold text-center justify-center">
          Projects loading...
        </Text>
      </View>
    );
  }

  // If there is an error fetching the projects, display the error message.
  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-600">Error: {error}</Text>
      </View>
    );
  }

  // Render each project as a touchable item that directs to the project page.
  const renderItem = ({ item }) => (
    <>
      <TouchableOpacity
        className="p-4 border-2 border-primary border-opacity-30 bg-white rounded-md"
        onPress={() => router.push(`/projects/project?projectId=${item.id}`)}
      >
        <Text className="text-lg font-bold">{item.title}</Text>
        <Text className="text-sm text-gray-500">
          Participants: {item.participantsCount || 0}
        </Text>
      </TouchableOpacity>

      <View className="p-2"></View>
    </>
  );

  return (
    <>
      <View className="border-t border-gray-300"></View>
      <View className="m-5">
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </>
  );
}
