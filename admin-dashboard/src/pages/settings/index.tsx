import { useState } from 'react';
import Link from 'next/link';

export default function Settings() {
  const [taxRate, setTaxRate] = useState('16');
  const [lowStockAlert, setLowStockAlert] = useState('10');

  const saveSettings = () => {
    localStorage.setItem('taxRate', taxRate);
    localStorage.setItem('lowStockAlert', lowStockAlert);
    alert('Settings saved!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={e => setTaxRate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert Threshold</label>
              <input
                type="number"
                value={lowStockAlert}
                onChange={e => setLowStockAlert(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={saveSettings}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Security</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
              <Link href="/settings/password" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
                Change
              </Link>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add extra security to your account</p>
              </div>
              <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm cursor-not-allowed opacity-50" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Backup</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Manual Backup</p>
                <p className="text-sm text-gray-500">Create a backup of all data</p>
              </div>
              <Link href="/backup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
                Run Backup
              </Link>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Auto Backup Schedule</p>
                <p className="text-sm text-gray-500">Daily at 2:00 AM</p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">System Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Version</span>
              <span className="text-gray-900">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Firebase Project</span>
              <span className="text-gray-900">tbms-project</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Environment</span>
              <span className="text-gray-900">Production</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Last Backup</span>
              <span className="text-gray-900">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}