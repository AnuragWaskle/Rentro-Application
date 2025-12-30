import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Bell, Tag, Info, AlertCircle } from 'lucide-react-native';

const NOTIFICATIONS = [
    {
        id: '1',
        title: 'Price Drop Alert!',
        message: 'The price for "Luxury Apartment in Mumbai" has dropped by ₹2,000.',
        type: 'promo',
        time: '2 hours ago',
        read: false
    },
    {
        id: '2',
        title: 'Verification Successful',
        message: 'Your identity verification has been approved. You can now book properties instantly.',
        type: 'success',
        time: '1 day ago',
        read: true
    },
    {
        id: '3',
        title: 'System Maintenance',
        message: 'Rentro will be undergoing scheduled maintenance tonight from 2 AM to 4 AM.',
        type: 'info',
        time: '2 days ago',
        read: true
    }
];

export default function NotificationsScreen() {
    const getIcon = (type) => {
        switch (type) {
            case 'promo': return <Tag size={20} color="#10B981" />;
            case 'success': return <Bell size={20} color="#6366F1" />;
            case 'info': return <Info size={20} color="#3B82F6" />;
            default: return <AlertCircle size={20} color="#6B7280" />;
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.card, !item.read && styles.unreadCard]}>
            <View style={[styles.iconContainer, { backgroundColor: item.read ? '#F3F4F6' : '#EEF2FF' }]}>
                {getIcon(item.type)}
            </View>
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#6366F1', '#4F46E5']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <View style={{ width: 24 }} />
                </View>
            </LinearGradient>

            <FlatList
                data={NOTIFICATIONS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
    list: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    unreadCard: {
        backgroundColor: '#FFF',
        borderLeftWidth: 4,
        borderLeftColor: '#4F46E5',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    unreadTitle: {
        color: '#111827',
        fontWeight: '700',
    },
    time: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    message: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        marginLeft: 8,
    },
});
