import { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, View, Text, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Fab from "../../components/Fab";
import { router, useFocusEffect } from "expo-router";
import { ClassCard } from "../../components/ClassCard";
import {Class} from '../../misc/types'
import * as SQLite from 'expo-sqlite'
import {useClassStore, useLoadingStore} from '../../misc/stores'
import { useTranslation } from "react-i18next";

export default function Index() {
  const {t} = useTranslation()
  const [classCards, setClassCards] = useState<Class[] | null>(null);
  const {setById} = useClassStore()
  const {startLoading, stopLoading, isLoading} = useLoadingStore()
  let database = SQLite.useSQLiteContext()

  const loadData = useCallback(async () => {
    try {
      startLoading()  // Fixed: Added parentheses to call the function
      let classCardsCollection: Class[] = await database.getAllAsync(
        "SELECT * FROM classes"
      )
      if (classCardsCollection) {
        setClassCards(classCardsCollection);
      } else {
        setClassCards([]);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      setClassCards([]);
    } finally {
      stopLoading()  // Fixed: Added parentheses to call the function
    }
  }, [database]);  // Added missing dependencies

  useFocusEffect(
    useCallback(() => {
      loadData();
      Alert.alert(t('beta_warning'), t('beta_warning_description')) // JANKNESS WARNING LOL
    }, [loadData])
  );

  if (isLoading) {
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
              title={classItem.className}
              description={classItem.description}
              onPress={async () => {
                await setById(classItem.id, database)
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
