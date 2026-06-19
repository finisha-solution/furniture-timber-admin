import { useState } from 'react';

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg">
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
    </div>
  );
}