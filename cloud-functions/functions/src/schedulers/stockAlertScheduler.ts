import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendLowStockAlert } from '../services/emailService';

const db = admin.firestore();

export const checkLowStock = functions.pubsub
  .schedule('0 8 * * *') // Every day at 8:00 AM
  .timeZone('Africa/Nairobi')
  .onRun(async () => {
    console.log('🔄 Checking low stock...');
    
    const products = await db.collection('products').get();
    const lowStockItems: any[] = [];
    
    products.forEach(doc => {
      const data = doc.data();
      const reorderPoint = data.reorderPoint || 10;
      if (data.stockQty <= reorderPoint) {
        lowStockItems.push({ id: doc.id, ...data });
      }
    });
    
    console.log(`📦 Found ${lowStockItems.length} low stock items`);
    
    for (const item of lowStockItems) {
      await sendLowStockAlert(item.name, item.id, item.stockQty);
    }
    
    return null;
  });