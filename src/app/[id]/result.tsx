import { View, Text, ScrollView, StyleSheet, Image, Alert } from "react-native";
import Card from "../../components/Card";
import { router, Stack, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { ClassCardType } from "../../components/ClassCard";
import { Student } from "../../misc/types";
import { saveBase64ToFile } from "../../misc/utils";
import Button from "../../components/Button";
import { useTranslation } from "react-i18next";
import { useSQLiteContext } from "expo-sqlite"
import { useClassStore, useRecognitionStore, useStudentStore } from "../../misc/stores";

export interface ResultType {
    face: any
    best_match?: MatchType
    matches?: MatchType[]
}

interface MatchType {
    name: string
    similarity: number
}

export default function Result() {
    const { t } = useTranslation()
    const { id } = useLocalSearchParams();
    const database = useSQLiteContext();

    const {selectedClass} = useClassStore()
    const {currentStudentList} = useStudentStore()
    const { latestResults, loadLatestResults } = useRecognitionStore();
    const [loading, setLoading] = useState(true);
    
    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    await loadLatestResults(Number(id), database);
                } catch (e) {
                    console.error(e);
                    Alert.alert("Error", "Failed to load recognition results");
                } finally {
                    setLoading(false);
                }
            };
            loadData();
        }, [id, database, loadLatestResults])
    );

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
                        {selectedClass.className}
                    </Text>
                    {selectedClass.description ? (<Text style={{ textAlignVertical: 'auto', textAlign: 'center', marginBottom: 15 }}>
                        {selectedClass.description}
                    </Text>) : <View></View>}
                    <Text style={{ fontSize: 24, textAlignVertical: 'auto', textAlign: 'center', marginBottom: 0 }}>
                        {t('class.result.total')}: {currentStudentList.length}
                    </Text>
                    <Text style={{ fontSize: 24, textAlignVertical: 'auto', textAlign: 'center', marginBottom: 0 }}>
                        {t('class.result.amount')}: {latestResults.length}
                    </Text>
                    <Text style={{ fontSize: 24, textAlignVertical: 'auto', textAlign: 'center', marginBottom: 0 }}>
                        {t('class.result.absence')}: {currentStudentList.length - latestResults.length}
                    </Text>
                    {/* <Text style={{ fontSize: 24, textAlignVertical: 'auto', textAlign: 'center', marginBottom: 15 }}>
                        {"Nguời Lạ"}: {studentData.length - listResult.length}
                    </Text> */}
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
                { currentStudentList
                    .filter((student) => !latestResults.includes(student.id))
                    .map((student, index) => (
                        <View key={index}>
                            <Card style={styles.card}>
                                <View style={styles.cardContent}>
                                    <Image source={{ uri: student.imageURL }} style={styles.image} />
                                    <View>
                                        <Text>{student.studentName}</Text>
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