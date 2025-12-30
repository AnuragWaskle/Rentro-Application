import React, { useState } from 'react';
import { Save, RefreshCw, Power, ShieldAlert, Bell } from 'lucide-react';

export default function Settings() {
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        allowSignups: true,
        requireVerification: true,
        emailNotifications: true,
        autoApproveProperties: false,
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        // Save to Firestore 'system_settings' collection
        alert('Settings saved successfully!');
    };

    return (
        <div className="p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                <p className="text-gray-600 mt-1">Configure global application preferences</p>
            </div>

            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Power className="w-5 h-5 text-indigo-500" />
                        General Controls
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Maintenance Mode</p>
                                <p className="text-sm text-gray-500">Disable access for all non-admin users</p>
                            </div>
                            <button
                                onClick={() => handleToggle('maintenanceMode')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Allow New Signups</p>
                                <p className="text-sm text-gray-500">Enable or disable user registration</p>
                            </div>
                            <button
                                onClick={() => handleToggle('allowSignups')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.allowSignups ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.allowSignups ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-indigo-500" />
                        Security & Verification
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Require Identity Verification</p>
                                <p className="text-sm text-gray-500">Users must verify ID before listing properties</p>
                            </div>
                            <button
                                onClick={() => handleToggle('requireVerification')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.requireVerification ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.requireVerification ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Auto-Approve Low Risk Properties</p>
                                <p className="text-sm text-gray-500">Automatically approve listings with spam score &lt; 10</p>
                            </div>
                            <button
                                onClick={() => handleToggle('autoApproveProperties')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoApproveProperties ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.autoApproveProperties ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200"
                    >
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
