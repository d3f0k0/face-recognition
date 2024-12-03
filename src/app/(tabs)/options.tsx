import { View, Text, StyleSheet, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../../components/Button';
import AsyncStorage from 'expo-sqlite/kv-store';


export default function Tab() {
  return (
    <View style={styles.container}>
      <Text style={[
        {
            fontSize: 20
        }
      ]}>Dangerous!</Text>
      <Button 
        label={'DELETE EVERYTHING'} 
        icon={<Ionicons name="trash" size={24} color="white" />}
        onPress={() => Alert.alert("Are you sure?", "You will delete everything!", 
            [{
                text: "YES",
                onPress: async () => {
                    AsyncStorage.clear()
                }
            },
            {
                text: "NO"
            }
        ], {cancelable: true})}
        style={
            styles.delete_button
        }
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  delete_button: {
    backgroundColor: 'red',
    color: 'white'
  }
});
