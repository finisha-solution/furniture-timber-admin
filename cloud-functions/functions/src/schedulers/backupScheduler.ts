import * as functions from 'firebase-functions'; 
import * as admin from 'firebase-admin'; 
const bucket = admin.storage().bucket(); 
export const dailyBackup = functions.pubsub.schedule('0 2 * * *').timeZone('Africa/Nairobi').onRun(async () => { 
    const date = new Date().toISOString().split('T')[0]; 
    const collections = ['products','sales','stock_transactions','production_jobs','expenditures','users','audit_logs']; 
    for (const col of collections) { 
        const snap = await admin.firestore().collection(col).get(); 
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })); 
        const file = bucket.file(`backups/${date}/${col}.json`); 
        await file.save(JSON.stringify(data, null, 2), { contentType: 'application/json' }); 
    } 
    console.log(`Backup completed for ${date}`); 
});