import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OwnerDashboard() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (!auth.currentUser) return;

        const q = query(
            collection(db, 'properties'),
            where('ownerId', '==', auth.currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const props = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProperties(props);
            setLoading(false);
            setRefreshing(false);
        });

        return () => unsubscribe();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified': return '#10B981';
            case 'rejected': return '#EF4444';
            default: return '#F59E0B';
        }
    };

    const renderProperty = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/property/${item.id}`)}
        >
            <Image
                source={{ uri: item.images[0] || 'https://via.placeholder.com/400x300' }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.location}>{item.city}</Text>

                <View style={styles.details}>
                    <Text style={styles.price}>₹{item.price.toLocaleString()}/month</Text>
                    <Text style={styles.bhk}>{item.bhk} BHK</Text>
                </View>

                {item.aiAnalysis && (
                    <View style={styles.aiScore}>
                        <Text style={styles.aiLabel}>AI Spam Score:</Text>
                        <Text style={[
                            styles.aiValue,
                            { color: item.aiAnalysis.spamScore < 30 ? '#10B981' : '#EF4444' }
                        ]}>
                            {item.aiAnalysis.spamScore}%
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={properties}
                renderItem={renderProperty}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No properties listed yet</Text>
                        <Text style={styles.emptySubtext}>Tap the + button to add your first property</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/(owner)/add-listing')}
            >
                <Ionicons name="add" size={30} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: '#E5E7EB',
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    cardContent: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    price: {
        fontSize: 20,
        fontWeight: '700',
        color: '#4F46E5',
    },
    bhk: {
        fontSize: 14,
        color: '#6B7280',
    },
    aiScore: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    aiLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginRight: 4,
    },
    aiValue: {
        fontSize: 12,
        fontWeight: '700',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6B7280',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});
