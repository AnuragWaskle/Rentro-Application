import { Tabs, router } from 'expo-router';
import { Home, Search, MessageSquareText, Heart, User } from 'lucide-react-native';
import { colors, typography, shadows } from '../../constants/theme';

export default function TenantLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary[500],
                tabBarInactiveTintColor: colors.gray[400],
                tabBarStyle: {
                    backgroundColor: colors.white,
                    borderTopWidth: 0,
                    ...shadows.xl,
                    height: 70,
                    paddingBottom: 12,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 4,
                },
                tabBarShowLabel: true,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => <Search size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color, size }) => <MessageSquareText size={24} color={color} />,
                    tabBarBadge: 3,
                    tabBarBadgeStyle: {
                        backgroundColor: colors.error,
                        color: colors.white,
                        fontSize: 10,
                        fontWeight: '700',
                    },
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Saved',
                    tabBarIcon: ({ color, size }) => <Heart size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <User size={24} color={color} />,
                }}
            />

            {/* Hidden screens */}
            <Tabs.Screen name="messages/[id]" options={{ href: null }} />
            <Tabs.Screen name="notifications" options={{ href: null }} />
            <Tabs.Screen name="settings" options={{ href: null }} />
            <Tabs.Screen name="support" options={{ href: null }} />

        </Tabs>
    );
}
