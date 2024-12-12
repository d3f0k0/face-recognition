import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal, Pressable, Alert } from "react-native";
import Card from "../../components/Card";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "expo-sqlite/kv-store";
import { ClassCardType } from "../../components/ClassCard";
import Ionicons from '@expo/vector-icons/Ionicons';
import Fab from "../../components/Fab";
import Button from "../../components/Button";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import * as ImagePicker from 'expo-image-picker'
import { getEmbeddings, recognizeWithEmbeddings } from "../../misc/recognition_backend";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Spinner from "../../components/Spinner";
import { saveBase64ToFile } from "../../misc/result_process";
import ImageModal from '../../components/class/ImageModel'
import * as Crypto from 'expo-crypto';


export interface StudentType {
  id: number
  name: string,
  image: string,
  hadEmbedding: boolean,
  embedding: any
  embeddingFace?: any
}

export default function ClassPage() {
  const { id } = useLocalSearchParams();
  const tableID = "table_" + id;
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<ClassCardType | null>();
  const [studentData, setStudentData] = useState<StudentType[] | null>();
  const [currentlyStudent, setCurrentlyStudent] = useState<number>();
  const [spinning, setSpinning] = useState(false);
  const [reloading, setReloading] = useState(false)
  const [FaceImage, setFaceImage] = useState(false)
  const [bottomSheetStudent, setBottomSheetStudent] = useState<StudentType>()

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = JSON.parse(await AsyncStorage.getItem("main"));
      const value = data.find(item => item.id == id);
      if (value) {
        setClassData(value);
      }
      const studentListData = JSON.parse(await AsyncStorage.getItem(tableID));
      if (studentListData) {
        setStudentData(studentListData);
      } else {
        setStudentData([]);
      }
    } catch (error) {

      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [id, tableID]);

  const reloadStudentData = useCallback(async () => {
    setLoading(true);
    const studentListData = JSON.parse(await AsyncStorage.getItem(tableID));
    if (studentListData) {
      setStudentData(studentListData);
    } else {
      setStudentData([]);
    }

    setLoading(false);

  }, [tableID]);

  // Function to generate a random Base64 string
  const generateRandomBase64 = async (length) => {
    try {
        // Generate random bytes using expo-crypto
        const randomBytes = await Crypto.getRandomBytesAsync(length);

        // Convert the random bytes into a string
        let string = '';
        for (let i = 0; i < randomBytes.length; i++) {
            string += String.fromCharCode(randomBytes[i]);
        }

        // Return the Base64 encoded string
        return btoa(string);
    } catch (error) {
        console.error("Error generating random Base64:", error);
    }
};

  const takePhoto = async () => {
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
      for (const student of studentData) {
        embeddingList.push({
          name: student.id,
          embedding: student.embedding
        })
      }
      try {
        setSpinning(true)
        let resultReturned = []
        const apiResult = await recognizeWithEmbeddings(result.assets[0].uri, embeddingList)
        let returnResult;
        try {
          returnResult = typeof apiResult === "string" ? JSON.parse(apiResult) : apiResult;
        } catch (parseError) {
          console.error("Error parsing API result:", parseError);
          return;
        }
        for (const item of returnResult) {
          let randomBase64 = await generateRandomBase64(16)
          resultReturned.push({
            face: await saveBase64ToFile(item.face, `${returnResult.indexOf(item)}_${randomBase64}.jpg`),
            best_match: item.best_match == "No matches found" ? null : item.best_match
          })
        }
        console.log(resultReturned)
        await AsyncStorage.setItem("temp_results", JSON.stringify(resultReturned));
      } catch (e) {
        console.log(e)
      } finally {
        setSpinning(false)
        router.navigate(`/${id}/result`)
      }
    }
  }

  const closeModal = () => {
    setFaceImage(false);
    setBottomSheetStudent(null);
  };


  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      reloadStudentData(); // Re-load data when screen is focused
    }, [reloadStudentData])
  );


  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1, padding: 15 }}>
        <Card style={{}}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center' }}>
            {classData?.name}
          </Text>
          <Text style={{ textAlignVertical: 'auto', textAlign: 'center', marginBottom: 15 }}>
            {classData?.description}
          </Text>
          <View style={{
            alignItems: 'center', // Centers the button horizontally
          }}>
            <Button label="Capture attendance"
              style={{
                marginHorizontal: 0,
              }} onPress={async () => { takePhoto() }} />
          </View>
        </Card>

        <ScrollView>
          {studentData && studentData.length > 0 ? (
            studentData.map((student) => {
              return (
                <View key={student.id}>
                  <Card style={styles.card}>
                    <View style={styles.cardContent}>
                      <Image source={{ uri: student.image }} style={styles.image} />
                      <Text style={styles.text}>{student.name}</Text>
                      {student.hadEmbedding ? (
                        <MaterialIcons name="check" size={24} color="black" />
                      ) : (<MaterialIcons name="close" size={24} color="black" />)}
                      <TouchableOpacity style={styles.icon} onPress={() => {
                        setCurrentlyStudent(student.id)
                        console.log(student)
                        handlePresentModalPress()
                      }}>
                        <MaterialIcons name="more-vert" size={40} color="black" />
                      </TouchableOpacity>
                    </View>
                  </Card>
                </View>
              );
            })
          ) : (
            <Text>No students available</Text>
          )}
        </ScrollView>
        <ImageModal
          visible={FaceImage}
          onClose={() => setFaceImage(false)}
          imageUri={bottomSheetStudent?.embeddingFace}
        />
        <Spinner visible={spinning} />
        <Fab
          label={<Ionicons name="add" size={32} color="white" />}
          size={70}
          onPress={() => router.push(`/${id}/addstudent`)} // Navigate to AddStudent
        />
      </View >
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        onDismiss={() => setCurrentlyStudent(0)}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Currently Selected: {currentlyStudent}</Text>
          <Button label="Regenerate embeddings" onPress={async () => {
            const table = JSON.parse(await AsyncStorage.getItem(tableID))
            const selectedStudent = table.find((item) => item.id == currentlyStudent)
            const embedding = await getEmbeddings(selectedStudent.image)
            let changeStudent = selectedStudent
            changeStudent["hadEmbedding"] = true
            changeStudent["embedding"] = embedding
            let newTable = table.filter((item) => {
              item != selectedStudent
            })
            newTable.push(changeStudent)
            await AsyncStorage.setItem(tableID, JSON.stringify(newTable))
            await reloadStudentData()
          }} />
          <Button label="Remove Student" onPress={async () => {
            const table = JSON.parse(await AsyncStorage.getItem(tableID))
            const selectedStudent = table.find((item) => item.id == currentlyStudent)
            let newTable = table.filter((item) => {
              item != selectedStudent
            })
            for (const item of newTable) {
              item["id"] = newTable.indexOf(item)
            }
            await AsyncStorage.setItem(tableID, JSON.stringify(newTable))
            await reloadStudentData()
          }} />
          <Button
            label="View Cropped Face"
            onPress={async () => {
              const table = JSON.parse(await AsyncStorage.getItem(tableID));
              const selectedStudent = table.find((item) => item.id == currentlyStudent);
              setBottomSheetStudent(selectedStudent);
              setFaceImage(true);
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
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