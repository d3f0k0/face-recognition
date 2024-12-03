import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

type CreateButtonTypes = {
    label: string;
    icon?: any;
    onPress?: any;
};

export default function CreateButton({ label, icon, onPress }: CreateButtonTypes) {
    return (
        <View
            style={[
                styles.buttonContainer,
                //{borderColor: "#333", borderRadius: 10, borderWidth: 1},
            ]}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#fff' }]} onPress={onPress}>
                <View style={styles.buttonIcon}>{icon}</View>
                <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
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
