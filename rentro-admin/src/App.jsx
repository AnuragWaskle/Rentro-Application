import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VerificationQueue from './pages/VerificationQueue';
import VerificationDetails from './pages/VerificationDetails';
import PropertyQueue from './pages/PropertyQueue';
import UserManagement from './pages/UserManagement';
import AdminLogs from './pages/AdminLogs';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Broadcast from './pages/Broadcast';
import MockDataGenerator from './pages/MockDataGenerator';
import { Menu } from 'lucide-react';
import './index.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64 relative">
          {/* Top bar */}
          <div className="bg-white/80 backdrop-blur-md border-b border-white/20 px-6 py-4 flex items-center sticky top-0 z-20 shadow-sm">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="ml-auto">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@rentro.com</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20 ring-2 ring-white">
                  A
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/verifications" element={<VerificationQueue />} />
              <Route path="/verification/:id" element={<VerificationDetails />} />
              <Route path="/properties" element={<PropertyQueue />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/broadcast" element={<Broadcast />} />
              <Route path="/logs" element={<AdminLogs />} />
              <Route path="/mock-data" element={<MockDataGenerator />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
