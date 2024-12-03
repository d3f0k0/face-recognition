import { View, TouchableOpacity, StyleSheet, Image, Text } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Card from "../Card"

interface StudentCardType {
    id: number,
    image: string,
    name: string,
    onPress?: any
}


export default function StudentCard({ id, image, name, onPress }: StudentCardType) {
    return (
        <View key={id}>
            <Card style={styles.card}>
                <View style={styles.cardContent}>
                    <Image source={{ uri: image }} style={styles.image} />
                    <Text style={styles.text}>{name}</Text>
                    <TouchableOpacity style={styles.icon} onPress={onPress}>
                        <MaterialIcons name="more-vert" size={40} color="black" />
                    </TouchableOpacity>
                </View>
            </Card>
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
    },
    icon: {
        padding: 5, // Optional touchable area padding
        alignItems: 'center',
        justifyContent: 'center',
    }
});