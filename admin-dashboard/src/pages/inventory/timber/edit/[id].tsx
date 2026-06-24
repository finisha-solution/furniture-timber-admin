import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../../../services/firebase-client';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function EditTimberBatch() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    timberType: '',
    species: '',
    grade: 'Premium',
    totalPieces: '',
    availablePieces: '',
    length: '',
    width: '',
    thickness: '',
    costPerPiece: '',
    quality: 'premium',
    location: '',
  });

  useEffect(() => {
    if (!id) return;
    const fetchBatch = async () => {
      try {
        const docRef = doc(db, 'timber_batches', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({
            timberType: data.timberType || '',
            species: data.species || '',
            grade: data.grade || 'Premium',
            totalPieces: data.totalPieces?.toString() || '',
            availablePieces: data.availablePieces?.toString() || '',
            length: data.length?.toString() || '',
            width: data.width?.toString() || '',
            thickness: data.thickness?.toString() || '',
            costPerPiece: data.costPerPiece?.toString() || '',
            quality: data.quality || 'premium',
            location: data.location || '',
          });
        } else {
          alert('Batch not found');
          router.push('/inventory/timber');
        }
      } catch (error) {
        console.error('Error fetching batch:', error);
        alert('Error loading batch');
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const docRef = doc(db, 'timber_batches', id as string);
      await updateDoc(docRef, {
        timberType: form.timberType,
        species: form.species,
        grade: form.grade,
        totalPieces: parseInt(form.totalPieces),
        availablePieces: parseInt(form.availablePieces),
        length: parseFloat(form.length) || 0,
        width: parseFloat(form.width) || 0,
        thickness: parseFloat(form.thickness) || 0,
        costPerPiece: parseFloat(form.costPerPiece),
        quality: form.quality,
        location: form.location,
        updatedAt: new Date()
      });
      router.push('/inventory/timber');
    } catch (error) {
      console.error('Error updating batch:', error);
      alert('Error updating batch');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Timber Batch</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timber Type *</label>
            <input
              type="text"
              required
              value={form.timberType}
              onChange={e => setForm({...form, timberType: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Cypress"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
            <input
              type="text"
              value={form.species}
              onChange={e => setForm({...form, species: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Cupressus lusitanica"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grade *</label>
          <select
            value={form.grade}
            onChange={e => setForm({...form, grade: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Premium">Premium</option>
            <option value="Standard">Standard</option>
            <option value="Economy">Economy</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Length (ft)</label>
            <input
              type="number"
              value={form.length}
              onChange={e => setForm({...form, length: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width (inches)</label>
            <input
              type="number"
              value={form.width}
              onChange={e => setForm({...form, width: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thickness (inches)</label>
            <input
              type="number"
              value={form.thickness}
              onChange={e => setForm({...form, thickness: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Pieces *</label>
            <input
              type="number"
              required
              value={form.totalPieces}
              onChange={e => setForm({...form, totalPieces: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Pieces *</label>
            <input
              type="number"
              required
              value={form.availablePieces}
              onChange={e => setForm({...form, availablePieces: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Piece (KES) *</label>
            <input
              type="number"
              required
              value={form.costPerPiece}
              onChange={e => setForm({...form, costPerPiece: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
            <select
              value={form.quality}
              onChange={e => setForm({...form, quality: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="premium">Premium</option>
              <option value="standard">Standard</option>
              <option value="economy">Economy</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={form.location}
            onChange={e => setForm({...form, location: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Bay A"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/inventory/timber')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}