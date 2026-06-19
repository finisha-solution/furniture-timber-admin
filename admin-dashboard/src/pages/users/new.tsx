import { useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../services/firebase-client';
import { collection, addDoc } from 'firebase/firestore';

export default function NewUser() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('salesperson');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'users'), { name, email, role, createdAt: new Date() });
      router.push('/users');
    } catch (err) {
      alert('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h1 className="text-2xl font-bold mb-6">Add New User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full rounded" required /></div>
        <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full rounded" required /></div>
        <div><label className="block text-sm font-medium mb-1">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="border p-2 w-full rounded">
            <option value="admin">Admin</option><option value="salesperson">Salesperson</option><option value="store_manager">Store Manager</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">Create User</button>
      </form>
    </div>
  );
}
