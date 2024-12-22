import React, { useState } from "react";
import { View, Text, Modal, Image, StyleSheet, Pressable } from "react-native";

export default function ImageModel({ visible, onClose, imageUri }) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.modalImage} />
          ) : (
            <Text>No image available</Text>
          )}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1, // Takes up the entire screen
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
  },
  modalContent: {
    width: "80%", // Adjust width as needed
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center", // Aligns modal content in the center
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1, // Keeps the image square
    borderRadius: 5,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
