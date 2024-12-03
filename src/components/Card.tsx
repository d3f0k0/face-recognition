import { View, ViewStyle } from "react-native";

interface CardProps extends React.PropsWithChildren {
    style?: ViewStyle;
}

export default function Card({ children, style = {} }: CardProps) {
    return (
        <View
            style={{
                backgroundColor: "#fff",
                padding: 20,
                marginVertical: 8,
                borderRadius: 3,
                flexDirection: "column", // Updated to column
                justifyContent: "flex-start", // Align content to the top
                alignItems: "flex-start", // Align items to the left
                borderColor: "#333",
                borderWidth: 1,
                ...style,
            }}
        >
            {children}
        </View>
    );
}
