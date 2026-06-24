import { NextApiRequest, NextApiResponse } from 'next';
import { getAdminDb } from '../../../services/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = getAdminDb();
    const collections = ['products', 'sales', 'stock_transactions', 'expenditures', 'production_jobs', 'users', 'customers', 'timber_batches', 'audit_logs'];
    
    const backup: any = {};
    for (const col of collections) {
      const snap = await db.collection(col).get();
      backup[col] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    
    res.status(200).json({ success: true, backup, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error('Backup error:', error);
    res.status(500).json({ error: error.message || 'Backup failed' });
  }
}