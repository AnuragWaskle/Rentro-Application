import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Heart, Star, CheckCircle, Bed, Bath, Maximize2 } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

interface PropertyCardProps {
    property: {
        id: string;
        title: string;
        location: string;
        price: number;
        images?: string[];
        bedrooms?: number;
        bathrooms?: number;
        area?: number;
        rating?: number;
        reviews?: number;
        verified?: boolean;
        distance?: number;
        isFavorite?: boolean;
    };
    onPress: () => void;
    onFavorite?: () => void;
    onContact?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
    property,
    onPress,
    onFavorite,
    onContact,
}) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.95}
        >
            {/* Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                    }}
                    style={styles.image}
                />

                {/* Favorite Button */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        onFavorite?.();
                    }}
                >
                    <Heart
                        size={20}
                        color={property.isFavorite ? colors.error : colors.white}
                        fill={property.isFavorite ? colors.error : 'transparent'}
                    />
                </TouchableOpacity>

                {/* Distance Badge */}
                {property.distance && (
                    <View style={styles.distanceBadge}>
                        <MapPin size={12} color={colors.white} />
                        <Text style={styles.distanceText}>{property.distance.toFixed(1)} km</Text>
                    </View>
                )}

                {/* Verified Badge */}
                {property.verified && (
                    <View style={styles.verifiedBadge}>
                        <CheckCircle size={16} color={colors.white} />
                        <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                )}
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title} numberOfLines={2}>
                    {property.title}
                </Text>

                {/* Rating */}
                {property.rating && property.reviews && (
                    <View style={styles.ratingContainer}>
                        <Star size={14} color={colors.accent[500]} fill={colors.accent[500]} />
                        <Text style={styles.ratingText}>
                            {property.rating.toFixed(1)}
                        </Text>
                        <Text style={styles.reviewsText}>
                            ({property.reviews} reviews)
                        </Text>
                    </View>
                )}

                {/* Location */}
                <View style={styles.locationContainer}>
                    <MapPin size={14} color={colors.gray[500]} />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {property.location}
                    </Text>
                </View>

                {/* Features */}
                <View style={styles.featuresContainer}>
                    {property.bedrooms && (
                        <View style={styles.feature}>
                            <Bed size={14} color={colors.gray[600]} />
                            <Text style={styles.featureText}>{property.bedrooms} Bed</Text>
                        </View>
                    )}
                    {property.bathrooms && (
                        <View style={styles.feature}>
                            <Bath size={14} color={colors.gray[600]} />
                            <Text style={styles.featureText}>{property.bathrooms} Bath</Text>
                        </View>
                    )}
                    {property.area && (
                        <View style={styles.feature}>
                            <Maximize2 size={14} color={colors.gray[600]} />
                            <Text style={styles.featureText}>{property.area} sqft</Text>
                        </View>
                    )}
                </View>

                {/* Price & Action */}
                <View style={styles.footer}>
                    <View>
                        <Text style={styles.price}>₹{property.price.toLocaleString()}</Text>
                        <Text style={styles.priceUnit}>/month</Text>
                    </View>

                    {onContact && (
                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                onContact();
                            }}
                        >
                            <Text style={styles.contactButtonText}>Contact</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
        ...shadows.md,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 220,
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.gray[200],
    },
    favoriteButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: borderRadius.full,
        padding: spacing.sm,
    },
    distanceBadge: {
        position: 'absolute',
        top: spacing.md,
        left: spacing.md,
        backgroundColor: colors.primary[500],
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.md,
        gap: 4,
    },
    distanceText: {
        color: colors.white,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.semibold,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: spacing.md,
        left: spacing.md,
        backgroundColor: colors.success.main,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.md,
        gap: 4,
    },
    verifiedText: {
        color: colors.white,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.semibold,
    },
    content: {
        padding: spacing.lg,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        color: colors.gray[900],
        marginBottom: spacing.xs,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
        gap: 4,
    },
    ratingText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
        color: colors.gray[900],
    },
    reviewsText: {
        fontSize: typography.sizes.sm,
        color: colors.gray[500],
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: 4,
    },
    locationText: {
        fontSize: typography.sizes.sm,
        color: colors.gray[600],
        flex: 1,
    },
    featuresContainer: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featureText: {
        fontSize: typography.sizes.sm,
        color: colors.gray[600],
        fontWeight: typography.weights.medium,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.gray[100],
    },
    price: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.weights.bold,
        color: colors.primary[600],
    },
    priceUnit: {
        fontSize: typography.sizes.sm,
        color: colors.gray[500],
    },
    contactButton: {
        backgroundColor: colors.accent[500],
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
    },
    contactButtonText: {
        color: colors.white,
        fontSize: typography.sizes.base,
        fontWeight: typography.weights.semibold,
    },
});
