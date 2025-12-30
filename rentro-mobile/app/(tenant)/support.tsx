import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MessageSquare, Phone, Mail, Send } from 'lucide-react-native';

export default function SupportScreen() {
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
                    <Text style={styles.headerTitle}>Help & Support</Text>
                    <View style={{ width: 24 }} />
                </View>
            </LinearGradient>

            <ScrollView style={styles.content}>
                <Text style={styles.title}>How can we help you?</Text>
                <Text style={styles.subtitle}>Our team is here to assist you with any questions or issues.</Text>

                <View style={styles.contactGrid}>
                    <TouchableOpacity style={styles.contactCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
                            <Phone size={24} color="#4F46E5" />
                        </View>
                        <Text style={styles.contactLabel}>Call Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
                            <MessageSquare size={24} color="#10B981" />
                        </View>
                        <Text style={styles.contactLabel}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
                            <Mail size={24} color="#EF4444" />
                        </View>
                        <Text style={styles.contactLabel}>Email</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Send us a message</Text>

                    <Text style={styles.label}>Subject</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What is this about?"
                        placeholderTextColor="#9CA3AF"
                    />

                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Describe your issue..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                    />

                    <TouchableOpacity style={styles.submitButton}>
                        <Send size={20} color="#FFF" />
                        <Text style={styles.submitText}>Send Message</Text>
                    </TouchableOpacity>
                </View>
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
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
    },
    contactGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    contactCard: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    formCard: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 40,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 20,
    },
    textArea: {
        height: 120,
    },
    submitButton: {
        backgroundColor: '#4F46E5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    submitText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
