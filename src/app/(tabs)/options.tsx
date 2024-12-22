import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../../components/Button';
import AsyncStorage from 'expo-sqlite/kv-store';
import { useState } from 'react';
import CreateForm from '../../components/create/CreateForm';
import { useTranslation } from 'react-i18next';


export default function Tab() {
  const {t, i18n} = useTranslation()
  const [apiUrl, setApiUrl] = useState('')

  const changeLanguage = async (lang: string) => {
    await AsyncStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

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
      ]}>{t('settings.dangerous')}</Text>
      <Button 
        label={t('settings.delete_everything')} 
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
        <Text style={[
        {
            fontSize: 20
        }
      ]}>Language</Text>
      <View>
        <TouchableOpacity
          onPress={() => changeLanguage('en-US')}
        >
          <Text style={{
            fontSize: 40
          }}>
          🇺🇸
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeLanguage('vi-VN')}
        >
          <Text style={{
            fontSize: 40
          }}>
          🇻🇳
          </Text>
        </TouchableOpacity>
      </View>
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
