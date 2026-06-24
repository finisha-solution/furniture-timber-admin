import { useEffect, useState } from 'react';
import { db } from '../services/firebase-client';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    productCount: 0,
    lowStock: 0,
    pendingExpenses: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [pendingExpenses, setPendingExpenses] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get total sales
        const salesSnap = await getDocs(collection(db, 'sales'));
        const total = salesSnap.docs.reduce((sum, doc) => sum + (doc.data().finalAmount || 0), 0);
        const recent = salesSnap.docs.slice(0, 5).map(doc => ({ id: doc.id, ...doc.data() }));

        // Get products
        const productsSnap = await getDocs(collection(db, 'products'));
        const low = productsSnap.docs.filter(d => (d.data().stockQty || 0) <= (d.data().reorderPoint || 10));
        const lowCount = low.length;

        // Get pending expenses
        const expensesQuery = query(collection(db, 'expenditures'), where('approvalStatus', '==', 'pending'));
        const expensesSnap = await getDocs(expensesQuery);
        const pendingExp = expensesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        setStats({
          totalSales: total,
          productCount: productsSnap.size,
          lowStock: lowCount,
          pendingExpenses: pendingExp.length,
          pendingApprovals: pendingExp.length,
        });
        setRecentSales(recent);
        setPendingExpenses(pendingExp);
        setLowStockItems(low.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const approveExpense = async (id: string) => {
    try {
      await updateDoc(doc(db, 'expenditures', id), { 
        approvalStatus: 'approved',
        approvedAt: new Date()
      });
      // Refresh data
      window.location.reload();
    } catch (error) {
      alert('Error approving expense');
    }
  };

  const rejectExpense = async (id: string) => {
    if (!confirm('Reject this expense?')) return;
    try {
      await updateDoc(doc(db, 'expenditures', id), { 
        approvalStatus: 'rejected',
        rejectedAt: new Date()
      });
      window.location.reload();
    } catch (error) {
      alert('Error rejecting expense');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
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
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.productCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-xl">📦</div>
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
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <p className={`text-2xl font-bold ${stats.pendingApprovals > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
                {stats.pendingApprovals}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 text-xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Pending Approvals Widget */}
      {stats.pendingApprovals > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">⏳ Pending Approvals</h2>
            <Link href="/finance/expenditures" className="text-sm text-blue-600 hover:text-blue-800">View All →</Link>
          </div>
          <div className="space-y-3">
            {pendingExpenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{exp.category} - {exp.description}</p>
                  <p className="text-sm text-gray-500">KES {exp.totalAmount?.toLocaleString()} • {exp.payeeName}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveExpense(exp.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">Approve</button>
                  <button onClick={() => rejectExpense(exp.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock Alerts Widget */}
      {stats.lowStock > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">🔴 Low Stock Alerts</h2>
            <Link href="/inventory" className="text-sm text-blue-600 hover:text-blue-800">View All →</Link>
          </div>
          <div className="space-y-3">
            {lowStockItems.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-red-600">Stock: {item.stockQty} (Reorder at {item.reorderPoint || 10})</p>
                </div>
                <Link href={`/inventory/products/edit/${item.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">Order More</Link>
              </div>
            ))}
          </div>
        </div>
      )}

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentSales.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No sales yet</td></tr>
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
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Completed</span>
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