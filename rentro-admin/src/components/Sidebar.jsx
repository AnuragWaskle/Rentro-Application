import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileCheck, Home, Users, MessageSquare, Menu, ShieldCheck, ClipboardList, Settings, Flag, Bell } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
    const menuItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/verifications', icon: FileCheck, label: 'Verifications' },
        { path: '/properties', icon: Home, label: 'Properties' },
        { path: '/users', icon: Users, label: 'Users' },
        { path: '/reports', icon: Flag, label: 'Reports' },
        { path: '/broadcast', icon: Bell, label: 'Broadcast' },
        { path: '/logs', icon: ClipboardList, label: 'Activity Logs' },
        { path: '/mock-data', icon: MessageSquare, label: 'Mock Data' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-white/80 backdrop-blur-xl border-r border-white/20 z-30 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 w-64 shadow-2xl lg:shadow-none`}
            >
                <div className="p-6 border-b border-white/20 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                        <ShieldCheck size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Rentro<span className="text-primary-600">Admin</span></h1>
                </div>

                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-primary-50/80 text-primary-600 font-semibold shadow-sm backdrop-blur-sm'
                                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <Icon className={`w-5 h-5 transition-colors ${({ isActive }) => isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
                    <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-4 text-white shadow-lg shadow-primary-500/20">
                        <p className="text-xs font-medium opacity-80 mb-1">System Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                            <p className="text-sm font-bold">All Systems Operational</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
