import { Stack } from 'expo-router/stack';
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
    return (
        <GestureHandlerRootView>
            <Stack>
                <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            </Stack>
        </GestureHandlerRootView>

    )
}


