import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from 'expo-sqlite/kv-store';
import { useTranslation } from 'react-i18next';

import CreateForm from '../../components/create/CreateForm';
import Button from '../../components/Button';
import { dropDatabasePLEASEUSECAREFULLY, clearAllData } from "../../misc/database"
import { useSQLiteContext } from 'expo-sqlite';


export default function Tab() {
  const {t, i18n} = useTranslation()
  const [apiUrl, setApiUrl] = useState('')

  const [apiPlaceholder, setApiPlaceholder] = useState('')
  const database = useSQLiteContext()
  const getPlaceholder = useCallback(async () => {
    const apiPlaceholderText = await AsyncStorage.getItemAsync("apiKey")
    setApiPlaceholder(apiPlaceholderText)
   }, [])
   
  useEffect(() => {
    getPlaceholder()
  }, [getPlaceholder])

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
        placeholder={apiPlaceholder} 
        onChange={(url) => {setApiUrl(url)}}/>
      <Text style={[
        {
            fontSize: 20
        }
      ]}>{t('settings.dangerous')}</Text>
      <View style={styles.dangerZone}>
        <Button 
            label={t('settings.clear_data')}
            icon={<Ionicons name="trash-outline" size={24} color="white" />}
            onPress={() => Alert.alert(
                "Clear all data?", 
                "This will remove all classes, students and recognition results, but keep the database structure.", 
                [{
                    text: "YES",
                    onPress: async () => {
                        await clearAllData(database)
                    }
                },
                {
                    text: "NO"
                }
            ], {cancelable: true})}
            style={styles.warning_button}
            color={styles.warning_button_color}
        />
        
        <Button 
            label={t('settings.reset_database')}
            icon={<Ionicons name="nuclear" size={24} color="white" />}
            onPress={() => Alert.alert(
                "Reset database?", 
                "This will completely reset the database structure. All data will be lost! Are you really sure?", 
                [{
                    text: "YES",
                    onPress: async () => {
                        await dropDatabasePLEASEUSECAREFULLY(database)
                    }
                },
                {
                    text: "NO"
                }
            ], {cancelable: true})}
            style={styles.delete_button}
            color={styles.delete_button_color}
        />
      </View>
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
      <View
              style={{
                position: "absolute",
                bottom: 20,
                width: "100%",
                alignItems: "center",
              }}
            >
              <Button
                label={"Save setting"}
                onPress={async () => {
                  await AsyncStorage.setItemAsync("apiKey", apiUrl)
                  setApiUrl("")
                }}
              />
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
  dangerZone: {
    gap: 10,
    marginVertical: 10,
  },
  warning_button: {
    color: 'white'
  },
  warning_button_color: {
    backgroundColor: '#ff9800'
  },
  delete_button: {
    color: 'white'
  },
  delete_button_color: {
    backgroundColor: '#f44336'
  }
});
