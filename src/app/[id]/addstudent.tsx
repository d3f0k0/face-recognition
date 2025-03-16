import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from 'react-i18next'
import { useSQLiteContext } from "expo-sqlite";

import CreateButton from "../../components/create/CreateButton";
import CreateForm from "../../components/create/CreateForm";
import Spinner from "../../components/Spinner";
import ImagePickerComponent from "../../components/ImagePicker";
import { getEmbeddings } from "../../misc/recognition_backend";
import { saveBase64ToFile } from "../../misc/utils";
import { addStudent } from "../../misc/database";
import AsyncStorage from "expo-sqlite/kv-store";

export default function AddStudent() {
    const { t } = useTranslation()
    const { id } = useLocalSearchParams()
    const database = useSQLiteContext()

    const [name, setName] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
                        const recognitionUrl = await AsyncStorage.getItemAsync("apiKey")
                        console.log(recognitionUrl)
                        try {
                            let embedding = await getEmbeddings(recognitionUrl, image)
                            console.log(embedding)
                            if (embedding != null) {
                                await addStudent(database ,name, Number(id), image, embedding[0], await saveBase64ToFile(embedding[1], `${name}.jpg`));
                            }
                            else {
                                await addStudent(database, name, Number(id), image, null);
                            }
                            setName("");
                            router.back();

                        } catch (e) {
                            await addStudent(database, name,Number(id), image, null);
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