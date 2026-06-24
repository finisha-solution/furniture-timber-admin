import { useEffect, useState } from 'react';
import { db } from '../../services/firebase-client';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Define the Sale interface
interface Sale {
  id: string;
  customerName: string;
  finalAmount: number;
  paymentMethod: string;
  createdAt: any;
  items?: any[];
  subtotal?: number;
  discountAmount?: number;
  salespersonId?: string;
  salespersonName?: string;
}

export default function SalesReport() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError(null);
        const q = query(collection(db, 'sales'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Sale[];
        setSales(data);
        const totalAmount = data.reduce((sum, s) => sum + (s.finalAmount || 0), 0);
        setTotal(totalAmount);
      } catch (err) {
        console.error('Error fetching sales:', err);
        setError('Failed to load sales data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('en-KE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return new Date(timestamp).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  // Calculate additional statistics
  const totalTransactions = sales.length;
  const averageSale = totalTransactions > 0 ? total / totalTransactions : 0;
  const cashSales = sales.filter(s => s.paymentMethod === 'cash').length;
  const mpesaSales = sales.filter(s => s.paymentMethod === 'mpesa').length;
  const bankSales = sales.filter(s => s.paymentMethod === 'bank_transfer').length;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading sales report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Report</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of all sales transactions</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold text-blue-600">KES {total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Transactions</p>
          <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Average Sale</p>
          <p className="text-2xl font-bold text-green-600">KES {averageSale.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Payment Methods</p>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Cash: {cashSales}</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">M-Pesa: {mpesaSales}</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Bank: {bankSales}</span>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salesperson</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">💰</div>
                    <p>No sales recorded yet</p>
                  </td>
                </tr>
              ) : (
                sales.map((sale, index) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.customerName || 'Walk-in'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">KES {sale.finalAmount?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(sale.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        sale.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' :
                        sale.paymentMethod === 'mpesa' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {sale.paymentMethod || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sale.salespersonName || 'N/A'}</td>
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