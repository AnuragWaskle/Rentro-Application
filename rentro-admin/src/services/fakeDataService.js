import { dbLite as db } from '../config/firebase'; // Alias dbLite as db to minimize code changes
import { collection, doc, setDoc, addDoc, serverTimestamp, getDocs, deleteDoc } from 'firebase/firestore/lite';

// Helper to get random element from array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const INDIAN_NAMES = [
    "Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Reyansh", "Muhammad", "Avyaan",
    "Vivaan", "Aryan", "Anaya", "Myra", "Saanvi", "Aadhya", "Kiara", "Diya",
    "Pari", "Fatima", "Zoya", "Riya", "Ishaan", "Kabir", "Dhruv", "Rohan"
];

const INDIAN_SURNAMES = [
    "Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Kumar", "Patel", "Shah",
    "Khan", "Ali", "Reddy", "Nair", "Iyer", "Chatterjee", "Das", "Bose"
];

const CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Chandigarh"
];

const PROPERTY_TITLES = [
    "Luxury Apartment in City Center",
    "Spacious Villa with Garden",
    "Modern Studio near Metro",
    "Cozy 2BHK for Family",
    "Premium Penthouse with View",
    "Affordable Shared Room",
    "Independent House in Quiet Area",
    "Fully Furnished Flat for Rent"
];

const PROPERTY_IMAGES = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    "https://images.unsplash.com/photo-1512918760532-3edbed1351c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
];

export const generateFakeIndianUsers = async (count = 50) => {
    const usersRef = collection(db, 'users');
    const promises = [];

    for (let i = 0; i < count; i++) {
        const firstName = getRandomElement(INDIAN_NAMES);
        const lastName = getRandomElement(INDIAN_SURNAMES);
        const fullName = `${firstName} ${lastName}`;
        const role = Math.random() > 0.8 ? 'owner' : 'tenant';

        const userData = {
            name: fullName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}@example.com`,
            phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            role: role,
            isVerified: Math.random() > 0.6,
            isBanned: Math.random() > 0.95,
            trustScore: Math.floor(Math.random() * 100),
            createdAt: serverTimestamp(),
            isFake: true,
            avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
        };

        promises.push(addDoc(usersRef, userData));
    }

    await Promise.all(promises);
    return count;
};

export const generateFakeProperties = async (count = 20) => {
    // ... (existing implementation) ...
    const propertiesRef = collection(db, 'properties');
    const promises = [];

    for (let i = 0; i < count; i++) {
        const title = getRandomElement(PROPERTY_TITLES);
        const city = getRandomElement(CITIES);
        const price = Math.floor(Math.random() * 50000) + 5000;
        const bhk = Math.floor(Math.random() * 4) + 1;
        const type = Math.random() > 0.5 ? 'Apartment' : 'House';
        const status = Math.random() > 0.3 ? 'verified' : 'pending';

        const images = [];
        const imageCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < imageCount; j++) {
            images.push(getRandomElement(PROPERTY_IMAGES));
        }

        const propertyData = {
            title,
            description: `A beautiful ${title.toLowerCase()} located in the heart of ${city}. Close to all amenities.`,
            price,
            city,
            address: `${Math.floor(Math.random() * 100)}, Main Road, ${city}`,
            bhk,
            type,
            status,
            images,
            amenities: ["WiFi", "Parking", "Gym", "Security"].sort(() => 0.5 - Math.random()).slice(0, 3),
            ownerId: "fake_owner_" + Math.random().toString(36).substr(2, 9), // Placeholder owner
            ownerName: getRandomElement(INDIAN_NAMES) + " " + getRandomElement(INDIAN_SURNAMES),
            createdAt: serverTimestamp(),
            isFake: true,
            aiAnalysis: {
                spamScore: Math.floor(Math.random() * 100),
                priceAnalysis: "Fair",
                imageQuality: "High"
            }
        };

        promises.push(addDoc(propertiesRef, propertyData));
    }

    await Promise.all(promises);
    return count;
};

export const generateFakeConversations = async (count = 20) => {
    // We need existing users and properties to create realistic conversations
    // In a real scenario, we'd fetch them. For mock gen, we'll just create random IDs if we can't fetch.
    // But since we are using Lite, fetching is cheap.

    // Fetch some users and properties
    const usersSnap = await getDocs(collection(db, 'users'));
    const propsSnap = await getDocs(collection(db, 'properties'));

    const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const props = propsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (users.length === 0 || props.length === 0) return 0;

    const tenants = users.filter(u => u.role === 'tenant');
    const owners = users.filter(u => u.role === 'owner'); // Or use property owners

    if (tenants.length === 0) return 0;

    const promises = [];
    for (let i = 0; i < count; i++) {
        const tenant = getRandomElement(tenants);
        const property = getRandomElement(props);
        const ownerId = property.ownerId || (owners.length > 0 ? getRandomElement(owners).id : 'fake_owner');
        const ownerName = property.ownerName || 'Property Owner';

        const convData = {
            participants: [tenant.id, ownerId],
            propertyId: property.id,
            propertyTitle: property.title,
            lastMessage: 'Is this still available?',
            lastMessageTime: serverTimestamp(),
            unreadCount: { [tenant.id]: 0, [ownerId]: 1 },
            ownerName: ownerName,
            ownerAvatar: ownerName.charAt(0),
            isFake: true
        };

        // We can't easily add subcollections in a batch with Lite without multiple requests
        // So we'll just add the conversation for now.
        promises.push(addDoc(collection(db, 'conversations'), convData));
    }

    await Promise.all(promises);
    return count;
};

export const generateFakeFavorites = async (count = 30) => {
    const usersSnap = await getDocs(collection(db, 'users'));
    const propsSnap = await getDocs(collection(db, 'properties'));

    const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const props = propsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (users.length === 0 || props.length === 0) return 0;

    const promises = [];
    for (let i = 0; i < count; i++) {
        const user = getRandomElement(users);
        const property = getRandomElement(props);

        const favData = {
            userId: user.id,
            propertyId: property.id,
            createdAt: serverTimestamp(),
            isFake: true
        };
        promises.push(addDoc(collection(db, 'favorites'), favData));
    }

    await Promise.all(promises);
    return count;
};

export const clearAllMockData = async () => {
    const collections = ['users', 'properties', 'conversations', 'favorites'];
    let deletedCount = 0;

    for (const colName of collections) {
        const snapshot = await getDocs(collection(db, colName));
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        deletedCount += deletePromises.length;
    }
    return deletedCount;
};
