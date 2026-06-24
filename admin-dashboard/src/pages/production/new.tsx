import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../services/firebase-client';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function NewProductionJob() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    finishedProductId: '',
    quantityToProduce: '',
    materials: [{ materialId: '', materialName: '', quantityRequired: '' }]
  });

  useEffect(() => {
    // Load products for dropdown
    getDocs(collection(db, 'products')).then(snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const addMaterialField = () => {
    setForm({
      ...form,
      materials: [...form.materials, { materialId: '', materialName: '', quantityRequired: '' }]
    });
  };

  const removeMaterialField = (index: number) => {
    const newMaterials = form.materials.filter((_, i) => i !== index);
    setForm({ ...form, materials: newMaterials });
  };

  const updateMaterial = (index: number, field: string, value: string) => {
    const newMaterials = [...form.materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    // Auto-fill material name if product selected
    if (field === 'materialId') {
      const product = products.find(p => p.id === value);
      newMaterials[index].materialName = product?.name || '';
    }
    setForm({ ...form, materials: newMaterials });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedProduct = products.find(p => p.id === form.finishedProductId);
      const jobData = {
        finishedProductId: form.finishedProductId,
        finishedProductName: selectedProduct?.name || '',
        quantityToProduce: parseInt(form.quantityToProduce),
        quantityProduced: 0,
        status: 'pending',
        materials: form.materials.map(m => ({
          materialId: m.materialId,
          materialName: m.materialName,
          quantityRequired: parseInt(m.quantityRequired) || 0,
          quantityIssued: 0
        })),
        createdAt: new Date()
      };
      await addDoc(collection(db, 'production_jobs'), jobData);
      router.push('/production');
    } catch (error) {
      alert('Error creating production job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Production Job</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product to Produce *</label>
          <select
            required
            value={form.finishedProductId}
            onChange={e => setForm({...form, finishedProductId: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select product...</option>
            {products.filter(p => p.category === 'furniture').map(p => (
              <option key={p.id} value={p.id}>{p.name} (Stock: {p.stockQty})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Produce *</label>
          <input
            type="number"
            required
            value={form.quantityToProduce}
            onChange={e => setForm({...form, quantityToProduce: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Required Materials</label>
            <button type="button" onClick={addMaterialField} className="text-sm text-blue-600 hover:text-blue-800">
              + Add Material
            </button>
          </div>
          {form.materials.map((material, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <select
                value={material.materialId}
                onChange={e => updateMaterial(index, 'materialId', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select material...</option>
                {products.filter(p => p.category !== 'furniture').map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Stock: {p.stockQty})</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Qty"
                value={material.quantityRequired}
                onChange={e => updateMaterial(index, 'quantityRequired', e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {form.materials.length > 1 && (
                <button type="button" onClick={() => removeMaterialField(index)} className="text-red-600 hover:text-red-800">
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/production')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}