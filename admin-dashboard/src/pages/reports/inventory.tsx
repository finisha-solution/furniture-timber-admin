import { useEffect, useState } from 'react';
import { db } from '../../services/firebase-client';
import { collection, getDocs } from 'firebase/firestore';

// Define the Product interface
interface Product {
  id: string;
  name: string;
  stockQty: number;
  costPrice: number;
  sellingPrice: number;
  sku?: string;
  category?: string;
  reorderPoint?: number;
}

export default function InventoryReport() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalStock, setTotalStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const snap = await getDocs(collection(db, 'products'));
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(data);
        const total = data.reduce((sum, p) => sum + (p.stockQty || 0), 0);
        setTotalStock(total);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load inventory data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading inventory report...</p>
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

  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.costPrice || 0) * (p.stockQty || 0), 0);
  const lowStockItems = products.filter(p => (p.stockQty || 0) <= (p.reorderPoint || 5));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Report</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your current inventory</p>
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
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Stock Items</p>
          <p className="text-2xl font-bold text-blue-600">{totalStock.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Inventory Value</p>
          <p className="text-2xl font-bold text-green-600">KES {totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Low Stock Items</p>
          <p className={`text-2xl font-bold ${lowStockItems.length > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {lowStockItems.length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">📦</div>
                    <p>No products found in inventory</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isLowStock = (product.stockQty || 0) <= (product.reorderPoint || 5);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.sku || '-'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.stockQty || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">KES {product.costPrice?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">KES {product.sellingPrice?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {isLowStock ? '⚠️ Low Stock' : '✅ In Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Warning */}
      {lowStockItems.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-medium text-red-800">⚠️ Low Stock Alert</h3>
          <p className="text-sm text-red-700 mt-1">
            {lowStockItems.length} product{lowStockItems.length > 1 ? 's' : ''} are below reorder level:
            {lowStockItems.map(p => p.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}