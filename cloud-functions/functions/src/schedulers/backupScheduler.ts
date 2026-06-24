import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const bucket = admin.storage().bucket();

export const dailyBackup = functions.pubsub
  .schedule('0 2 * * *') // Daily at 2:00 AM
  .timeZone('Africa/Nairobi')
  .onRun(async () => {
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();
    
    console.log(`🔄 Starting daily backup for ${date}`);
    
    const collections = ['products', 'sales', 'stock_transactions', 'production_jobs', 'expenditures', 'users', 'customers', 'timber_batches', 'audit_logs'];
    
    const backupData: any = {
      backupDate: date,
      timestamp: timestamp,
      collections: {}
    };
    
    for (const col of collections) {
      try {
        const snap = await admin.firestore().collection(col).get();
        backupData.collections[col] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log(`  ✅ Backed up ${col}: ${snap.docs.length} documents`);
      } catch (error) {
        console.error(`  ❌ Failed to backup ${col}:`, error);
      }
    }
    
    // Save to Cloud Storage
    const file = bucket.file(`backups/${date}/${timestamp}.json`);
    await file.save(JSON.stringify(backupData, null, 2), {
      contentType: 'application/json',
      metadata: {
        backupDate: date,
        timestamp: timestamp,
        collectionCount: collections.length,
      },
    });
    
    console.log(`✅ Backup completed: backups/${date}/${timestamp}.json`);
    
    // Clean old backups (keep last 30 days)
    const [files] = await bucket.getFiles({ prefix: `backups/` });
    const oldFiles = files.filter(f => {
      const fileDate = f.name.split('/')[1];
      const daysOld = Math.floor((Date.now() - new Date(fileDate).getTime()) / (1000 * 60 * 60 * 24));
      return daysOld > 30;
    });
    
    for (const file of oldFiles) {
      await file.delete();
      console.log(`🗑️ Deleted old backup: ${file.name}`);
    }
    
    return null;
  });