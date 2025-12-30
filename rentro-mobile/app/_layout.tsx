import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function RootLayout() {
    return (
        <ErrorBoundary>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tenant)" />
                    <Stack.Screen name="(owner)" />
                    <Stack.Screen name="property/[id]" />
                </Stack>
            </GestureHandlerRootView>
        </ErrorBoundary>
    );
}
