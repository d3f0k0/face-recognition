import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { AsyncStorage } from "expo-sqlite/kv-store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import * as ImagePicker from 'expo-image-picker'

import Card from "../../components/Card";
import { useClassStore, useLoadingStore, useStudentStore } from "../../misc/stores";
import Button from "../../components/Button";
import Fab from "../../components/Fab";
import { recognizeWithEmbeddings } from '../../misc/recognition_backend'
import { generateRandomBase64, saveBase64ToFile } from '../../misc/utils'
import Spinner from "../../components/Spinner";
import {addRecognitionResultBatch} from "../../misc/database";



export default function Index() {
    const { t } = useTranslation()
    const { id } = useLocalSearchParams();
    const database = useSQLiteContext()

    const { selectedClass } = useClassStore()
    const { currentStudentList, setById } = useStudentStore()

    const [spinning, setSpinning] = useState(false)

    const loadData = useCallback((idNum: number, db: SQLiteDatabase) => {
        setById(idNum, db)
        console.log(currentStudentList)
    }, [setById])


    const beginFaceRecognition = async () => {
    const recognitionUrl = await AsyncStorage.getItemAsync("apiKey")
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "You need to grant camera permissions to take a photo.");
      return;
    }
    // const result = await ImagePicker.launchCameraAsync({
    //   allowsEditing: true,
    //   quality: 1,
    // });
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      let embeddingList = []
      for (const student of currentStudentList) {
        // Parse the embedding JSON string if it exists
        let embeddingData = null
        try {
          if (student.embedding) {
            embeddingData = JSON.parse(student.embedding).embedding
          }
        } catch (error) {
          console.error(`Failed to parse embedding for student ${student.id}:`, error)
          continue // Skip this student if parsing fails
        }

        // Only add to list if embedding exists and was parsed successfully
        if (embeddingData) {
          embeddingList.push({
            name: student.id,
            embedding: embeddingData // Use the actual embedding array
          })
        }
      }

      try {
        setSpinning(true);
        if (embeddingList.length === 0) {
            Alert.alert("No Embeddings", "No students with embeddings found in this class.");
            return;
        }

        const apiResult = await recognizeWithEmbeddings(recognitionUrl, result.assets[0].uri, embeddingList);
        let processedResults = [];
        
        for (const item of apiResult) {
            let randomBase64 = await generateRandomBase64(16);
            processedResults.push({
                face: await saveBase64ToFile(item.face, `${randomBase64}.jpg`),
                best_match: item.best_match === "No matches found" ? null : item.best_match,
                matches: item.best_match === "No matches found" ? null : item.matches,
            });
        }

        await addRecognitionResultBatch(database, Number(id), processedResults);
        router.navigate(`/${id}/result`);
    } catch (e) {
        console.error(e);
        Alert.alert("Error", "Failed to process recognition results");
    } finally {
        setSpinning(false);
    }}}


    useFocusEffect(
        useCallback(() => {
            loadData(Number(id), database)
        }, [id, database, loadData])
    )

    return (
        <View style={{ flex: 1, padding: 15 }}>
            {/* class Card */}
            <Card style={{}}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center' }}>
                    {selectedClass.className}
                </Text>
                <Text style={{ textAlignVertical: 'auto', textAlign: 'center', marginBottom: 15 }}>
                    {selectedClass?.description}
                </Text>
                <View style={{
                    alignItems: 'center', // Centers the button horizontally
                }}>
                    <Button label={t('class.capture')}
                        style={{
                            marginHorizontal: 0,
                        }} onPress={async () => {
                            beginFaceRecognition()
                        }} />
                </View>
            </Card>

            {/* Student List */}
            <ScrollView>
                {currentStudentList && currentStudentList.length > 0 ? (
                    currentStudentList.map((student) => {
                        return (
                            <View key={student.id} >
                                <Card style={styles.card}>
                                    <View style={styles.cardContent}>
                                        <Image source={{ uri: student.imageURL }} style={styles.image} />
                                        <Text style={styles.text}>{student.studentName}</Text>
                                        {student.embedding != null ? (
                                            <MaterialIcons name="check" size={24} color="black" />
                                        ) : (<MaterialIcons name="close" size={24} color="black" />)}
                                        <TouchableOpacity style={styles.icon} onPress={() => {

                                        }}>
                                            <MaterialIcons name="more-vert" size={40} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                </Card>
                            </View>)
                    })) : (
                    <Text>No students available</Text>
                )}
            </ScrollView>
            <Spinner visible={spinning} />
            {/* Misc: Fabs, Modals, ...*/}
            <Fab
                label={<Ionicons name="add" size={32} color="white" />}
                size={70}
                onPress={() => router.push(`/${id}/addstudent`)} // Navigate to AddStudent
            />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 15, // Optional margin for spacing between cards
        paddingHorizontal: 10, // Padding inside the card for spacing
        paddingVertical: 15, // Optional padding for height balance
    },
    cardContent: {
        flexDirection: 'row', // Align text, image, and icon horizontally
        alignItems: 'center', // Vertically center the content
        justifyContent: 'space-between', // Spread content evenly
    },
    text: {
        fontSize: 18,
        flex: 1, // Allow the text to take up remaining space
        marginLeft: 10, // Adds space between the image and the text
    },
    image: {
        width: 80, // Size of the image
        height: 80,
        borderRadius: 3,
    },
    icon: {
        padding: 5, // Optional touchable area padding
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },

});