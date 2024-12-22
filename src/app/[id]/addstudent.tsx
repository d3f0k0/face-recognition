import { View, StyleSheet, Text } from "react-native";
import CreateButton from "../../components/create/CreateButton";
import CreateForm from "../../components/create/CreateForm";
import { useState } from "react";
import { AsyncStorage } from "expo-sqlite/kv-store";
import { router, Stack, useLocalSearchParams } from "expo-router";
import ImagePickerComponent from "../../components/ImagePicker";
import { getEmbeddings, getEmbeddingsCompressed } from "../../misc/recognition_backend";
import Spinner from "../../components/Spinner";
import { saveBase64ToFile } from "../../misc/result_process";
import { useTranslation } from 'react-i18next'

export default function AddStudent() {
    const { t } = useTranslation()
    const { id } = useLocalSearchParams()
    const [name, setName] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const tableID = "table_" + id

    const addStudentAsync = async (name: string, image: string, hadEmbedding: boolean, embedding?: any, embeddingFace?: any) => {
        try {
            const valueString = await AsyncStorage.getItem(tableID);
            const value = valueString ? JSON.parse(valueString) : [];
            value.push({
                id: value.length,
                name: name,
                image: image,
                hadEmbedding: hadEmbedding,
                embedding: hadEmbedding ? embedding : '',
                embeddingFace: hadEmbedding ? embeddingFace : ''
            });
            await AsyncStorage.setItem(tableID, JSON.stringify(value));
        } catch (e) {
            console.error("Failed to save data:", e);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 16, // Optional for spacing
                position: "relative", // Required for absolute positioning
            }}
        >
            <Stack.Screen
                options={{
                    title: t('create.student.title')
                }}
            />
            {/* Centered Content */}
            <View
                style={{
                    width: "100%",
                    alignItems: "center",
                }}
            >
                <CreateForm
                    placeholder={t('create.student.name')}
                    onChange={(name) => setName(name)}
                />
                <ImagePickerComponent image={image} setImage={setImage} />
                {image && <Text style={styles.info}>Selected Image URI: {image}</Text>}
                <Spinner visible={loading} />
            </View>

            {/* Button at Bottom */}
            <View
                style={{
                    position: "absolute",
                    bottom: 20,
                    width: "100%",
                    alignItems: "center",
                }}
            >
                <CreateButton
                    label={"Create"}
                    onPress={async () => {
                        setLoading(true)
                        try {
                            let embedding = await getEmbeddings(image)
                            console.log(embedding)
                            if (embedding != null) {
                                await addStudentAsync(name, image, true, embedding[0], await saveBase64ToFile(embedding[1], `${name}.jpg`));
                                setName("");
                                router.back();
                            }
                            else {
                                await addStudentAsync(name, image, false);
                                setName("");
                                router.back();
                            }

                        } catch (e) {
                            await addStudentAsync(name, image, false);
                            setName("");
                            router.back();
                            console.log(e)
                        } finally {
                            setLoading(false)
                        }
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    info: {
        marginTop: 20,
        fontSize: 16,
        color: "gray",
    },
});