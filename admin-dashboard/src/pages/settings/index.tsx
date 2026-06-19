import { useState } from 'react'; 
export default function Settings() { 
    const [tax, setTax] = useState('16'); 
    const [lowStock, setLowStock] = useState('10'); 
    const save = () => { 
        localStorage.setItem('taxRate', tax); 
        localStorage.setItem('lowStockAlert', lowStock); 
        alert('Saved (demo)'); 
    }; 
    return (
    <div>
        <h1 className="text-2xl font-bold mb-6">
            System Settings
        </h1>
        <div className="space-y-4">
            <div>
                <label>Tax Rate (%)</label>
                <input type="number" value={tax} onChange={e=>setTax(e.target.value)} className="border p-2 w-full" />
            </div>
            <div>
                <label>Low Stock Alert Threshold</label>
                <input type="number" value={lowStock} onChange={e=>setLowStock(e.target.value)} className="border p-2 w-full" />
            </div>
            <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">
                Save Settings
            </button>
        </div>
    </div>
    ); 
}