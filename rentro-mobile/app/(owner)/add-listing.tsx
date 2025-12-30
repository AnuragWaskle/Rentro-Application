import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Update for production

export default function AddListingScreen() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form data
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [bhk, setBhk] = useState('1');
    const [propertyType, setPropertyType] = useState('apartment');
    const [selectedImages, setSelectedImages] = useState([]);
    const [amenities, setAmenities] = useState([]);

    // AI Analysis
    const [aiScore, setAiScore] = useState(null);
    const [aiAnalyzing, setAiAnalyzing] = useState(false);

    const amenitiesList = [
        'WiFi', 'AC', 'Parking', 'Elevator', 'Security',
        'Swimming Pool', 'Gym', 'Garden', 'Pet Friendly', 'Furnished'
    ];

    const toggleAmenity = (amenity) => {
        setAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const pickImages = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please allow access to your photos');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
                aspect: [4, 3],
            });

            if (!result.canceled) {
                // Limit to 10 images
                const newImages = result.assets.slice(0, 10 - selectedImages.length);
                setSelectedImages([...selectedImages, ...newImages]);
            }
        } catch (error) {
            // console.error('Image picker error:', error);
            Alert.alert('Error', 'Failed to pick images');
        }
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const analyzeWithAI = async () => {
        if (!description || description.length < 20) {
            Alert.alert('Error', 'Please provide a detailed description');
            return;
        }

        setAiAnalyzing(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/analyze-listing`, {
                title,
                description,
                price: parseInt(price) || 0,
            });

            setAiScore(response.data);

            if (response.data.isSuspicious) {
                Alert.alert(
                    'AI Analysis Warning',
                    `Spam Score: ${response.data.spamScore}/100\n\nFlags detected: ${response.data.flags.join(', ')}\n\nPlease review your description.`,
                );
            } else {
                Alert.alert(
                    'AI Analysis Complete',
                    `Trust Level: ${response.data.trustLevel.toUpperCase()}\nSpam Score: ${response.data.spamScore}/100\n\nLooking good! ✓`,
                );
            }
        } catch (error) {
            // console.error('AI analysis error:', error);
            Alert.alert('Warning', 'AI analysis unavailable. You can still proceed.');
        } finally {
            setAiAnalyzing(false);
        }
    };

    const uploadImages = async () => {
        const uploadedUrls = [];

        for (let i = 0; i < selectedImages.length; i++) {
            try {
                const image = selectedImages[i];
                const filename = `properties/${auth.currentUser.uid}/${Date.now()}_${i}.jpg`;
                const storageRef = ref(storage, filename);

                // Fetch image as blob
                const response = await fetch(image.uri);
                const blob = await response.blob();

                // Upload to Firebase Storage
                await uploadBytes(storageRef, blob);
                const downloadUrl = await getDownloadURL(storageRef);
                uploadedUrls.push(downloadUrl);
            } catch (error) {
                // console.error('Image upload error:', error);
                throw new Error('Failed to upload images');
            }
        }

        return uploadedUrls;
    };

    const handleSubmit = async () => {
        // Validation
        if (!title || !description || !price || !city || !address) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (selectedImages.length === 0) {
            Alert.alert('Error', 'Please add at least one image');
            return;
        }

        setLoading(true);
        try {
            // Upload images to Firebase Storage
            const imageUrls = await uploadImages();

            // Create property document in Firestore
            await addDoc(collection(db, 'properties'), {
                ownerId: auth.currentUser.uid,
                title,
                description,
                price: parseInt(price),
                city,
                location: {
                    address,
                    lat: 0, // Add map integration later
                    lng: 0,
                },
                images: imageUrls,
                amenities,
                type: propertyType,
                bhk: parseFloat(bhk),
                status: 'pending', // Requires admin approval
                aiAnalysis: {
                    spamScore: aiScore?.spamScore || 0,
                    imageMatch: true, // Can add image analysis later
                    flags: aiScore?.flags || [],
                },
                createdAt: serverTimestamp(),
            });

            Alert.alert(
                'Success!',
                'Your listing has been submitted for review. You will be notified once it\'s approved.',
                [{
                    text: 'OK', onPress: () => {
                        // Reset form
                        setTitle('');
                        setDescription('');
                        setPrice('');
                        setCity('');
                        setAddress('');
                        setSelectedImages([]);
                        setAmenities([]);
                        setAiScore(null);
                        setStep(1);
                    }
                }]
            );
        } catch (error) {
            // console.error('Submit error:', error);
            Alert.alert('Error', 'Failed to create listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Property Details</Text>

            <TextInput
                style={styles.input}
                placeholder="Property Title *"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#9CA3AF"
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description * (Min 50 characters)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity
                style={[styles.aiButton, aiAnalyzing && styles.aiButtonDisabled]}
                onPress={analyzeWithAI}
                disabled={aiAnalyzing}
            >
                {aiAnalyzing ? (
                    <ActivityIndicator color="#FFF" size="small" />
                ) : (
                    <Text style={styles.aiButtonText}>🤖 AI Pre-Check</Text>
                )}
            </TouchableOpacity>

            {aiScore && (
                <View style={[
                    styles.aiResult,
                    aiScore.isSuspicious ? styles.aiResultBad : styles.aiResultGood
                ]}>
                    <Text style={styles.aiResultText}>
                        Spam Score: {aiScore.spamScore}/100 | Trust: {aiScore.trustLevel.toUpperCase()}
                    </Text>
                </View>
            )}

            <TextInput
                style={styles.input}
                placeholder="Monthly Rent (₹) *"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
            />

            <View style={styles.row}>
                <View style={styles.halfInput}>
                    <Text style={styles.label}>Property Type</Text>
                    <View style={styles.pickerButtons}>
                        {['apartment', 'house', 'room'].map(type => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.pickerButton,
                                    propertyType === type && styles.pickerButtonActive
                                ]}
                                onPress={() => setPropertyType(type)}
                            >
                                <Text style={[
                                    styles.pickerButtonText,
                                    propertyType === type && styles.pickerButtonTextActive
                                ]}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.halfInput}>
                    <Text style={styles.label}>BHK</Text>
                    <TextInput
                        style={styles.input}
                        value={bhk}
                        onChangeText={setBhk}
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={() => setStep(2)}>
                <Text style={styles.nextButtonText}>Next →</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Location</Text>

            <TextInput
                style={styles.input}
                placeholder="City *"
                value={city}
                onChangeText={setCity}
                placeholderTextColor="#9CA3AF"
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Full Address *"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.stepTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
                {amenitiesList.map(amenity => (
                    <TouchableOpacity
                        key={amenity}
                        style={[
                            styles.amenityChip,
                            amenities.includes(amenity) && styles.amenityChipActive
                        ]}
                        onPress={() => toggleAmenity(amenity)}
                    >
                        <Text style={[
                            styles.amenityChipText,
                            amenities.includes(amenity) && styles.amenityChipTextActive
                        ]}>
                            {amenity}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.nextButton, styles.backButton]}
                    onPress={() => setStep(1)}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.nextButton, { flex: 1 }]}
                    onPress={() => setStep(3)}
                >
                    <Text style={styles.nextButtonText}>Next →</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Property Images</Text>
            <Text style={styles.subtitle}>Upload up to 10 images</Text>

            <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
                <Text style={styles.uploadButtonText}>+ Add Images</Text>
            </TouchableOpacity>

            <ScrollView horizontal style={styles.imagesScroll}>
                {selectedImages.map((image, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri: image.uri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeImage(index)}
                        >
                            <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.nextButton, styles.backButton]}
                    onPress={() => setStep(2)}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        { flex: 1 },
                        loading && styles.submitButtonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit Listing</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.progressBar}>
                {[1, 2, 3].map(s => (
                    <View
                        key={s}
                        style={[
                            styles.progressStep,
                            s <= step && styles.progressStepActive
                        ]}
                    />
                ))}
            </View>

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
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
    progressBar: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    progressStep: {
        flex: 1,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
    },
    progressStepActive: {
        backgroundColor: '#4F46E5',
    },
    stepContent: {
        gap: 16,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: -12,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1F2937',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    aiButton: {
        backgroundColor: '#8B5CF6',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    aiButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    aiButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    aiResult: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    aiResultGood: {
        backgroundColor: '#ECFDF5',
        borderColor: '#10B981',
    },
    aiResultBad: {
        backgroundColor: '#FEF2F2',
        borderColor: '#EF4444',
    },
    aiResultText: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    pickerButtons: {
        flexDirection: 'row',
        gap: 4,
    },
    pickerButton: {
        flex: 1,
        padding: 8,
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
    },
    pickerButtonActive: {
        backgroundColor: '#EEF2FF',
        borderColor: '#4F46E5',
    },
    pickerButtonText: {
        fontSize: 12,
        color: '#6B7280',
    },
    pickerButtonTextActive: {
        color: '#4F46E5',
        fontWeight: '600',
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    amenityChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 20,
    },
    amenityChipActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    amenityChipText: {
        fontSize: 13,
        color: '#6B7280',
    },
    amenityChipTextActive: {
        color: '#FFF',
        fontWeight: '600',
    },
    uploadButton: {
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
    },
    uploadButtonText: {
        fontSize: 16,
        color: '#4F46E5',
        fontWeight: '600',
    },
    imagesScroll: {
        flexDirection: 'row',
    },
    imageContainer: {
        position: 'relative',
        marginRight: 12,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 12,
    },
    removeButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#EF4444',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    nextButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    backButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#10B981',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
