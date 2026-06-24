import { useState } from 'react';

export default function Backup() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [backupData, setBackupData] = useState<any>(null);

  const runBackup = async () => {
    setLoading(true);
    setStatus('Running backup...');
    try {
      const res = await fetch('/api/backup/create', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus(`✅ Backup completed! ${new Date(data.timestamp).toLocaleString()}`);
        setBackupData(data.backup);
      } else {
        setStatus(`❌ Backup failed: ${data.error}`);
      }
    } catch (err) {
      setStatus('❌ Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Database Backup</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <p className="text-gray-600 mb-4">Create a backup of all your business data.</p>
        <button
          onClick={runBackup}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Backing up...' : 'Run Backup'}
        </button>
        {status && <p className={`mt-4 ${status.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{status}</p>}
      </div>

      {backupData && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Backup Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(backupData).map(([collection, docs]: [string, any]) => (
              <div key={collection} className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-500">{collection}</p>
                <p className="text-xl font-bold text-gray-900">{docs.length}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}