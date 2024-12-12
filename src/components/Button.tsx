import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

type ButtonTypes = {
    label: string;
    icon?: any;
    onPress?: any;
    style?: any;
    color?: any
};

export default function Button({ label, icon, onPress, style, color }: ButtonTypes) {
    return (
        <View
            style={[
                styles.buttonContainer,
                style
            ]}>
            <TouchableOpacity style={[styles.button, color ]} onPress={onPress}>
                <View style={[styles.buttonIcon, style]}>{icon}</View>
                <Text style={[styles.buttonLabel, { color: '#25292e' }, style]}>{label}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderColor: "#333",
        borderWidth: 1
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: '#000',
        fontSize: 16,
    },
});
