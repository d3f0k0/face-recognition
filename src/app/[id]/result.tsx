import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import Card from "../../components/Card";
import { router, Stack, useLocalSearchParams } from "expo-router";
import AsyncStorage from "expo-sqlite/kv-store";
import { useState, useCallback, useEffect } from "react";
import { ClassCardType } from "../../components/ClassCard";
import { StudentType } from ".";
import { saveBase64ToFile } from "../../misc/result_process";
import Button from "../../components/Button";
import { useTranslation } from "react-i18next";

export interface ResultType {
    face: any
    best_match?: MatchType
}

interface MatchType {
    name: string
    similarity: number
}


export default function Result() {
    const { t } = useTranslation()
    const { id } = useLocalSearchParams();
    const tableID = "table_" + id;
    const [loading, setLoading] = useState(true);
    const [classData, setClassData] = useState<ClassCardType | null>();
    const [studentData, setStudentData] = useState<StudentType[] | null>();
    const [resultData, setResultData] = useState<ResultType[] | null>();
    const [listResult, setListResult] = useState<number[]>([]);
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
            const resultListData = JSON.parse(await AsyncStorage.getItem("temp_results"));
            if (resultListData) {
                setResultData(resultListData);

                // Safely map through results and handle `0` as a valid name
                const list_result_temp = resultListData.map((result: ResultType) => {
                    // Ensure `best_match` exists and `name` is valid (including `0`)
                    if (result.best_match && result.best_match.name !== undefined && result.best_match.name !== null) {
                        const parsedName = parseInt(result.best_match.name);
                        return !isNaN(parsedName) ? parsedName : null; // Return `null` if parsing fails
                    }
                    return null; // Return `null` if `best_match` or `name` is missing
                });

                setListResult(list_result_temp);
                console.log(list_result_temp);

            } else {
                setResultData([]);
            }


        } catch (error) {

            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    }, [id, tableID]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    if (loading) {
        return (
            <View>
                <Stack.Screen
                    options={{
                        title: t('class.result')
                    }}
                />
                <Text>Loading...</Text>
            </View>
        );
    }
    return (
        <View style={{ flex: 1, padding: 15 }}>
            <Stack.Screen
                options={{
                    title: t('class.result.title')
                }}
            />
            <ScrollView>
                <Card style={{}}>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center' }}>
                        {classData?.name}
                    </Text>
                    {classData?.description? (<Text style={{ textAlignVertical: 'auto', textAlign: 'center', marginBottom: 15 }}>
                        {classData?.description}
                    </Text>) : <View></View>}
                    <Text style={{ fontSize: 24, textAlignVertical: 'auto', textAlign: 'center', marginBottom: 0 }}>
                        {t('class.result.total')}: {studentData.length}
                    </Text>
                    <Text style={{ fontSize: 24, textAlignVertical: 'auto', textAlign: 'center', marginBottom: 0 }}>
                        {t('class.result.amount')}: {resultData.length}
                    </Text>
                    <Text style={{ fontSize: 24, textAlignVertical: 'auto', textAlign: 'center', marginBottom: 15 }}>
                        {t('class.result.absence')}: {studentData.length - resultData.length}
                    </Text>
                    <View
                        style={{
                            width: "100%",
                            alignItems: "center",
                        }}
                    >
                        <Button label={t('class.detect_result')}
                            onPress={async () => {
                                router.navigate(`/${id}/detect_result`)
                            }}
                            style={{
                                alignItems: 'center',
                                marginHorizontal: 0,
                            }} />
                    </View>
                </Card>
                {studentData && studentData
                    .filter((student) => !listResult.includes(student.id))
                    .map((student, index) => (
                        <View key={index}>
                            <Card style={styles.card}>
                                <View style={styles.cardContent}>
                                    <Image source={{ uri: student.image }} style={styles.image} />
                                    <View>
                                        <Text>{student.name}</Text>
                                        <Text>{student.id}</Text>
                                    </View>
                                </View>
                            </Card>
                        </View>
                    ))}
            </ScrollView>
            <View
                style={{
                    position: "absolute",
                    bottom: 20,
                    width: "100%",
                    alignItems: "center",
                }}
            >
                <Button label="return"
                    onPress={async () => {
                        await AsyncStorage.setItem("temp_results", null)
                        router.back()
                    }}
                    style={{
                        alignItems: 'center',
                        marginHorizontal: 0,
                    }} />
            </View>


        </View>
    )
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
    }

})