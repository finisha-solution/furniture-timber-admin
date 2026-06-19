import { useEffect, useState } from 'react';
import { db } from '../../services/firebase-client';
import { collection, getDocs } from 'firebase/firestore';

export default function InventoryReport() {
  const [products, setProducts] = useState<any[]>([]);
  const [totalStock, setTotalStock] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'products')).then(snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(data);
      setTotalStock(data.reduce((sum, p) => sum + (p.stockQty || 0), 0));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inventory Report</h1>
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-green-800">Total Products: <span className="font-bold text-lg">{products.length}</span></p>
        <p className="text-sm text-green-600">Total Stock Items: {totalStock}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No products</td></tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.stockQty}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">KES {p.costPrice?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">KES {p.sellingPrice?.toLocaleString()}</td>
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