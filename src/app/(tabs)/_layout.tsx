import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const {t} = useTranslation()
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: `${t('tab.home')}`,
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="options"
        options={{
          title: `${t('tab.settings')}`,
          tabBarIcon: ({ color }) => <Ionicons size={28} name="settings-sharp" color={color} />,
        }}
      />
    </Tabs>
  );
}
