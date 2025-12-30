import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { router } from 'expo-router';
import { Heart, MapPin, DollarSign } from 'lucide-react-native';

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            // Fetch user's favorite property IDs
            const favoritesQuery = query(
                collection(db, 'favorites'),
                where('userId', '==', auth.currentUser?.uid)
            );
            const favoritesSnapshot = await getDocs(favoritesQuery);

            const propertyIds = favoritesSnapshot.docs.map(doc => doc.data().propertyId);

            if (propertyIds.length > 0) {
                // Fetch property details
                const propertiesQuery = query(
                    collection(db, 'properties'),
                    where('__name__', 'in', propertyIds)
                );
                const propertiesSnapshot = await getDocs(propertiesQuery);

                const propertiesData = propertiesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setFavorites(propertiesData);
            }
        } catch (error) {
            // console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderProperty = ({ item }) => (
        <TouchableOpacity
            style={styles.propertyCard}
            onPress={() => router.push(`/property/${item.id}`)}
            activeOpacity={0.9}
        >
            <Image
                source={{ uri: item.images?.[0] || 'https://via.placeholder.com/400x300' }}
                style={styles.propertyImage}
            />
            <View style={styles.favoriteIcon}>
                <Heart size={20} color="#EF4444" fill="#EF4444" />
            </View>

            <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{item.title}</Text>

                <View style={styles.locationRow}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.locationText}>{item.location}</Text>
                </View>

                <View style={styles.priceRow}>
                    <DollarSign size={18} color="#6366F1" />
                    <Text style={styles.price}>₹{item.price?.toLocaleString()}</Text>
                    <Text style={styles.priceUnit}>/month</Text>
                </View>

                <View style={styles.features}>
                    {item.bedrooms && (
                        <View style={styles.feature}>
                            <Text style={styles.featureText}>{item.bedrooms} BHK</Text>
                        </View>
                    )}
                    {item.propertyType && (
                        <View style={styles.feature}>
                            <Text style={styles.featureText}>{item.propertyType}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    if (favorites.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Heart size={64} color="#E5E7EB" />
                <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                <Text style={styles.emptySubtitle}>
                    Properties you favorite will appear here
                </Text>
                <TouchableOpacity
                    style={styles.browseButton}
                    onPress={() => router.push('/(tenant)')}
                >
                    <Text style={styles.browseButtonText}>Browse Properties</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                renderItem={renderProperty}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 20,
    },
    listContent: {
        padding: 16,
    },
    propertyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    propertyImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#E5E7EB',
    },
    favoriteIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 8,
    },
    propertyInfo: {
        padding: 16,
    },
    propertyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationText: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    price: {
        fontSize: 20,
        fontWeight: '700',
        color: '#6366F1',
    },
    priceUnit: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 4,
    },
    features: {
        flexDirection: 'row',
        gap: 8,
    },
    feature: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    featureText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366F1',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    browseButton: {
        backgroundColor: '#6366F1',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    browseButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
