import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function VerificationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [verification, setVerification] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get verification request
                const verificationDoc = await getDoc(doc(db, 'verifications', id));

                if (verificationDoc.exists()) {
                    const verificationData = { id: verificationDoc.id, ...verificationDoc.data() };
                    setVerification(verificationData);

                    // Get user data
                    const userDoc = await getDoc(doc(db, 'users', verificationData.userId));
                    if (userDoc.exists()) {
                        setUser({ id: userDoc.id, ...userDoc.data() });
                    }
                }
            } catch (error) {
                console.error('Error fetching verification:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleApprove = async () => {
        if (!window.confirm('Are you sure you want to approve this verification?')) {
            return;
        }

        setProcessing(true);
        try {
            // Update verification status
            await updateDoc(doc(db, 'verifications', id), {
                status: 'approved',
                reviewedAt: serverTimestamp(),
                reviewedBy: 'admin', // Replace with actual admin ID
            });

            // Update user verification status
            await updateDoc(doc(db, 'users', verification.userId), {
                isVerified: true,
                trustScore: increment(20), // Reward for verification
            });

            alert('Verification approved successfully!');
            navigate('/verifications');
        } catch (error) {
            console.error('Error approving verification:', error);
            alert('Failed to approve verification');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        const reason = window.prompt('Enter rejection reason:');
        if (!reason) return;

        setProcessing(true);
        try {
            await updateDoc(doc(db, 'verifications', id), {
                status: 'rejected',
                rejectionReason: reason,
                reviewedAt: serverTimestamp(),
                reviewedBy: 'admin',
            });

            alert('Verification rejected');
            navigate('/verifications');
        } catch (error) {
            console.error('Error rejecting verification:', error);
            alert('Failed to reject verification');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading verification details...</p>
                </div>
            </div>
        );
    }

    if (!verification || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">Verification not found</p>
                </div>
            </div>
        );
    }

    const matchScore = verification.aiFaceMatchScore || 0;
    const matchConfidence = matchScore >= 85 ? 'High' : matchScore >= 70 ? 'Medium' : 'Low';
    const matchColor = matchScore >= 85 ? 'text-green-600' : matchScore >= 70 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Owner Verification</h1>
                <p className="text-gray-600 mt-1">Review and approve/reject verification request</p>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{user.name || user.email}</h2>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500 mt-1">Phone: {user.phone || 'Not provided'}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Trust Score</div>
                        <div className="text-3xl font-bold text-primary-500">{user.trustScore || 50}</div>
                    </div>
                </div>
            </div>

            {/* AI Match Score */}
            <div className={`p-6 rounded-xl mb-6 border-2 ${matchScore >= 85 ? 'bg-green-50 border-green-200' :
                    matchScore >= 70 ? 'bg-yellow-50 border-yellow-200' :
                        'bg-red-50 border-red-200'
                }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-700">AI Face Match Score</p>
                        <p className={`text-4xl font-bold ${matchColor} mt-1`}>{matchScore}%</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Confidence</p>
                        <p className={`text-xl font-bold ${matchColor}`}>{matchConfidence}</p>
                    </div>
                </div>
            </div>

            {/* Side-by-Side Viewer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* ID Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">Government ID Card</h3>
                    </div>
                    <div className="p-6">
                        <img
                            src={verification.idCardUrl}
                            alt="ID Card"
                            className="w-full h-auto rounded-lg border-2 border-gray-200"
                        />
                    </div>
                </div>

                {/* Selfie */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">Live Selfie</h3>
                    </div>
                    <div className="p-6">
                        <img
                            src={verification.selfieUrl}
                            alt="Selfie"
                            className="w-full h-auto rounded-lg border-2 border-gray-200"
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <CheckCircle className="w-5 h-5" />
                    Approve Verification
                </button>
                <button
                    onClick={handleReject}
                    disabled={processing}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <XCircle className="w-5 h-5" />
                    Reject Verification
                </button>
            </div>

            {processing && (
                <div className="mt-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                    <p className="text-sm text-gray-600 mt-2">Processing...</p>
                </div>
            )}
        </div>
    );
}
