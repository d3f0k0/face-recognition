import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export interface ClassCardType {
    id: number
    name: string,
    description: string
    icon?: any
}


export function ClassCard({
    id,
    title,
    description,
    icon,
    onPress }: {
        id: number
        title: string,
        description: string
        icon?: any
        onPress: (id) => void | Promise<void>
    }) {

    return (
        <TouchableOpacity onPress={() => onPress && onPress(id)}
            style={[styles.tabItemContainer, { borderColor: "#333", borderRadius: 10, borderWidth: 1 }]}>
            <View style={styles.tabItemInfo}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.descriptionText}>{description}</Text>
            </View>
            {icon}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    tabItemContainer: {
        backgroundColor: "#fff",
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    tabItemInfo: {
        flexDirection: "column",
        flex: 1,
    },
    titleText: {
        color: "#333",
        fontSize: 18,
    },
    descriptionText: {
        color: "#aaa",
        fontSize: 14,
    },
    icon: {
        marginLeft: 10,
    },
});

