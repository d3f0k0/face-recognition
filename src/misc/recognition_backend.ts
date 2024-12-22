import {readAsStringAsync, EncodingType} from 'expo-file-system';
import { zlibSync, unzlibSync, strToU8, strFromU8 } from "fflate";
import {fetch} from 'expo/fetch'; // Correct import


let url = ""

url = "https://dedicated-comm-catalyst-absent.trycloudflare.com"

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

export const getEmbeddingsCompressed = async (imageUri: string) => {
  try {
    // Convert the image to Base64
    const base64Image = await readAsStringAsync(imageUri, {
      encoding: EncodingType.Base64,
    });

    // Prepare the payload
    const payload = JSON.stringify({ image: base64Image });

    // Compress the payload with fflate
    const compressedPayload = zlibSync(strToU8(payload)); // Convert string to Uint8Array and compress

    // API endpoint
    const apiUrl = `${url}/generate-embedding-compressed`;

    // Make the POST request with compressed data
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Encoding": "zstd", // Specify Zstd encoding
        "Accept-Encoding": "zstd", // Accept compressed responses
      },
      body: compressedPayload, // Send the compressed payload
    });

    // Check for server response status
    if (!response.ok) {
      console.error("Server error:", response.status, response.statusText);
      return null;
    }

    // Read the response as an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Convert ArrayBuffer to Uint8Array for decompression
    const responseData = new Uint8Array(arrayBuffer);

    // Decompress the response if Content-Encoding is zstd
    let decompressedData: Uint8Array;
    if (response.headers.get("Content-Encoding") === "zstd") {
      decompressedData = unzlibSync(responseData); // Decompress using fflate
    } else {
      decompressedData = responseData; // If not compressed, use as is
    }

    // Parse the decompressed data as JSON
    const data = JSON.parse(strFromU8(decompressedData)); // Convert Uint8Array to string and parse JSON

    return [data.embedding, data.face]; // Return embeddings and face
  } catch (error) {
    console.error("Error during fetch:", error.message);
    return null;
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


export const recognizeWithEmbeddingsCompressed = async (imageUri: string, embeddings: any[]) => {
  try {
    // Convert the image to Base64
    const base64Image = await readAsStringAsync(imageUri, {
      encoding: EncodingType.Base64,
    });

    // Prepare the payload
    const payload = JSON.stringify({
      image: base64Image,
      embeddings, // Embeddings list
    });

    // Compress the payload with fflate
    const compressedPayload = zlibSync(strToU8(payload)); // Convert string to Uint8Array and compress

    // API endpoint
    const apiUrl = `${url}/recognize-with-embeddings-compressed`;

    // Make the POST request with compressed data
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Encoding": "zstd", // Specify Zstd encoding
        "Accept-Encoding": "zstd", // Accept compressed responses
      },
      body: compressedPayload, // Send the compressed payload
    });

    // Check for server response status
    if (!response.ok) {
      console.error("Server error:", response.status, response.statusText);
      return null;
    }

    // Read the response as an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Convert ArrayBuffer to Uint8Array for decompression
    const responseData = new Uint8Array(arrayBuffer);

    // Decompress the response if Content-Encoding is zstd
    let decompressedData: Uint8Array;
    if (response.headers.get("Content-Encoding") === "zstd") {
      decompressedData = unzlibSync(responseData); // Decompress using fflate
    } else {
      decompressedData = responseData; // If not compressed, use as is
    }

    // Parse the decompressed data as JSON
    const data = JSON.parse(strFromU8(decompressedData)); // Convert Uint8Array to string and parse JSON

    if (data.recognition_results) {
      return data.recognition_results; // Return recognition results
    } else {
      console.warn("Unexpected response format:", data);
      return null;
    }
  } catch (error) {
    console.error("Error during fetch:", error.message);
    return null;
  }
};