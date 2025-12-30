import React, { useState } from 'react';
import { Send, Bell, Info, AlertTriangle } from 'lucide-react';

export default function Broadcast() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [sending, setSending] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);

        // Simulate sending to Firestore 'notifications' collection
        await new Promise(resolve => setTimeout(resolve, 1500));

        alert('Broadcast notification sent successfully!');
        setTitle('');
        setMessage('');
        setSending(false);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Broadcast Notification</h1>
                <p className="text-gray-600 mt-1">Send a push notification to all users</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <form onSubmit={handleSend} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notification Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                            placeholder="e.g., System Maintenance Update"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message Body</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none h-32 resize-none"
                            placeholder="Enter your message here..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                type="button"
                                onClick={() => setType('info')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${type === 'info' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <Info className="w-6 h-6" />
                                <span className="text-sm font-medium">Info</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('warning')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${type === 'warning' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <AlertTriangle className="w-6 h-6" />
                                <span className="text-sm font-medium">Warning</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('promo')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${type === 'promo' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <Bell className="w-6 h-6" />
                                <span className="text-sm font-medium">Promo</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {sending ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Send Broadcast
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
