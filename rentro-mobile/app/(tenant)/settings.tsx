import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Moon, Bell, Shield, Lock, ChevronRight, HelpCircle } from 'lucide-react-native';

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [biometric, setBiometric] = useState(true);

    const SettingItem = ({
        icon: Icon,
        label,
        value = false,
        onValueChange = (val: boolean) => { },
        type = 'switch'
    }) => (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                    <Icon size={20} color="#4F46E5" />
                </View>
                <Text style={styles.itemLabel}>{label}</Text>
            </View>
            {type === 'switch' ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: '#E5E7EB', true: '#818CF8' }}
                    thumbColor={value ? '#4F46E5' : '#F3F4F6'}
                />
            ) : (
                <ChevronRight size={20} color="#9CA3AF" />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#6366F1', '#4F46E5']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 24 }} />
                </View>
            </LinearGradient>

            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon={Bell}
                        label="Push Notifications"
                        value={notifications}
                        onValueChange={setNotifications}
                    />
                    <View style={styles.divider} />
                    <SettingItem
                        icon={Moon}
                        label="Dark Mode"
                        value={darkMode}
                        onValueChange={setDarkMode}
                    />
                </View>

                <Text style={styles.sectionTitle}>Security</Text>
                <View style={styles.section}>
                    <SettingItem
                        icon={Shield}
                        label="Biometric Login"
                        value={biometric}
                        onValueChange={setBiometric}
                    />
                    <View style={styles.divider} />
                    <TouchableOpacity onPress={() => { }}>
                        <SettingItem
                            icon={Lock}
                            label="Change Password"
                            type="link"
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.section}>
                    <TouchableOpacity onPress={() => { }}>
                        <SettingItem
                            icon={HelpCircle}
                            label="Terms of Service"
                            type="link"
                        />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity onPress={() => { }}>
                        <SettingItem
                            icon={HelpCircle}
                            label="Privacy Policy"
                            type="link"
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.version}>Version 1.0.0</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 12,
        marginTop: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemLabel: {
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    version: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 14,
        marginTop: 20,
        marginBottom: 40,
    },
});
