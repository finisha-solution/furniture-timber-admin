import { useEffect, useState } from 'react';
import { db } from '../../services/firebase-client';
import { collection, getDocs } from 'firebase/firestore';

export default function SalesReport() {
  const [sales, setSales] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'sales')).then(snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSales(data);
      setTotal(data.reduce((sum, s) => sum + (s.finalAmount || 0), 0));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sales Report</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">Total Sales: <span className="font-bold text-lg">KES {total.toLocaleString()}</span></p>
        <p className="text-sm text-blue-600">Total Transactions: {sales.length}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No sales recorded</td></tr>
              ) : (
                sales.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">KES {s.finalAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{s.createdAt?.toDate?.() ? s.createdAt.toDate().toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.paymentMethod}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}