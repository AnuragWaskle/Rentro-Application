import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, XCircle, PlusSquare, Download } from 'lucide-react';
import { generateFakeProperties } from '../services/fakeDataService';

export default function PropertyQueue() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const q = query(
            collection(db, 'properties'),
            where('status', '==', 'pending')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const props = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProperties(props);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleGenerateProperties = async () => {
        setGenerating(true);
        try {
            const count = await generateFakeProperties(20);
            alert(`Successfully generated ${count} fake properties!`);
        } catch (error) {
            console.error('Error generating properties:', error);
            alert('Failed to generate properties');
        } finally {
            setGenerating(false);
        }
    };

    const handleExportCSV = () => {
        if (properties.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = ['ID', 'Title', 'City', 'Price', 'Status', 'Owner Name'];
        const csvContent = [
            headers.join(','),
            ...properties.map(p => [
                p.id,
                `"${p.title}"`,
                p.city,
                p.price,
                p.status,
                `"${p.ownerName}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'properties_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleApprove = async (propertyId) => {
        if (!window.confirm('Approve this listing?')) return;

        try {
            await updateDoc(doc(db, 'properties', propertyId), {
                status: 'verified',
            });
            alert('Property approved!');
        } catch (error) {
            console.error('Error approving:', error);
            alert('Failed to approve');
        }
    };

    const handleReject = async (propertyId) => {
        const reason = window.prompt('Rejection reason:');
        if (!reason) return;

        try {
            await updateDoc(doc(db, 'properties', propertyId), {
                status: 'rejected',
                rejectionReason: reason,
            });
            alert('Property rejected');
        } catch (error) {
            console.error('Error rejecting:', error);
            alert('Failed to reject');
        }
    };

    const getSpamScoreColor = (score) => {
        if (score < 30) return 'text-green-600 bg-green-100';
        if (score < 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Property Queue</h1>
                    <p className="text-gray-600 mt-1">Review and approve pending listings</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleGenerateProperties}
                        disabled={generating}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {generating ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <PlusSquare className="w-5 h-5" />
                        )}
                        Generate Fake
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        Export CSV
                    </button>
                </div>
            </div>

            {properties.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">No pending properties</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Property</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">AI Analysis</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {properties.map((property) => (
                                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={property.images?.[0] || 'https://via.placeholder.com/80'}
                                                alt={property.title}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">{property.title}</p>
                                                <p className="text-sm text-gray-500">{property.bhk} BHK • {property.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900">{property.city}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-900">₹{property.price.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500">per month</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {property.aiAnalysis ? (
                                            <div>
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSpamScoreColor(property.aiAnalysis.spamScore)}`}>
                                                    Spam Score: {property.aiAnalysis.spamScore}/100
                                                </span>
                                                {property.aiAnalysis.flags && property.aiAnalysis.flags.length > 0 && (
                                                    <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        <span>{property.aiAnalysis.flags.length} flags</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm">No data</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(property.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(property.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
