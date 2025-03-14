import { readAsStringAsync, EncodingType } from 'expo-file-system';
import { router } from 'expo-router';
import { AsyncStorage } from "expo-sqlite/kv-store";
import { fetch } from 'expo/fetch'; // Correct import
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { saveBase64ToFile } from './result_process';
import { useStudentStore, useLoadingStore } from './stores';
import { generateRandomBase64 } from "./utils"


let url = ""

url = "https://poem-amongst-nationally-domains.trycloudflare.com"

export const getEmbeddings = async (imageUri) => {
  const base64Image = await readAsStringAsync(imageUri, {
    encoding: EncodingType.Base64,
  });
  const payload = {
    image: base64Image,
  };

  const apiUrl = url + "/generate-embedding-base64"
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error("Server error:", response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    return [data.embedding, data.face];
  } catch (error) {
    console.error("Error during fetch:", error.message);
  }
};

export const recognizeWithEmbeddings = async (imageUri, embeddings) => {
  try {
    // Convert image to Base64
    const base64Image = await readAsStringAsync(imageUri, {
      encoding: EncodingType.Base64,
    });

    // Prepare the payload
    const payload = {
      image: base64Image,
      embeddings, // Embeddings list
    };

    const apiUrl = `${url}/recognize-with-embeddings-base64`; // Ensure `url` is defined elsewhere
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check for server response status
    if (!response.ok) {
      console.error("Server error:", response.status, response.statusText);
      return null;
    }

    // Parse the JSON response
    const data = await response.json();
    if (data.recognition_results) {
      return data.recognition_results;
    } else {
      console.warn("Unexpected response format:", data);
      return null;
    }
  } catch (error) {
    console.error("Error during fetch:", error.message);
    return null;
  }
};


export async function takePhoto(id: number) {
  const { currentStudentList } = useStudentStore()
  const { startLoading, stopLoading } = useLoadingStore()
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
      embeddingList.push({
        name: student.id,
        embedding: student.embedding
      })
    }
    try {
      startLoading
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
          best_match: item.best_match == "No matches found" ? null : item.best_match,
          matches: item.best_match == "No matches found" ? null : item.matches,
        })
      }
      console.log(resultReturned)
      await AsyncStorage.setItem("temp_results", JSON.stringify(resultReturned));
    } catch (e) {
      console.log(e)
    } finally {
      stopLoading
      router.navigate(`/${id}/result`)
    }
  }
}