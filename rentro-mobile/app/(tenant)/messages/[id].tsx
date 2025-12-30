import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { GiftedChat, IMessage, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { ArrowLeft, Phone, Video, Send as SendIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../../../constants/theme';
import { getConversationMessages, sendMessage, Message } from '../../../services/messageService';
import { auth } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [conversationData, setConversationData] = useState<any>(null);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!id || !currentUser) return;

        // Fetch conversation details
        const fetchConversation = async () => {
            try {
                const docRef = doc(db, 'conversations', id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setConversationData(docSnap.data());
                }
            } catch (error) {
                console.error('Error fetching conversation:', error);
            }
        };

        fetchConversation();

        // Subscribe to messages
        const unsubscribe = getConversationMessages(id as string, (newMessages) => {
            const giftedMessages = newMessages.map((msg) => ({
                _id: msg.id,
                text: msg.text,
                createdAt: msg.timestamp?.toDate() || new Date(),
                user: {
                    _id: msg.senderId,
                    name: msg.senderId === currentUser.uid ? 'Me' : 'User',
                },
            }));
            setMessages(giftedMessages.reverse());
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id, currentUser]);

    const onSend = useCallback(async (newMessages: IMessage[] = []) => {
        if (!id || !newMessages.length) return;

        const text = newMessages[0].text;
        try {
            await sendMessage(id as string, text);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [id]);

    const renderBubble = (props: any) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: colors.primary[500],
                },
                left: {
                    backgroundColor: colors.gray[200],
                },
            }}
            textStyle={{
                right: {
                    color: colors.white,
                },
                left: {
                    color: colors.gray[900],
                },
            }}
        />
    );

    const renderSend = (props: any) => (
        <Send {...props}>
            <View style={styles.sendButton}>
                <SendIcon size={20} color={colors.white} />
            </View>
        </Send>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={[colors.primary[500], colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={24} color={colors.white} />
                    </TouchableOpacity>

                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>
                            {conversationData?.ownerName || 'Chat'}
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            {conversationData?.propertyTitle || 'Property Inquiry'}
                        </Text>
                    </View>

                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.headerAction}>
                            <Phone size={20} color={colors.white} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerAction}>
                            <Video size={20} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: currentUser?.uid || '',
                }}
                renderBubble={renderBubble}
                renderSend={renderSend}
                alwaysShowSend
                scrollToBottom
                textInputProps={{
                    style: styles.input,
                }}
                renderInputToolbar={(props) => (
                    <InputToolbar
                        {...props}
                        containerStyle={styles.inputToolbar}
                        primaryStyle={{ alignItems: 'center' }}
                    />
                )}
            />
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
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: spacing.md,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    backButton: {
        padding: 4,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: '700',
        color: colors.white,
    },
    headerSubtitle: {
        fontSize: typography.sizes.xs,
        color: 'rgba(255,255,255,0.8)',
    },
    headerActions: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    headerAction: {
        padding: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: borderRadius.full,
    },
    sendButton: {
        width: 36,
        height: 36,
        backgroundColor: colors.primary[500],
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 4,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        flex: 1,
        color: colors.gray[900],
    },
    inputToolbar: {
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.gray[200],
        padding: 8,
    },
});
