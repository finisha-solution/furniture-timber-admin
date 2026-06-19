import * as functions from 'firebase-functions'; 
import * as admin from 'firebase-admin'; 
const db = admin.firestore(); 
export const aggregateDailySales = functions.pubsub.schedule('0 0 * * *').timeZone('Africa/Nairobi').onRun(async () => { 
    const yesterday = new Date(); 
    yesterday.setDate(yesterday.getDate()-1); 
    const dateKey = yesterday.toISOString().split('T')[0]; 
    const snap = await db.collection('sales').where('createdAt', '>=', yesterday).where('status', '==', 'completed').get(); 
    let 
    total=0, 
    profit=0; 
    snap.forEach(d => { total += d.data().finalAmount; 
        profit += d.data().profit || 0; }); 
        await db.collection('reports').doc(`daily_${dateKey}`).set({ 
            date: dateKey, 
            totalSales: total, 
            totalProfit: profit, 
            generatedAt: admin.firestore.FieldValue.serverTimestamp() 
        }); 
    });