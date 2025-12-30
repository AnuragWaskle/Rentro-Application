import React, { useState } from 'react';
import { Flag, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

export default function Reports() {
    const [reports, setReports] = useState([
        { id: 1, type: 'Property', target: 'Luxury Apartment', reason: 'Fake Images', reporter: 'user1@example.com', status: 'pending', date: '2023-10-25' },
        { id: 2, type: 'User', target: 'John Doe', reason: 'Abusive Behavior', reporter: 'user2@example.com', status: 'pending', date: '2023-10-24' },
        { id: 3, type: 'Property', target: 'Studio Flat', reason: 'Wrong Price', reporter: 'user3@example.com', status: 'resolved', date: '2023-10-23' },
    ]);

    const handleAction = (id, action) => {
        setReports(reports.map(r => r.id === id ? { ...r, status: action } : r));
        alert(`Report marked as ${action}`);
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Reports Center</h1>
                <p className="text-gray-600 mt-1">Review and resolve user-submitted reports</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Target</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reason</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reporter</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{report.target}</p>
                                        <span className="text-xs text-gray-500 uppercase tracking-wider">{report.type}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium">
                                        <Flag className="w-3 h-3" />
                                        {report.reason}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{report.reporter}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {report.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAction(report.id, 'resolved')}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Resolve (No Violation)"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleAction(report.id, 'banned')}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Ban/Remove"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                                                <ExternalLink className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
