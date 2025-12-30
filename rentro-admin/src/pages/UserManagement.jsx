import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Users, Shield, Ban, CheckCircle, Trash2, Search, UserPlus, Download } from 'lucide-react';
import { generateFakeIndianUsers } from '../services/fakeDataService';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        const q = query(collection(db, 'users'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(usersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleGenerateFakeUsers = async () => {
        setGenerating(true);
        try {
            const count = await generateFakeIndianUsers(50);
            alert(`Successfully generated ${count} fake Indian users!`);
        } catch (error) {
            console.error('Error generating users:', error);
            alert('Failed to generate users');
        } finally {
            setGenerating(false);
        }
    };

    const handleExportCSV = () => {
        if (users.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Trust Score'];
        const csvContent = [
            headers.join(','),
            ...users.map(u => [
                u.id,
                `"${u.name || ''}"`,
                u.email,
                u.role,
                u.isBanned ? 'Banned' : u.isVerified ? 'Verified' : 'Active',
                u.trustScore || 0
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'users_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleVerify = async (userId, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            await updateDoc(doc(db, 'users', userId), {
                isVerified: newStatus,
                trustScore: newStatus ? 70 : 30,
            });
            alert(`User ${newStatus ? 'verified' : 'unverified'} successfully`);
        } catch (error) {
            console.error('Error updating verification:', error);
            alert('Failed to update verification');
        }
    };

    const handleBan = async (userId) => {
        if (!window.confirm('Are you sure you want to ban this user? This will restrict their access.')) {
            return;
        }

        try {
            await updateDoc(doc(db, 'users', userId), {
                isBanned: true,
                trustScore: 0,
            });
            alert('User banned successfully');
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Failed to ban user');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to DELETE this user? This action cannot be undone!')) {
            return;
        }

        const confirmText = window.prompt('Type "DELETE" to confirm deletion:');
        if (confirmText !== 'DELETE') {
            alert('Deletion cancelled');
            return;
        }

        try {
            await deleteDoc(doc(db, 'users', userId));
            alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const handleTrustScoreUpdate = async (userId, newScore) => {
        const score = parseInt(newScore);
        if (isNaN(score) || score < 0 || score > 100) {
            alert('Trust score must be between 0 and 100');
            return;
        }

        try {
            await updateDoc(doc(db, 'users', userId), {
                trustScore: score,
            });
            alert('Trust score updated');
        } catch (error) {
            console.error('Error updating trust score:', error);
            alert('Failed to update trust score');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

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
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage all users, verify accounts, and control access</p>
                </div>
                <button
                    onClick={handleGenerateFakeUsers}
                    disabled={generating}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {generating ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <UserPlus className="w-5 h-5" />
                    )}
                    Generate 50 Fake Users
                </button>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors ml-3"
                >
                    <Download className="w-5 h-5" />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="all">All Roles</option>
                        <option value="tenant">Tenants</option>
                        <option value="owner">Owners</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                    <span>Total: {filteredUsers.length} users</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium">
                        Verified: {filteredUsers.filter(u => u.isVerified).length}
                    </span>
                    <span>•</span>
                    <span className="text-red-600 font-medium">
                        Banned: {filteredUsers.filter(u => u.isBanned).length}
                    </span>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trust Score</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name || 'No name'}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                            {user.phone && (
                                                <p className="text-xs text-gray-400">{user.phone}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'owner' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                            <Users className="w-3 h-3" />
                                            {user.role || 'tenant'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                <div
                                                    className={`h-2 rounded-full ${user.trustScore >= 70 ? 'bg-green-500' :
                                                        user.trustScore >= 40 ? 'bg-yellow-500' :
                                                            'bg-red-500'
                                                        }`}
                                                    style={{ width: `${user.trustScore || 50}%` }}
                                                ></div>
                                            </div>
                                            <input
                                                type="number"
                                                value={user.trustScore || 50}
                                                onChange={(e) => handleTrustScoreUpdate(user.id, e.target.value)}
                                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                                                min="0"
                                                max="100"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {user.isVerified ? (
                                                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                                    <Shield className="w-3 h-3" />
                                                    Not Verified
                                                </span>
                                            )}
                                            {user.isBanned && (
                                                <span className="inline-flex items-center gap-1 text-xs text-red-600">
                                                    <Ban className="w-3 h-3" />
                                                    Banned
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleVerify(user.id, user.isVerified)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${user.isVerified
                                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                                    }`}
                                            >
                                                {user.isVerified ? 'Unverify' : 'Verify'}
                                            </button>

                                            {!user.isBanned && (
                                                <button
                                                    onClick={() => handleBan(user.id)}
                                                    className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                                                >
                                                    <Ban className="w-3 h-3" />
                                                    Ban
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
