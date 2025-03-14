import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import Card from "../../components/Card";
import { router, Stack, useLocalSearchParams } from "expo-router";
import AsyncStorage from "expo-sqlite/kv-store";
import { useState, useCallback, useEffect } from "react";
import Button from "../../components/Button";
import { Student } from "../../misc/types";
import { useTranslation } from "react-i18next";

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

    const { id } = useLocalSearchParams();
    const tableID = "table_" + id;
    const [loading, setLoading] = useState(true);
    const [resultData, setResultData] = useState<ResultType[] | null>();
    const [studentData, setStudentData] = useState<Student[] | null>();
    let list_result_temp_2 = []
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const resultListData = JSON.parse(await AsyncStorage.getItem("temp_results"));
            if (resultListData) {
                setResultData(resultListData);
                for (let i = 0; i < resultListData.length; i++) {
                    let result: ResultType = resultListData[i];
                    if (result.best_match && result.best_match.name !== undefined && result.best_match.name !== null) {
                        const parsedName = parseInt(result.best_match.name);
                        const parseCheck2 = !isNaN(parsedName) ? parsedName : null; // Ensure valid integer
                        // Explicitly check for null and undefined
                        if (parseCheck2 !== null && parseCheck2 !== undefined) {
                            if (list_result_temp_2.includes(parseCheck2)) {
                                // Handle duplicates by iterating through matches
                                if (result.matches && result.matches.length > 0) {
                                    for (let j = 0; j < result.matches.length; j++) {
                                        const matches_result = result.matches[j];
                                        let parseName2 = parseInt(matches_result.name);
                                        if (!isNaN(parseName2) && !list_result_temp_2.includes(parseName2)) {
                                            console.log(`{
                                                face: ${result.face},
                                                best_match: {
                                                    name: ${result.matches[j].name},
                                                    similarity: ${result.matches[j].similarity}
                                                }`)
                                            list_result_temp_2.push({
                                                face: result.face,
                                                best_match: {
                                                    name: result.matches[j].name,
                                                    similarity: result.matches[j].similarity
                                                }, 
                                            });
                                            break; // Stop after adding the first valid unique match
                                        }
                                    }
                                }
                            } else {                     
                                    list_result_temp_2.push({
                                    face: result.face,
                                    best_match: {
                                        name: result.best_match.name,
                                        similarity: result.best_match.similarity
                                    }, 
                                });
                            }
                        }
                    } else {
                        list_result_temp_2.push({
                            face: result.face,
                            best_match: null
                        });
                    }
                    console.log("test")
                    console.log(list_result_temp_2)
                }
            } else {
                setResultData([]);
            }
            const studentListData = JSON.parse(await AsyncStorage.getItem(tableID));
            if (studentListData) {
                setStudentData(studentListData);
            } else {
                setStudentData([]);
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
                {resultData && resultData.map((resultItem, index) => {
                    return (
                        <View key={index}>
                            <Card style={styles.card}>
                                <View style={styles.cardContent}>
                                    <Image source={{uri: resultItem.face}}
                                    style={{ width: 80, height: 80, backgroundColor: 'grey' }}
                                    />
                                    {(resultItem.best_match) ? (
                                            <View>
                                                <Text>{resultItem.best_match.name}</Text>
                                                <Text>{studentData[parseInt(resultItem.best_match.name)].studentName}</Text>
                                                <Text>{resultItem.best_match.similarity}</Text>
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