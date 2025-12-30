import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function PropertyDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const propertyId = Array.isArray(id) ? id[0] : id;
                const docRef = doc(db, 'properties', propertyId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProperty({ id: docSnap.id, ...docSnap.data() });
                } else {
                    Alert.alert('Error', 'Property not found');
                    router.back();
                }
            } catch (error) {
                // console.error('Error fetching property:', error);
                Alert.alert('Error', 'Failed to load property details');
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    const handleChat = async () => {
        if (!auth.currentUser) {
            Alert.alert('Login Required', 'Please login to chat with the owner');
            router.push('/(auth)/login');
            return;
        }

        if (property.ownerId === auth.currentUser.uid) {
            Alert.alert('Info', 'You are the owner of this property');
            return;
        }

        setChatLoading(true);
        try {
            // Check if chat already exists
            const q = query(
                collection(db, 'chats'),
                where('propertyId', '==', property.id),
                where('tenantId', '==', auth.currentUser.uid),
                where('ownerId', '==', property.ownerId)
            );

            const querySnapshot = await getDocs(q);
            let chatId;

            if (!querySnapshot.empty) {
                chatId = querySnapshot.docs[0].id;
            } else {
                // Create new chat
                const docRef = await addDoc(collection(db, 'chats'), {
                    propertyId: property.id,
                    tenantId: auth.currentUser.uid,
                    ownerId: property.ownerId,
                    tenantName: auth.currentUser.displayName || 'Tenant',
                    ownerName: property.ownerName || 'Owner',
                    propertyTitle: property.title,
                    createdAt: new Date(),
                    lastMessage: '',
                    lastMessageTime: new Date(),
                });
                chatId = docRef.id;
            }

            router.push(`/chat/${chatId}`);
        } catch (error) {
            // console.error('Error starting chat:', error);
            Alert.alert('Error', 'Failed to start chat');
        } finally {
            setChatLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (!property) return null;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
                    {property.images && property.images.length > 0 ? (
                        property.images.map((img, index) => (
                            <Image key={index} source={{ uri: img }} style={styles.image} resizeMode="cover" />
                        ))
                    ) : (
                        <Image source={{ uri: 'https://via.placeholder.com/400x300' }} style={styles.image} resizeMode="cover" />
                    )}
                </ScrollView>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>{property.title}</Text>
                            <Text style={styles.location}>
                                <Ionicons name="location-outline" size={16} color="#6B7280" /> {property.address}, {property.city}
                            </Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>₹{property.price.toLocaleString()}</Text>
                            <Text style={styles.period}>/month</Text>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Ionicons name="bed-outline" size={24} color="#4F46E5" />
                            <Text style={styles.statValue}>{property.bhk} BHK</Text>
                            <Text style={styles.statLabel}>Type</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="home-outline" size={24} color="#4F46E5" />
                            <Text style={styles.statValue}>{property.type}</Text>
                            <Text style={styles.statLabel}>Category</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="shield-checkmark-outline" size={24} color="#4F46E5" />
                            <Text style={styles.statValue}>{property.status === 'verified' ? 'Verified' : 'Pending'}</Text>
                            <Text style={styles.statLabel}>Status</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{property.description}</Text>
                    </View>

                    {property.amenities && property.amenities.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Amenities</Text>
                            <View style={styles.amenitiesContainer}>
                                {property.amenities.map((amenity, index) => (
                                    <View key={index} style={styles.amenityTag}>
                                        <Text style={styles.amenityText}>{amenity}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.chatButton, chatLoading && styles.buttonDisabled]}
                    onPress={handleChat}
                    disabled={chatLoading}
                >
                    {chatLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                            <Text style={styles.chatButtonText}>Chat with Owner</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    imageContainer: {
        height: 300,
    },
    image: {
        width: width,
        height: 300,
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
        maxWidth: width * 0.6,
    },
    location: {
        fontSize: 14,
        color: '#6B7280',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 24,
        fontWeight: '700',
        color: '#4F46E5',
    },
    period: {
        fontSize: 14,
        color: '#6B7280',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
    },
    amenitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    amenityTag: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    amenityText: {
        color: '#4F46E5',
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    chatButton: {
        backgroundColor: '#4F46E5',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
    },
    buttonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    chatButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
