import { useEffect, useState } from 'react';
import { db } from '../../services/firebase-client';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function Expenditures() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'expenditures')).then(snap => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const approveExpense = async (id: string) => {
    await updateDoc(doc(db, 'expenditures', id), { approvalStatus: 'approved' });
    window.location.reload();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Expenditures</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No expenses recorded</td></tr>
              ) : (
                expenses.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">{e.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{e.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">KES {e.totalAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${e.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {e.approvalStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {e.approvalStatus !== 'approved' && (
                        <button onClick={() => approveExpense(e.id)} className="text-blue-600 hover:text-blue-800 text-sm">Approve</button>
                      )}
                    </td>
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