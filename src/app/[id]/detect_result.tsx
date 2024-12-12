import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import Card from "../../components/Card";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "expo-sqlite/kv-store";
import { useState, useCallback, useEffect } from "react";
import Button from "../../components/Button";
import { StudentType } from ".";

export interface ResultType {
    face: any
    best_match?: MatchType
}

interface MatchType {
    name: string
    similarity: number
}


export default function DetectResult() {

    const { id } = useLocalSearchParams();
    const tableID = "table_" + id;
    const [loading, setLoading] = useState(true);
    const [resultData, setResultData] = useState<ResultType[] | null>();
    const [studentData, setStudentData] = useState<StudentType[] | null>();
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const resultListData = JSON.parse(await AsyncStorage.getItem("temp_results"));
            if (resultListData) {
                setResultData(resultListData);
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
            <ScrollView>
                {resultData && resultData.map((resultItem, index) => {
                    console.log(resultItem)
                    return (
                        <View key={index}>
                            <Card style={styles.card}>
                                <View style={styles.cardContent}>
                                    <Image source={{uri: resultItem.face}}
                                    style={{ width: 80, height: 80, backgroundColor: 'grey' }}
                                    />
                                    {resultItem.best_match?(
                                            <View>
                                                <Text>{resultItem.best_match.name}</Text>
                                                <Text>{studentData[parseInt(resultItem.best_match.name)].name}</Text>
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
                <Button label="Return To Result" 
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