import * as Crypto from 'expo-crypto'
import * as FileSystem from 'expo-file-system';

export const generateRandomBase64 = async (length) => {
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

/**
 * Save a Base64 string as an image file and return its URI.
 * @param {string} base64String - The Base64-encoded string (without data URI prefix).
 * @param {string} fileName - The name of the file to save, e.g., "image.jpg".
 * @returns {Promise<string>} - The URI of the saved image file.
 */
export const saveBase64ToFile = async (base64String, fileName) => {
  try {
      // Sanitize the file name to remove invalid characters
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "");

      // Define the directory and file path
      const directory = `${FileSystem.cacheDirectory}images/`;
      const filePath = `${directory}${sanitizedFileName}.jpg`;

      // Ensure the directory exists
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
          console.log("Directory does not exist, creating...");
          await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      // Write the Base64 string to the file
      await FileSystem.writeAsStringAsync(filePath, base64String, {
          encoding: FileSystem.EncodingType.Base64,
      });

      console.log("File saved to:", filePath);
      return filePath;
  } catch (error) {
      console.error("Error saving Base64 to file:", error);
  }
};