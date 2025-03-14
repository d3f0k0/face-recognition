import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from 'expo-sqlite/kv-store';
import { useTranslation } from 'react-i18next';

import CreateForm from '../../components/create/CreateForm';
import Button from '../../components/Button';
import { dropDatabasePLEASEUSECAREFULLY } from "../../misc/database"


export default function Tab() {
  const {t, i18n} = useTranslation()
  const [apiUrl, setApiUrl] = useState('')

  const [apiPlaceholder, setApiPlaceholder] = useState('')

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
      <Button 
        label={t('settings.delete_everything')} 
        icon={<Ionicons name="trash" size={24} color="white" />}
        onPress={() => Alert.alert("Are you sure?", "You will delete everything!", 
            [{
                text: "YES",
                onPress: async () => {
                    await dropDatabasePLEASEUSECAREFULLY()
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

  delete_button: {
    color: 'white'
  },
  delete_button_color: {
    backgroundColor: 'red'
  }
});
