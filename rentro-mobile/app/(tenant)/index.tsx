import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import {
    MapPin,
    Search,
    SlidersHorizontal,
    Map as MapIcon,
    Bell,
    TrendingUp,
    Sparkles,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { PropertyCard } from '../../components/PropertyCard';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

const BUDGET_RANGES = [
    { label: 'All', min: 0, max: 1000000, gradient: [colors.gray[300], colors.gray[400]] },
    { label: '< ₹10K', min: 0, max: 10000, gradient: ['#10B981', '#059669'] },
    { label: '₹10-20K', min: 10000, max: 20000, gradient: ['#3B82F6', '#2563EB'] },
    { label: '₹20-30K', min: 20000, max: 30000, gradient: ['#8B5CF6', '#7C3AED'] },
    { label: '> ₹30K', min: 30000, max: 1000000, gradient: ['#EC4899', '#DB2777'] },
];

export default function HomeScreen() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBudget, setSelectedBudget] = useState(BUDGET_RANGES[0]);

    useEffect(() => {
        fetchProperties();
    }, [selectedBudget]);

    const fetchProperties = async () => {
        try {
            const q = query(
                collection(db, 'properties'),
                where('status', '==', 'verified'),
                orderBy('createdAt', 'desc'),
                limit(20)
            );

            const snapshot = await getDocs(q);
            let props = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                rating: 4.5 + Math.random() * 0.5,
                reviews: Math.floor(Math.random() * 200) + 20,
                verified: true,
                distance: Math.random() * 10,
                isFavorite: false,
            }));

            if (selectedBudget.max < 1000000) {
                props = props.filter(p =>
                    p.price >= selectedBudget.min && p.price <= selectedBudget.max
                );
            }

            setProperties(props);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
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
            {/* Beautiful Gradient Header */}
            <LinearGradient
                colors={[colors.primary[500], colors.primary[600], colors.primary[700]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                {/* Top Bar */}
                <View style={styles.topBar}>
                    <View>
                        <Text style={styles.greeting}>Discover Amazing Homes ✨</Text>
                        <Text style={styles.subtitle}>Find your perfect place today</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => router.push('/(tenant)/notifications')}
                    >
                        <Bell size={22} color={colors.white} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Search size={20} color={colors.primary[600]} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search location, price..."
                            placeholderTextColor={colors.gray[400]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.mapButton}
                        onPress={() => { }}
                    >
                        <LinearGradient
                            colors={[colors.accent[400], colors.accent[500]]}
                            style={styles.mapButtonGradient}
                        >
                            <MapIcon size={20} color={colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Budget Filters - Beautiful Gradient Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.budgetFilters}
                >
                    {BUDGET_RANGES.map((item) => {
                        const isSelected = selectedBudget.label === item.label;
                        return (
                            <TouchableOpacity
                                key={item.label}
                                onPress={() => setSelectedBudget(item)}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={isSelected ? item.gradient : [colors.white + '40', colors.white + '20']}
                                    style={[
                                        styles.budgetChip,
                                        isSelected && styles.budgetChipSelected
                                    ]}
                                >
                                    <Text style={[
                                        styles.budgetText,
                                        isSelected && styles.budgetTextSelected
                                    ]}>
                                        {item.label}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </LinearGradient>

            {/* Properties Count */}
            <View style={styles.countContainer}>
                <LinearGradient
                    colors={[colors.accent[400], colors.accent[500]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.countBadge}
                >
                    <Sparkles size={16} color={colors.white} />
                    <Text style={styles.countText}>
                        {properties.length} Premium Properties
                    </Text>
                </LinearGradient>
            </View>

            {/* Properties List */}
            <FlatList
                data={properties}
                renderItem={({ item }) => (
                    <PropertyCard
                        property={item}
                        onPress={() => router.push(`/property/${item.id}`)}
                        onContact={() => { }}
                        onFavorite={() => {
                            const updated = properties.map(p =>
                                p.id === item.id ? { ...p, isFavorite: !p.isFavorite } : p
                            );
                            setProperties(updated);
                        }}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchProperties();
                        }}
                        colors={[colors.primary[500]]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No properties found</Text>
                        <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
                    </View>
                }
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
        paddingBottom: spacing.lg,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        ...shadows.xl,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.white,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: typography.sizes.sm,
        color: 'rgba(255,255,255,0.9)',
    },
    notificationButton: {
        position: 'relative',
        padding: spacing.sm,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: borderRadius.full,
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: colors.error,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: '700',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.sm,
        ...shadows.md,
    },
    searchInput: {
        flex: 1,
        fontSize: typography.sizes.base,
        color: colors.gray[900],
    },
    mapButton: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.md,
    },
    mapButtonGradient: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    budgetFilters: {
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    budgetChip: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 2,
        borderRadius: borderRadius.full,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    budgetChipSelected: {
        borderColor: 'transparent',
        ...shadows.md,
    },
    budgetText: {
        fontSize: typography.sizes.sm,
        fontWeight: '700',
        color: colors.white,
    },
    budgetTextSelected: {
        color: colors.white,
    },
    countContainer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
    },
    countBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
        ...shadows.md,
    },
    countText: {
        color: colors.white,
        fontSize: typography.sizes.sm,
        fontWeight: '700',
    },
    listContent: {
        padding: spacing.lg,
    },
    emptyContainer: {
        paddingVertical: spacing['4xl'],
        alignItems: 'center',
    },
    emptyText: {
        fontSize: typography.sizes.xl,
        fontWeight: '700',
        color: colors.gray[900],
        marginBottom: spacing.xs,
    },
    emptySubtext: {
        fontSize: typography.sizes.base,
        color: colors.gray[500],
    },
});
