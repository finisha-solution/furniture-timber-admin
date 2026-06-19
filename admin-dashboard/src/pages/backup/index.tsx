import { useState } from 'react'; 
export default function Backup() { 
    const [status, setStatus] = useState(''); 
    const runBackup = async () => { setStatus('Backing up...'); 
        const res = await fetch('/api/backup/create', { method: 'POST' }); 
        setStatus(res.ok ? 'Backup completed' : 'Failed'); 
    }; 
    return (
    <div>
        <h1 className="text-2xl font-bold mb-6">Database Backup</h1>
        <button onClick={runBackup} className="bg-blue-600 text-white px-4 py-2 rounded">Run Manual Backup</button>
        <p className="mt-4">{status}</p>
    </div>); 
}