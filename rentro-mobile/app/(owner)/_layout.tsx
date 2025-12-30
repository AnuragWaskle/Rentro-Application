import { Stack } from 'expo-router';

export default function OwnerLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="add-listing"
                options={{ title: 'Add New Listing' }}
            />
            <Stack.Screen
                name="dashboard"
                options={{ title: 'My Properties' }}
            />
            <Stack.Screen
                name="verification"
                options={{ title: 'Verify Account' }}
            />
        </Stack>
    );
}
