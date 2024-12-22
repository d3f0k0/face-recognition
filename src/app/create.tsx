import { View } from "react-native";
import CreateButton from "../components/create/CreateButton";
import CreateForm from "../components/create/CreateForm";
import { useState } from "react";
import { AsyncStorage } from "expo-sqlite/kv-store";
import { router } from "expo-router";
import {useTranslation} from 'react-i18next'

export default function Create() {
  const {t} = useTranslation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const addClassCardAsync = async (name: string, description: string) => {
    try {
      const valueString = await AsyncStorage.getItem("main");
      const value = valueString ? JSON.parse(valueString) : [];
      value.push({
        id: value.length,
        name: name,
        description: description,
      });
      await AsyncStorage.setItem("main", JSON.stringify(value));
    } catch (e) {
      console.error("Failed to save data:", e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16, // Optional for spacing
        position: "relative", // Required for absolute positioning
      }}
    >
      {/* Centered Content */}
      <View
        style={{
          width: "100%",
          alignItems: "center",
        }}
      >
        <CreateForm
          placeholder={t('create.class.name')}
          onChange={(name) => setName(name)}
        />
        <CreateForm
          placeholder={t('create.class.description')}
          onChange={(description) => setDescription(description)}
        />
      </View>

      {/* Button at Bottom */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          alignItems: "center",
        }}
      >
        <CreateButton
          label={"Create"}
          onPress={async () => {
            await addClassCardAsync(name, description);
            setName("");
            setDescription("");
            router.back();
          }}
        />
      </View>
    </View>
  );
}
