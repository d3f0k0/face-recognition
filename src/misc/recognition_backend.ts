import {readAsStringAsync, EncodingType} from 'expo-file-system';
import {fetch} from 'expo/fetch'; // Correct import


const url = "https://rugby-viewer-cooked-bouquet.trycloudflare.com"

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


