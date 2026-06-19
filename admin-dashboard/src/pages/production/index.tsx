import { useEffect, useState } from 'react';
import { db } from '../../services/firebase-client';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function Production() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'production_jobs')).then(snap => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const completeJob = async (id: string) => {
    const qty = prompt('Enter quantity produced:');
    if (!qty) return;
    await updateDoc(doc(db, 'production_jobs', id), {
      status: 'completed',
      quantityProduced: parseInt(qty),
      completedDate: new Date()
    });
    window.location.reload();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Production Jobs</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">+ Create Job</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Planned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produced</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No production jobs</td></tr>
              ) : (
                jobs.map(j => (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{j.finishedProductName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{j.quantityToProduce}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{j.quantityProduced || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${j.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {j.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {j.status !== 'completed' && (
                        <button onClick={() => completeJob(j.id)} className="text-blue-600 hover:text-blue-800 text-sm">Complete</button>
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