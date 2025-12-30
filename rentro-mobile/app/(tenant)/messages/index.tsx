import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { MessageCircle, Phone, Video } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../../../constants/theme';
import { getUserConversations, Conversation } from '../../../services/messageService';
import { auth } from '../../../firebaseConfig';

export default function MessagesScreen() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const unsubscribe = getUserConversations(userId, (convos) => {
            setConversations(convos);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getTimeAgo = (timestamp: any) => {
        if (!timestamp) return '';
        const now = new Date();
        const messageTime = timestamp.toDate();
        const diffMs = now.getTime() - messageTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${Math.floor(diffHours / 24)}d ago`;
    };

    const renderConversation = ({ item }: { item: Conversation }) => {
        const userId = auth.currentUser?.uid || '';
        const unreadCount = item.unreadCount?.[userId] || 0;
        const isOnline = Math.random() > 0.5; // TODO: Implement real online status

        return (
            <TouchableOpacity
                style={styles.conversationCard}
                onPress={() => router.push(`/(tenant)/messages/${item.id}`)}
                activeOpacity={0.95}
            >
                <View style={styles.avatarContainer}>
                    <LinearGradient
                        colors={[colors.primary[400], colors.primary[600]]}
                        style={styles.avatar}
                    >
                        <Text style={styles.avatarText}>{item.ownerAvatar}</Text>
                    </LinearGradient>
                    {isOnline && <View style={styles.onlineIndicator} />}
                </View>

                <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                        <Text style={styles.ownerName}>{item.ownerName}</Text>
                        <Text style={styles.time}>{getTimeAgo(item.lastMessageTime)}</Text>
                    </View>

                    <Text style={styles.propertyTitle} numberOfLines={1}>
                        {item.propertyTitle}
                    </Text>

                    <View style={styles.messageRow}>
                        <Text
                            style={[
                                styles.lastMessage,
                                unreadCount > 0 && styles.unreadMessage
                            ]}
                            numberOfLines={1}
                        >
                            {item.lastMessage || 'No messages yet'}
                        </Text>
                        {unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Phone size={18} color={colors.primary[600]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Video size={18} color={colors.primary[600]} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={[colors.primary[500], colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Messages</Text>
                <Text style={styles.headerSubtitle}>Chat with property owners</Text>
            </LinearGradient>

            {/* Conversations List */}
            {conversations.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MessageCircle size={64} color={colors.gray[300]} />
                    <Text style={styles.emptyTitle}>No Messages Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Start a conversation by contacting a property owner
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    renderItem={renderConversation}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray[50],
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.gray[50],
    },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: spacing.lg,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.white,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: typography.sizes.base,
        color: 'rgba(255,255,255,0.9)',
    },
    listContent: {
        padding: spacing.lg,
    },
    conversationCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.md,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: spacing.md,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.white,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: colors.success.main,
        borderWidth: 2,
        borderColor: colors.white,
    },
    conversationContent: {
        flex: 1,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    ownerName: {
        fontSize: typography.sizes.lg,
        fontWeight: '700',
        color: colors.gray[900],
    },
    time: {
        fontSize: typography.sizes.xs,
        color: colors.gray[500],
    },
    propertyTitle: {
        fontSize: typography.sizes.sm,
        color: colors.primary[600],
        marginBottom: 6,
        fontWeight: '500',
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        fontSize: typography.sizes.sm,
        color: colors.gray[600],
        flex: 1,
    },
    unreadMessage: {
        color: colors.gray[900],
        fontWeight: '600',
    },
    unreadBadge: {
        backgroundColor: colors.primary[500],
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.sm,
    },
    unreadText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '700',
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginLeft: spacing.sm,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing['2xl'],
    },
    emptyTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: '700',
        color: colors.gray[900],
        marginTop: spacing.lg,
        marginBottom: spacing.xs,
    },
    emptySubtitle: {
        fontSize: typography.sizes.base,
        color: colors.gray[500],
        textAlign: 'center',
    },
});
