import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

export default function VerificationQueue() {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const q = query(
            collection(db, 'verifications'),
            where('status', '==', 'pending')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const verifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setVerifications(verifs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Verification Queue</h1>
                <p className="text-gray-600 mt-1">Review pending owner verifications</p>
            </div>

            {verifications.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <p className="text-xl text-gray-600">No pending verifications</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {verifications.map((verification) => (
                        <div
                            key={verification.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                <p className="text-sm text-gray-600">User ID</p>
                                <p className="font-mono text-xs text-gray-800">{verification.userId.substring(0, 12)}...</p>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <img
                                        src={verification.idCardUrl}
                                        alt="ID"
                                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                    />
                                    <img
                                        src={verification.selfieUrl}
                                        alt="Selfie"
                                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                    />
                                </div>

                                {verification.aiFaceMatchScore && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-1">AI Match Score</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${verification.aiFaceMatchScore >= 85
                                                            ? 'bg-green-500'
                                                            : verification.aiFaceMatchScore >= 70
                                                                ? 'bg-yellow-500'
                                                                : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${verification.aiFaceMatchScore}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold">{verification.aiFaceMatchScore}%</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => navigate(`/verification/${verification.id}`)}
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    Review Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
