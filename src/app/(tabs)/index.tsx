import { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Fab from "../../components/Fab";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "expo-sqlite/kv-store";
import { ClassCardType, ClassCard } from "../../components/ClassCard";

export default function Index() {
  const [classCards, setClassCards] = useState<ClassCardType[] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem("main");
      if (data) {
        setClassCards(JSON.parse(data));
      } else {
        setClassCards([]);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      setClassCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(); // Initial load when component mounts
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData(); // Re-load data when screen is focused
    }, [loadData])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {classCards && classCards.length > 0 ? (
          classCards.map((classItem) => (
            <ClassCard
              key={classItem.id}
              id={classItem.id}
              title={classItem.name}
              description={classItem.description}
              onPress={() => {
                router.push(`/${classItem.id}`);
              }}
            />
          ))
        ) : (
          <Text>No classes available</Text>
        )}
      </ScrollView>
      <Fab
        label={<Ionicons name="add" size={32} color="white" />}
        size={70}
        onPress={() => router.push("/create")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
