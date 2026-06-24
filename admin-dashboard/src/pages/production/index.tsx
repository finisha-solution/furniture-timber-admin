import { useEffect, useState, useCallback } from 'react';
import { db } from '../../services/firebase-client';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';

interface ProductionJob {
  id: string;
  finishedProductName: string;
  quantityToProduce: number;
  quantityProduced: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: any;
  startedAt?: any;
  completedDate?: any;
}

export default function Production() {
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const q = query(collection(db, 'production_jobs'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductionJob));
      setJobs(data);
    } catch (err) {
      console.error('Error fetching production jobs:', err);
      setError('Failed to load production jobs. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const completeJob = async (id: string) => {
    const qty = prompt('Enter quantity produced:');
    if (qty === null) return; // User cancelled
    
    const parsedQty = parseInt(qty);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      alert('Please enter a valid positive number.');
      return;
    }

    try {
      setCompletingId(id);
      await updateDoc(doc(db, 'production_jobs', id), {
        status: 'completed',
        quantityProduced: parsedQty,
        completedDate: new Date()
      });
      await fetchJobs(); // Refresh the list
    } catch (err) {
      console.error('Error completing job:', err);
      alert('Failed to complete job. Please try again.');
    } finally {
      setCompletingId(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      return timestamp.toDate?.()?.toLocaleDateString() || 'N/A';
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading production jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700">{error}</p>
        <button onClick={fetchJobs} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
          Retry
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Production Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your workshop production jobs</p>
        </div>
        <Link 
          href="/production/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <span className="text-lg">+</span> Create Job
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produced</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">🔨</div>
                    <p>No production jobs yet</p>
                    <Link href="/production/new" className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
                      Create your first job →
                    </Link>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {job.finishedProductName || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{job.quantityToProduce}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{job.quantityProduced || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                        {job.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      {job.status !== 'completed' && job.status !== 'cancelled' && (
                        <button
                          onClick={() => completeJob(job.id)}
                          disabled={completingId === job.id}
                          className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {completingId === job.id ? 'Completing...' : 'Complete'}
                        </button>
                      )}
                      {job.status === 'completed' && (
                        <span className="text-green-600 text-sm">✓ Done</span>
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