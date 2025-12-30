import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import {
    User,
    Settings,
    Heart,
    Bell,
    LogOut,
    ChevronRight,
    ShieldCheck,
    HelpCircle,
    MessageCircle,
    Star,
} from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';

export default function ProfileScreen() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            }
        } catch (error) {
            // console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace('/(auth)/login');
        } catch (error) {
            // console.error('Logout error:', error);
        }
    };

    const MenuItem = ({ icon: Icon, label, onPress, showBadge = false }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuLeft}>
                <View style={styles.iconContainer}>
                    <Icon size={20} color={colors.primary[600]} />
                </View>
                <Text style={styles.menuLabel}>{label}</Text>
                {showBadge && (
                    <View style={styles.menuBadge}>
                        <Text style={styles.menuBadgeText}>3</Text>
                    </View>
                )}
            </View>
            <ChevronRight size={20} color={colors.gray[400]} />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {userData?.name?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    {userData?.isVerified && (
                        <View style={styles.verifiedBadge}>
                            <ShieldCheck size={16} color={colors.white} />
                        </View>
                    )}
                </View>

                <Text style={styles.name}>{userData?.name || 'User'}</Text>
                <Text style={styles.email}>{userData?.email}</Text>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {userData?.trustScore || 85}/100
                        </Text>
                        <Text style={styles.statLabel}>Trust Score</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Reviews</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {userData?.role === 'owner' ? 'Owner' : 'Tenant'}
                        </Text>
                        <Text style={styles.statLabel}>Role</Text>
                    </View>
                </View>
            </View>

            {/* Menu */}
            <View style={styles.menuContainer}>
                <Text style={styles.sectionTitle}>MY ACTIVITY</Text>

                <View style={styles.menuSection}>
                    <MenuItem
                        icon={Heart}
                        label="Saved Properties"
                        onPress={() => router.push('/(tenant)/favorites')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon={MessageCircle}
                        label="Messages"
                        onPress={() => { }}
                        showBadge
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon={Bell}
                        label="Notifications"
                        onPress={() => router.push('/(tenant)/notifications')}
                        showBadge
                    />
                </View>

                <Text style={styles.sectionTitle}>SETTINGS</Text>

                <View style={styles.menuSection}>
                    <MenuItem
                        icon={User}
                        label="Edit Profile"
                        onPress={() => { }}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon={Settings}
                        label="Settings"
                        onPress={() => router.push('/(tenant)/settings')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon={HelpCircle}
                        label="Help & Support"
                        onPress={() => { }}
                    />
                </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <LogOut size={20} color={colors.error} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
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
        backgroundColor: colors.white,
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: spacing['2xl'],
        ...shadows.sm,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.lg,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: colors.white,
        ...shadows.md,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '700',
        color: colors.primary[600],
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.success.main,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.white,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.gray[900],
        marginBottom: 4,
    },
    email: {
        fontSize: typography.sizes.base,
        color: colors.gray[600],
        marginBottom: spacing.lg,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.gray[50],
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginHorizontal: spacing.lg,
        width: '90%',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: typography.sizes.xl,
        fontWeight: '700',
        color: colors.gray[900],
        marginBottom: 4,
    },
    statLabel: {
        fontSize: typography.sizes.xs,
        color: colors.gray[600],
        textTransform: 'uppercase',
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.gray[200],
    },
    menuContainer: {
        marginTop: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.sizes.xs,
        fontWeight: '700',
        color: colors.gray[600],
        paddingHorizontal: spacing.lg,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        letterSpacing: 1,
    },
    menuSection: {
        backgroundColor: colors.white,
        marginHorizontal: spacing.lg,
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    menuLabel: {
        fontSize: typography.sizes.base,
        fontWeight: '500',
        color: colors.gray[900],
        flex: 1,
    },
    menuBadge: {
        backgroundColor: colors.error,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.sm,
    },
    menuBadgeText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray[100],
        marginHorizontal: spacing.lg,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1.5,
        borderColor: colors.error + '20',
        gap: spacing.sm,
    },
    logoutText: {
        fontSize: typography.sizes.base,
        fontWeight: '600',
        color: colors.error,
    },
});
