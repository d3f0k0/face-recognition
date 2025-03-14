import { Stack } from 'expo-router/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite'
import '../i18n/index'
import { initializeDatabase } from "../misc/database";
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';

export default function RootLayout() {
    return (
        <Suspense fallback={<ActivityIndicator size={"large"}/>}>
            <SQLite.SQLiteProvider 
                databaseName='attendance.db' 
                onInit={initializeDatabase}
                useSuspense
                >
                <GestureHandlerRootView>
                    <Stack>
                        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                    </Stack>
                </GestureHandlerRootView>
            </SQLite.SQLiteProvider>
        </Suspense>
    )
}


