import * as admin from 'firebase-admin'; 
import * as fs from 'fs'; 
import * as path from 'path'; 
const serviceAccount = require('../cloud-functions/serviceAccountKey.json'); 
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) }); 
const db = admin.firestore(); 
const backupDir = process.argv[2]; 
if (!backupDir) { console.error('Usage: node restore-database.ts <backup-folder>'); 
    process.exit(1); 
} 
const files = fs.readdirSync(backupDir); 
for (const file of files) { 
    if (!file.endsWith('.json')) continue; 
    const colName = file.replace('.json', ''); 
    const data = JSON.parse(fs.readFileSync(path.join(backupDir, file), 'utf8')); 
    
for (const doc of data) { await db.collection(colName).doc(doc.id).set(doc); } }

console.log('Restore complete'); 
process.exit(0);