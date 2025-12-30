import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, getCountFromServer } from 'firebase/firestore';
import { Users, FileCheck, Home, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingVerifications: 0,
        activeListings: 0,
        pendingListings: 0,
    });

    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        // Get stats
        const fetchStats = async () => {
            try {
                const usersSnap = await getCountFromServer(collection(db, 'users'));
                const verificationQuery = query(
                    collection(db, 'verifications'),
                    where('status', '==', 'pending')
                );
                const verificationsSnap = await getCountFromServer(verificationQuery);

                const listingsQuery = query(
                    collection(db, 'properties'),
                    where('status', '==', 'verified')
                );
                const listingsSnap = await getCountFromServer(listingsQuery);

                const pendingListingsQuery = query(
                    collection(db, 'properties'),
                    where('status', '==', 'pending')
                );
                const pendingListingsSnap = await getCountFromServer(pendingListingsQuery);

                setStats({
                    totalUsers: usersSnap.data().count,
                    pendingVerifications: verificationsSnap.data().count,
                    activeListings: listingsSnap.data().count,
                    pendingListings: pendingListingsSnap.data().count,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();

        // Listen to recent properties for activity feed
        const q = query(
            collection(db, 'properties'),
            where('createdAt', '!=', null)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const activities = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
                .slice(0, 10);

            setRecentActivity(activities);
        });

        return () => unsubscribe();
    }, []);

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: '+12%',
        },
        {
            title: 'Pending Verifications',
            value: stats.pendingVerifications,
            icon: FileCheck,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            trend: 'Requires Action',
        },
        {
            title: 'Active Listings',
            value: stats.activeListings,
            icon: Home,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            trend: '+5%',
        },
        {
            title: 'Pending Listings',
            value: stats.pendingListings,
            icon: AlertTriangle,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            trend: 'Requires Action',
        },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of your platform's performance</p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${stat.bg} p-3 rounded-xl`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend.includes('Action') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                    }`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Recent Listings</h2>
                        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
                    </div>
                    <div className="p-0">
                        {recentActivity.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <Home className="w-12 h-12 mb-3 opacity-20" />
                                <p>No recent activity</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={activity.images?.[0] || 'https://via.placeholder.com/60'}
                                                alt={activity.title}
                                                className="w-12 h-12 rounded-lg object-cover ring-1 ring-gray-100"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900">{activity.title}</p>
                                                <p className="text-sm text-gray-500">{activity.city}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.status === 'verified'
                                                    ? 'bg-green-100 text-green-800'
                                                    : activity.status === 'pending'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                            </span>
                                            {activity.aiAnalysis && (
                                                <div className="flex items-center justify-end gap-1 mt-1">
                                                    <span className="text-xs text-gray-400">AI Score:</span>
                                                    <span className={`text-xs font-bold ${activity.aiAnalysis.spamScore > 50 ? 'text-red-500' : 'text-green-500'
                                                        }`}>
                                                        {activity.aiAnalysis.spamScore}/100
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions or Tips */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg text-white p-6">
                    <h2 className="text-xl font-bold mb-4">Admin Tips</h2>
                    <div className="space-y-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileCheck className="w-5 h-5 text-indigo-200" />
                                <h3 className="font-semibold">Verification First</h3>
                            </div>
                            <p className="text-sm text-indigo-100">Always check the AI confidence score before approving user verifications.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-5 h-5 text-indigo-200" />
                                <h3 className="font-semibold">Spam Detection</h3>
                            </div>
                            <p className="text-sm text-indigo-100">Properties with spam score &gt; 80 are automatically flagged for review.</p>
                        </div>
                    </div>
                    <button className="w-full mt-6 bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                        View System Logs
                    </button>
                </div>
            </div>
        </div>
    );
}
