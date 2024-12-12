import { View, Text, StyleSheet, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../../components/Button';
import AsyncStorage from 'expo-sqlite/kv-store';
import { useState } from 'react';
import CreateForm from '../../components/create/CreateForm';


export default function Tab() {
  const [apiUrl, setApiUrl] = useState('')

  return (
    <View style={styles.container}>
      <Text style={[
        {
            fontSize: 20
        }
      ]}>Set Api URL:</Text>
      <CreateForm 
        placeholder={''} 
        onChange={(url) => {setApiUrl(url)}}/>
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
        color={styles.delete_button_color}
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
    color: 'white'
  },
  delete_button_color: {
    backgroundColor: 'red'
  }
});
