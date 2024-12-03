import * as FileSystem from 'expo-file-system';

/**
 * Save a Base64 string as an image file and return its URI.
 * @param {string} base64String - The Base64-encoded string (without data URI prefix).
 * @param {string} fileName - The name of the file to save, e.g., "image.jpg".
 * @returns {Promise<string>} - The URI of the saved image file.
 */
export const saveBase64ToFile = async (base64String, fileName = "image.jpg") => {
  try {
    // Define the file path in the app's cache directory
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;

    // Write the Base64 string to the file
    await FileSystem.writeAsStringAsync(filePath, base64String, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("File saved to:", filePath);
    return filePath; // Return the file URI
  } catch (error) {
    console.error("Error saving Base64 to file:", error);
    throw error;
  }
};
