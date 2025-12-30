import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export default function VerificationScreen() {
    const [idCard, setIdCard] = useState(null);
    const [selfie, setSelfie] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async (type) => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please allow access to your photos');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                if (type === 'id') {
                    setIdCard(result.assets[0]);
                } else {
                    setSelfie(result.assets[0]);
                }
            }
        } catch (error) {
            // console.error('Image picker error:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const takeSelfie = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please allow camera access');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [3, 4],
                quality: 0.8,
            });

            if (!result.canceled) {
                setSelfie(result.assets[0]);
            }
        } catch (error) {
            // console.error('Camera error:', error);
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const handleSubmit = async () => {
        if (!idCard || !selfie) {
            Alert.alert('Error', 'Please provide both ID card and selfie');
            return;
        }

        setLoading(true);
        try {
            // Upload images to Firebase Storage
            const idCardRef = ref(storage, `verifications/${auth.currentUser.uid}/id_${Date.now()}.jpg`);
            const selfieRef = ref(storage, `verifications/${auth.currentUser.uid}/selfie_${Date.now()}.jpg`);

            // Upload ID card
            const idResponse = await fetch(idCard.uri);
            const idBlob = await idResponse.blob();
            await uploadBytes(idCardRef, idBlob);
            const idCardUrl = await getDownloadURL(idCardRef);

            // Upload Selfie
            const selfieResponse = await fetch(selfie.uri);
            const selfieBlob = await selfieResponse.blob();
            await uploadBytes(selfieRef, selfieBlob);
            const selfieUrl = await getDownloadURL(selfieRef);

            // Call AI backend for face verification
            let aiScore = 75; // Default score
            try {
                const aiResponse = await axios.post(`${API_BASE_URL}/api/verify-face`, {
                    idCardUrl,
                    selfieUrl,
                });
                aiScore = aiResponse.data.matchScore;
            } catch (aiError) {
                // console.warn('AI verification unavailable:', aiError);
            }

            // Create verification request in Firestore
            await addDoc(collection(db, 'verifications'), {
                userId: auth.currentUser.uid,
                idCardUrl,
                selfieUrl,
                status: 'pending',
                aiFaceMatchScore: aiScore,
                submittedAt: serverTimestamp(),
            });

            Alert.alert(
                'Success!',
                'Verification submitted! An admin will review your documents within 24-48 hours.',
                [{
                    text: 'OK', onPress: () => {
                        setIdCard(null);
                        setSelfie(null);
                    }
                }]
            );
        } catch (error) {
            // console.error('Verification error:', error);
            Alert.alert('Error', 'Failed to submit verification. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Get Verified</Text>
                <Text style={styles.subtitle}>
                    Verified owners get a trust badge and higher visibility
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Step 1: Upload Government ID</Text>
                <Text style={styles.sectionDesc}>
                    Driver's License, Passport, or Aadhaar Card
                </Text>

                {idCard ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: idCard.uri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.changeButton}
                            onPress={() => pickImage('id')}
                        >
                            <Text style={styles.changeButtonText}>Change Photo</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.uploadBox}
                        onPress={() => pickImage('id')}
                    >
                        <Text style={styles.uploadIcon}>📄</Text>
                        <Text style={styles.uploadText}>Tap to Upload ID Card</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Step 2: Take a Selfie</Text>
                <Text style={styles.sectionDesc}>
                    Make sure your face is clearly visible
                </Text>

                {selfie ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: selfie.uri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.changeButton}
                            onPress={takeSelfie}
                        >
                            <Text style={styles.changeButtonText}>Retake Selfie</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.uploadBox}
                        onPress={takeSelfie}
                    >
                        <Text style={styles.uploadIcon}>🤳</Text>
                        <Text style={styles.uploadText}>Tap to Take Selfie</Text>
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                style={[
                    styles.submitButton,
                    (!idCard || !selfie || loading) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!idCard || !selfie || loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.submitButtonText}>Submit for Verification</Text>
                )}
            </TouchableOpacity>

            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>💡 Tips for Approval:</Text>
                <Text style={styles.infoText}>• Use clear, well-lit photos</Text>
                <Text style={styles.infoText}>• Ensure all text on ID is readable</Text>
                <Text style={styles.infoText}>• Face should match your ID photo</Text>
                <Text style={styles.infoText}>• No sunglasses or masks in selfie</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        lineHeight: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    sectionDesc: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    uploadBox: {
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 48,
        alignItems: 'center',
    },
    uploadIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    uploadText: {
        fontSize: 16,
        color: '#4F46E5',
        fontWeight: '600',
    },
    imageContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 12,
    },
    changeButton: {
        backgroundColor: '#EEF2FF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    changeButtonText: {
        color: '#4F46E5',
        fontWeight: '600',
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginBottom: 24,
    },
    submitButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    infoBox: {
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FCD34D',
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#78350F',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#78350F',
        marginBottom: 4,
    },
});
