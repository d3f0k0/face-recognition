import React, { useState } from "react";
import { View, Image, StyleSheet, Alert, Modal, Text, TouchableOpacity } from "react-native";
import Button from "./Button";
import * as ImagePicker from "expo-image-picker";
import Ionicons from '@expo/vector-icons/Ionicons';

interface ImagePickerProps {
  image: string | null; // Current image state
  setImage: (uri: string | null) => void; // Function to update the image state
}

export default function ImagePickerComponent({ image, setImage }: ImagePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "You need to grant media library permissions to pick an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setModalVisible(false); // Close modal after selection
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "You need to grant camera permissions to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setModalVisible(false); // Close modal after selection
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          <Button label="Remove Image" 
            onPress={() => setImage(null)} 
            style={styles.button_remove} 
            icon={<Ionicons name="close" size={24} color="black" />}
            />
        </>
      ) : (
        <>
          <Button label="Pick an Image" 
            onPress={() => setModalVisible(true)} 
            style={styles.button_add}
            icon={<Ionicons name="images" size={24} color="black" />}
            />
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select an Option</Text>
                <TouchableOpacity onPress={pickImage} style={styles.optionButton}>
                  <Text style={styles.optionText}>Pick from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={takePhoto} style={styles.optionButton}>
                  <Text style={styles.optionText}>Take a Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.optionButton}
                >
                  <Text style={styles.optionText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#007bff",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },

  button_add: {
    backgroundColor: "white"
  },
  button_remove: {
    backgroundColor: "red"
  }
});

