import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ScrollView,
    Modal,
    Dimensions
} from 'react-native';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Filter, X, MapPin, Star, SlidersHorizontal, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Office'];
const BHK_OPTIONS = [1, 2, 3, 4];
const PRICE_RANGES = [
    { label: 'Any', min: 0, max: 1000000 },
    { label: 'Under 10k', min: 0, max: 10000 },
    { label: '10k - 20k', min: 10000, max: 20000 },
    { label: '20k - 50k', min: 20000, max: 50000 },
    { label: 'Above 50k', min: 50000, max: 1000000 },
];

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter States
    const [selectedType, setSelectedType] = useState(null);
    const [selectedBHK, setSelectedBHK] = useState(null);
    const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        filterProperties();
    }, [searchQuery, selectedType, selectedBHK, selectedPriceRange, properties]);

    const fetchProperties = async () => {
        try {
            const q = query(
                collection(db, 'properties'),
                where('status', '==', 'verified'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const props = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProperties(props);
            setFilteredProperties(props);
        } catch (error) {
            // console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterProperties = () => {
        let result = properties;

        // Text Search
        if (searchQuery) {
            const queryLower = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title?.toLowerCase().includes(queryLower) ||
                p.city?.toLowerCase().includes(queryLower) ||
                p.address?.toLowerCase().includes(queryLower)
            );
        }

        // Type Filter
        if (selectedType) {
            result = result.filter(p => p.type === selectedType);
        }

        // BHK Filter
        if (selectedBHK) {
            result = result.filter(p => p.bhk === selectedBHK);
        }

        // Price Filter
        if (selectedPriceRange) {
            result = result.filter(p => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max);
        }

        setFilteredProperties(result);
    };

    const clearFilters = () => {
        setSelectedType(null);
        setSelectedBHK(null);
        setSelectedPriceRange(PRICE_RANGES[0]);
        setSearchQuery('');
        setShowFilters(false);
    };

    const renderProperty = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/property/${item.id}`)}
            activeOpacity={0.9}
        >
            <Image
                source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
                style={styles.cardImage}
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <View style={styles.locationRow}>
                    <MapPin size={12} color="#6B7280" />
                    <Text style={styles.cardLocation} numberOfLines={1}>{item.city}</Text>
                </View>
                <Text style={styles.cardPrice}>₹{item.price?.toLocaleString()}/mo</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.cardDetail}>{item.bhk} BHK</Text>
                    <View style={styles.dot} />
                    <Text style={styles.cardDetail}>{item.type}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#6B7280" />
                    <TextInput
                        style={styles.input}
                        placeholder="Search location, property..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9CA3AF"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={18} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={[styles.filterButton, (selectedType || selectedBHK) && styles.filterButtonActive]}
                    onPress={() => setShowFilters(true)}
                >
                    <SlidersHorizontal size={20} color={selectedType || selectedBHK ? '#FFF' : '#4F46E5'} />
                </TouchableOpacity>
            </View>

            {/* Results */}
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            ) : (
                <FlatList
                    data={filteredProperties}
                    renderItem={renderProperty}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Search size={48} color="#D1D5DB" />
                            <Text style={styles.emptyText}>No properties found</Text>
                            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
                        </View>
                    }
                />
            )}

            {/* Filter Modal */}
            <Modal
                visible={showFilters}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filters</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <X size={24} color="#1F2937" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {/* Property Type */}
                            <Text style={styles.filterLabel}>Property Type</Text>
                            <View style={styles.filterOptions}>
                                {PROPERTY_TYPES.map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[styles.filterChip, selectedType === type && styles.filterChipSelected]}
                                        onPress={() => setSelectedType(selectedType === type ? null : type)}
                                    >
                                        <Text style={[styles.filterChipText, selectedType === type && styles.filterChipTextSelected]}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* BHK */}
                            <Text style={styles.filterLabel}>Bedrooms (BHK)</Text>
                            <View style={styles.filterOptions}>
                                {BHK_OPTIONS.map(bhk => (
                                    <TouchableOpacity
                                        key={bhk}
                                        style={[styles.filterChip, selectedBHK === bhk && styles.filterChipSelected]}
                                        onPress={() => setSelectedBHK(selectedBHK === bhk ? null : bhk)}
                                    >
                                        <Text style={[styles.filterChipText, selectedBHK === bhk && styles.filterChipTextSelected]}>
                                            {bhk} BHK
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Price Range */}
                            <Text style={styles.filterLabel}>Price Range</Text>
                            <View style={styles.filterOptions}>
                                {PRICE_RANGES.map(range => (
                                    <TouchableOpacity
                                        key={range.label}
                                        style={[styles.filterChip, selectedPriceRange.label === range.label && styles.filterChipSelected]}
                                        onPress={() => setSelectedPriceRange(range)}
                                    >
                                        <Text style={[styles.filterChipText, selectedPriceRange.label === range.label && styles.filterChipTextSelected]}>
                                            {range.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.resetButton} onPress={clearFilters}>
                                <Text style={styles.resetButtonText}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={() => setShowFilters(false)}
                            >
                                <Text style={styles.applyButtonText}>Apply Filters</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 16,
        gap: 12,
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#1F2937',
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: '#FFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterButtonActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        width: (width - 48) / 2,
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#E5E7EB',
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    cardLocation: {
        fontSize: 12,
        color: '#6B7280',
        flex: 1,
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4F46E5',
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardDetail: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 6,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6B7280',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    modalBody: {
        padding: 20,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
        marginTop: 8,
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterChipSelected: {
        backgroundColor: '#EEF2FF',
        borderColor: '#4F46E5',
    },
    filterChipText: {
        fontSize: 14,
        color: '#4B5563',
    },
    filterChipTextSelected: {
        color: '#4F46E5',
        fontWeight: '600',
    },
    modalFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        flexDirection: 'row',
        gap: 16,
    },
    resetButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
    },
    applyButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#4F46E5',
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});
