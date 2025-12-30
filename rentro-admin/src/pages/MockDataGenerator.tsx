import React, { useState, useEffect } from 'react';
import { db, dbLite, auth } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore/lite';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { generateFakeIndianUsers, generateFakeProperties, generateFakeConversations, generateFakeFavorites, clearAllMockData } from '../services/fakeDataService';

const INDIAN_NAMES = [
    'Raj Kumar', 'Priya Sharma', 'Amit Patel', 'Neha Singh', 'Rohit Verma',
    'Anjali Gupta', 'Vikram Reddy', 'Sneha Desai', 'Arjun Mehta', 'Pooja Joshi',
    'Karan Shah', 'Riya Kapoor', 'Sanjay Iyer', 'Divya Nair', 'Rahul Khanna',
    'Kavita Rao', 'Manish Agarwal', 'Swati Bose', 'Aditya Malhotra', 'Meera Pillai'
];

const INDIAN_CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

const LOCALITIES = {
    Mumbai: ['Bandra West', 'Andheri East', 'Powai', 'Malad', 'Goregaon'],
    Delhi: ['Connaught Place', 'Dwarka', 'Rohini', 'Lajpat Nagar', 'Karol Bagh'],
    Bangalore: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Electronic City'],
    Hyderabad: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Kondapur'],
    Chennai: ['T Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'Mylapore'],
    Pune: ['Koregaon Park', 'Hinjewadi', 'Kharadi', 'Viman Nagar', 'Aundh'],
};

const PROPERTY_TYPES = ['1bhk', '2bhk', '3bhk', 'studio', 'villa'];
const AMENITIES = ['gym', 'pool', 'parking', 'security', 'power-backup', 'lift', 'garden'];

const PROPERTY_IMAGES = [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
];

export default function MockDataGenerator() {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [logs, setLogs] = useState<string[]>([]);
    const [stats, setStats] = useState({
        users: 0,
        properties: 0,
        conversations: 0,
        favorites: 0,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
            if (currentUser) {
                addLog(`User logged in: ${currentUser.email}`);
            }
        });
        return () => unsubscribe();
    }, []);

    const addLog = (message: string) => {
        console.log(message);
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setStatus('');
            addLog('Login successful');
        } catch (error) {
            console.error('Login error:', error);
            setStatus('❌ Login failed: ' + (error as Error).message);
            addLog('Login failed: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const testConnection = async () => {
        setLoading(true);
        setStatus('Starting diagnostics (Lite Mode)...');
        setLogs([]); // Clear previous logs
        addLog('--- Diagnostic Test Started (Lite SDK) ---');

        try {
            // 1. Check Browser Online Status
            addLog(`1. Browser Online: ${navigator.onLine ? 'Yes' : 'No'}`);
            if (!navigator.onLine) throw new Error('Browser is offline');

            // 2. Check Internet Reachability (Fetch)
            addLog('2. Testing Internet Reachability...');
            try {
                await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' });
                addLog('   -> Internet seems reachable');
            } catch (e) {
                addLog('   -> Fetch failed: ' + (e as Error).message);
                throw new Error('No internet access (Fetch failed)');
            }

            // 3. Firestore Read Test (Lite)
            addLog('3. Testing Firestore READ (Lite)...');
            const testRef = doc(dbLite, 'system', 'connection_test'); // Use dbLite

            const readPromise = getDoc(testRef);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Firestore READ timed out (5s)')), 5000)
            );

            await Promise.race([readPromise, timeoutPromise]);
            addLog('   -> Read successful (or document not found, which is fine)');

            // 4. Firestore Write Test (Lite)
            addLog('4. Testing Firestore WRITE (Lite)...');
            const writePromise = setDoc(testRef, {
                lastTest: serverTimestamp(),
                testedBy: user?.email,
                status: 'ok',
                mode: 'lite', // Added mode: 'lite'
                userAgent: navigator.userAgent
            });

            await Promise.race([writePromise, timeoutPromise]);
            addLog('   -> Write successful');

            setStatus('✅ All Systems Go! Connection Verified (Lite Mode).');
            addLog('--- Test Complete: SUCCESS ---');

        } catch (error) {
            console.error('Diagnostic error:', error);
            setStatus('❌ Test Failed: ' + (error as Error).message);
            addLog('--- Test Failed ---');
            addLog('Error: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const generateMockData = async () => {
        if (!user) {
            setStatus('❌ You must be logged in to generate data');
            return;
        }

        setLoading(true);
        setStatus('Generating mock data...');
        setLogs([]); // Clear previous logs
        addLog('Starting mock data generation (Lite Mode)...');

        try {
            // Generate Users
            setStatus('Creating mock users...');
            addLog('Generating users...');
            const userCount = await generateFakeIndianUsers(30);
            addLog(`✅ Created ${userCount} users`);

            // Generate Properties
            setStatus('Creating mock properties...');
            addLog('Generating properties...');
            const propCount = await generateFakeProperties(50);
            addLog(`✅ Created ${propCount} properties`);

            // Generate Conversations
            setStatus('Creating mock conversations...');
            addLog('Generating conversations...');
            // Note: Service functions handle their own logic, we just call them
            await generateFakeConversations(20);
            addLog('✅ Created conversations');

            // Generate Favorites
            setStatus('Creating mock favorites...');
            addLog('Generating favorites...');
            await generateFakeFavorites(30);
            addLog('✅ Created favorites');

            // Update stats (fetch from server or just estimate)
            setStats({
                users: 30,
                properties: 50,
                conversations: 20,
                favorites: 30,
            });

            setStatus('✅ Mock data generated successfully!');
            addLog('🎉 All done!');
        } catch (error) {
            console.error('Error generating mock data:', error);
            setStatus('❌ Error: ' + (error as Error).message);
            addLog('❌ Fatal error: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const clearMockData = async () => {
        if (!user) {
            setStatus('❌ You must be logged in to clear data');
            return;
        }

        if (!window.confirm('Are you sure you want to delete ALL data? This cannot be undone!')) {
            return;
        }

        setLoading(true);
        setStatus('Deleting all data...');
        addLog('Starting data cleanup...');

        try {
            // Delete all collections
            const collections = ['users', 'properties', 'conversations', 'favorites'];

            for (const collectionName of collections) {
                setStatus(`Deleting ${collectionName}...`);
                addLog(`Deleting ${collectionName}...`);
                const snapshot = await getDocs(collection(dbLite, collectionName));

                for (const document of snapshot.docs) {
                    // Delete subcollections if any
                    if (collectionName === 'conversations') {
                        const messagesSnapshot = await getDocs(
                            collection(dbLite, 'conversations', document.id, 'messages')
                        );
                        for (const msg of messagesSnapshot.docs) {
                            await deleteDoc(msg.ref);
                        }
                    }
                    await deleteDoc(document.ref);
                }
            }

            setStats({ users: 0, properties: 0, conversations: 0, favorites: 0 });
            setStatus('✅ All data cleared successfully!');
            addLog('✅ Cleanup complete');
        } catch (error) {
            console.error('Error clearing data:', error);
            setStatus('❌ Error clearing data: ' + (error as Error).message);
            addLog('❌ Cleanup failed: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login Required</h2>
                <p className="text-gray-600 mb-6 text-center">
                    You must be logged in to generate mock data.
                </p>
                {status && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        {status}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="admin@rentro.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Data Generator</h1>
                        <p className="text-gray-600">
                            Generate realistic test data for the Rentro application
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Logged in as</p>
                        <p className="font-semibold text-gray-900">{user.email}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-blue-600">{stats.users}</div>
                        <div className="text-sm text-gray-600">Users</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-600">{stats.properties}</div>
                        <div className="text-sm text-gray-600">Properties</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-600">{stats.conversations}</div>
                        <div className="text-sm text-gray-600">Conversations</div>
                    </div>
                    <div className="bg-pink-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-pink-600">{stats.favorites}</div>
                        <div className="text-sm text-gray-600">Favorites</div>
                    </div>
                </div>

                {/* Status */}
                {status && (
                    <div className={`p-4 rounded-xl mb-6 ${status.includes('✅') ? 'bg-green-50 text-green-800' :
                        status.includes('❌') ? 'bg-red-50 text-red-800' :
                            'bg-blue-50 text-blue-800'
                        }`}>
                        {status}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={generateMockData}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                        {loading ? 'Generating...' : '🎲 Generate Mock Data'}
                    </button>

                    <button
                        onClick={clearMockData}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                        {loading ? 'Clearing...' : '🗑️ Clear All Data'}
                    </button>
                </div>

                <div className="mb-8">
                    <button
                        onClick={testConnection}
                        disabled={loading}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Test Firebase Connection
                    </button>
                </div>

                {/* Logs */}
                <div className="bg-gray-900 rounded-xl p-4 h-64 overflow-y-auto font-mono text-sm text-green-400">
                    <div className="mb-2 text-gray-500 border-b border-gray-700 pb-2">Activity Log</div>
                    {logs.length === 0 ? (
                        <div className="text-gray-600 italic">Ready to generate data...</div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className="mb-1">{log}</div>
                        ))
                    )}
                </div>

                {/* Info */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">What will be generated:</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li>• 30 users (mix of tenants and property owners)</li>
                        <li>• 50 properties across major Indian cities</li>
                        <li>• 20 conversations between tenants and owners</li>
                        <li>• 30 favorite property listings</li>
                        <li>• Realistic Indian names, locations, and prices</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
