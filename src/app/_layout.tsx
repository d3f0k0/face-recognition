import { Stack } from 'expo-router/stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
    return (
        <GestureHandlerRootView>
            <Stack
                screenOptions={{
                    headerLargeTitle: true
                }}>
                <Stack.Screen name='(tabs)' options={{ headerShown: false, headerLargeTitle: true }} />
            </Stack>
        </GestureHandlerRootView>

    )
}


