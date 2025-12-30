import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    timestamp: Timestamp;
    read: boolean;
}

export interface Conversation {
    id: string;
    participants: string[];
    propertyId: string;
    propertyTitle: string;
    lastMessage: string;
    lastMessageTime: Timestamp;
    unreadCount: { [userId: string]: number };
    ownerName: string;
    ownerAvatar: string;
}

// Get all conversations for current user
export const getUserConversations = (
    userId: string,
    callback: (conversations: Conversation[]) => void
) => {
    const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId)
    );

    return onSnapshot(q, (snapshot) => {
        const conversations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Conversation));

        // Sort client-side to avoid composite index requirement
        conversations.sort((a, b) => {
            const timeA = a.lastMessageTime?.toMillis() || 0;
            const timeB = b.lastMessageTime?.toMillis() || 0;
            return timeB - timeA;
        });

        callback(conversations);
    });
};

// Get messages for a conversation
export const getConversationMessages = (
    conversationId: string,
    callback: (messages: Message[]) => void
) => {
    const q = query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            conversationId,
            ...doc.data()
        } as Message));
        callback(messages);
    });
};

// Send a message
export const sendMessage = async (
    conversationId: string,
    text: string
) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    // Add message to subcollection
    await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
        senderId: userId,
        text,
        timestamp: serverTimestamp(),
        read: false,
    });

    // Update conversation
    await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
    });
};

// Create new conversation
export const createConversation = async (
    propertyId: string,
    propertyTitle: string,
    ownerId: string,
    ownerName: string
) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    // Check if conversation already exists
    const q = query(
        collection(db, 'conversations'),
        where('propertyId', '==', propertyId),
        where('participants', 'array-contains', userId)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        return snapshot.docs[0].id;
    }

    // Create new conversation
    const conversationRef = await addDoc(collection(db, 'conversations'), {
        participants: [userId, ownerId],
        propertyId,
        propertyTitle,
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        unreadCount: { [userId]: 0, [ownerId]: 0 },
        ownerName,
        ownerAvatar: ownerName.charAt(0).toUpperCase(),
    });

    return conversationRef.id;
};
