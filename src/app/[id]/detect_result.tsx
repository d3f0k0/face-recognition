import { View, Text, ScrollView, StyleSheet, Image, Alert } from "react-native";
import Card from "../../components/Card";
import { router, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import Button from "../../components/Button";
import { useTranslation } from "react-i18next";
import { useRecognitionStore, useStudentStore } from "../../misc/stores";
import { useSQLiteContext } from "expo-sqlite";

export interface ResultType {
    face: any
    best_match?: MatchType
    matches?: MatchType[]
}

interface MatchType {
    name: string
    similarity: number
}


export default function DetectResult() {
    const {t} = useTranslation()
    const database = useSQLiteContext()
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);

    const {latestResults, loadLatestResults} = useRecognitionStore()
    const {currentStudentList} = useStudentStore()

        useFocusEffect(
            useCallback(() => {
                const loadData = async () => {
                    setLoading(true);
                    try {
                        await loadLatestResults(Number(id), database);
                        console.log(latestResults)
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
                <Text>Loading...</Text>
            </View>
        );
    }
    return (
        <View style={{ flex: 1, padding: 15 }}>
            <Stack.Screen
                    options={{
                      title: t('class.detect_result')
                    }}
            />
            <ScrollView>
                {latestResults && latestResults.map((resultItem, index) => {
                    return (
                        <View key={index}>
                            <Card style={styles.card}>
                                <View style={styles.cardContent}>
                                    <Image source={{uri: resultItem.face}}
                                    style={{ width: 80, height: 80, backgroundColor: 'grey' }}
                                    />
                                    {(resultItem.similarity) ? (
                                            <View>
                                                <Text>{resultItem.studentID}</Text>
                                                <Text>{resultItem.studentName}</Text>
                                                <Text>{resultItem.similarity}</Text>
                                            </View>
                                        ) : (
                                            <Text>No matches found</Text>) }
                                </View>
                            </Card>
                        </View>
                    )
                })}
            </ScrollView>
            <View
                style={{
                    position: "absolute",
                    bottom: 20,
                    width: "100%",
                    alignItems: "center",
                }}
            >
                <Button label={t('class.return')} 
                onPress={async () => {
                    router.back()
                }}
                style={{
                    alignItems: 'center',
                    marginHorizontal: 0,
                }}/>
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