import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { ClipboardList, User, Shield, AlertTriangle } from 'lucide-react';

export default function AdminLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking logs for now as we haven't implemented logging middleware yet
        // In a real app, you'd fetch from 'admin_logs' collection
        const mockLogs = [
            { id: 1, action: 'User Verified', detail: 'Verified user John Doe', admin: 'Admin User', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
            { id: 2, action: 'Property Approved', detail: 'Approved listing "Luxury Apartment"', admin: 'Admin User', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
            { id: 3, action: 'System Setting', detail: 'Enabled Maintenance Mode', admin: 'Super Admin', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
            { id: 4, action: 'User Banned', detail: 'Banned user spammer@example.com', admin: 'Admin User', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
            { id: 5, action: 'Data Export', detail: 'Exported User Data CSV', admin: 'Admin User', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25) },
        ];

        setLogs(mockLogs);
        setLoading(false);
    }, []);

    if (loading) return <div className="p-8">Loading logs...</div>;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
                <p className="text-gray-600 mt-1">Track all administrative actions and system events</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Detail</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Admin</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-2 font-medium text-gray-900">
                                        <ClipboardList className="w-4 h-4 text-indigo-500" />
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{log.detail}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                                        <Shield className="w-3 h-3" />
                                        {log.admin}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {log.timestamp.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
