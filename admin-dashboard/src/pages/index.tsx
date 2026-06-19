import { useEffect, useState } from 'react';
import { db } from '../services/firebase-client';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    productCount: 0,
    lowStock: 0,
    pendingExpenses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentSales, setRecentSales] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get total sales
        const salesSnap = await getDocs(collection(db, 'sales'));
        const total = salesSnap.docs.reduce((sum, doc) => sum + (doc.data().finalAmount || 0), 0);
        const recent = salesSnap.docs.slice(0, 5).map(doc => ({ id: doc.id, ...doc.data() }));

        // Get products
        const productsSnap = await getDocs(collection(db, 'products'));
        const low = productsSnap.docs.filter(d => (d.data().stockQty || 0) <= 10).length;

        // Get pending expenses
        const expensesQuery = query(collection(db, 'expenditures'), where('approvalStatus', '==', 'pending'));
        const expensesSnap = await getDocs(expensesQuery);

        setStats({
          totalSales: total,
          productCount: productsSnap.size,
          lowStock: low,
          pendingExpenses: expensesSnap.size,
        });
        setRecentSales(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h1>
        <p className="text-gray-600">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">KES {stats.totalSales.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl">
              💰
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.productCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-xl">
              📦
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className={`text-2xl font-bold ${stats.lowStock > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {stats.lowStock}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-xl">
              ⚠️
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Expenses</p>
              <p className={`text-2xl font-bold ${stats.pendingExpenses > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
                {stats.pendingExpenses}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 text-xl">
              💳
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Recent Sales</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No sales yet</td>
                </tr>
              ) : (
                recentSales.map((sale, index) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">KES {sale.finalAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {sale.createdAt?.toDate?.() ? sale.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
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