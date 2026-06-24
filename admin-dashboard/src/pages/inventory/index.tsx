import { useEffect, useState, useCallback } from 'react';
import { db } from '../../services/firebase-client';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  sku: string;
  costPrice: number;
  sellingPrice: number;
  stockQty: number;
  reorderPoint?: number;
  category?: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const q = query(collection(db, 'products'), orderBy('name'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (product: Product) => {
    const reorderPoint = product.reorderPoint || 5;
    if (product.stockQty <= 0) return 'out-of-stock';
    if (product.stockQty <= reorderPoint) return 'low';
    return 'in-stock';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStockLabel = (status: string) => {
    switch (status) {
      case 'out-of-stock': return 'Out of Stock';
      case 'low': return 'Low Stock';
      default: return 'In Stock';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700">{error}</p>
        <button onClick={fetchProducts} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <Link 
          href="/inventory/products/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 whitespace-nowrap"
        >
          <span className="text-lg">+</span> Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">📦</div>
                    <p>{searchTerm ? 'No products match your search' : 'No products found'}</p>
                    {!searchTerm && (
                      <Link href="/inventory/products/new" className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
                        Add your first product →
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.sku || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">KES {product.costPrice?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">KES {product.sellingPrice?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.stockQty}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockColor(stockStatus)}`}>
                          {getStockLabel(stockStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/inventory/products/edit/${product.id}`} 
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          <p className="text-sm text-gray-500">Total Products</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {products.filter(p => (p.stockQty || 0) <= (p.reorderPoint || 5)).length}
          </p>
          <p className="text-sm text-gray-500">Low Stock Items</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {products.filter(p => (p.stockQty || 0) <= 0).length}
          </p>
          <p className="text-sm text-gray-500">Out of Stock</p>
        </div>
      </div>
    </div>
  );
}