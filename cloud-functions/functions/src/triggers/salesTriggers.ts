import * as functions from 'firebase-functions'; 
import * as admin from 'firebase-admin'; 
const db = admin.firestore(); 
export const onSaleCreated = functions.firestore.document('sales/{saleId}').onCreate(async (snap) => { 
    const sale = snap.data(); 
    const batch = db.batch(); 
    let totalProfit = 0; 
    for (const item of sale.items) { const prodRef = db.collection('products').doc(item.productId); 
        const prod = (await prodRef.get()).data(); 
        if (prod.stockQty < item.quantity) throw new Error('Insufficient stock'); 
        batch.update(prodRef, { stockQty: prod.stockQty - item.quantity }); 
        const profit = (item.finalUnitPrice - prod.costPrice) * item.quantity; 
        totalProfit += profit; 
        batch.set(db.collection('stock_transactions').doc(), {
            productId: item.productId, 
            type: 'sale', 
            quantity: -item.quantity, 
            createdAt: admin.firestore.FieldValue.serverTimestamp(), saleId: snap.id }); 
        } 
        batch.update(snap.ref, { profit: totalProfit }); 
        await batch.commit(); 
        const dateKey = new Date().toISOString().split('T')[0]; 
        const analyticsRef = db.collection('analytics').doc('daily_sales').collection('records').doc(dateKey); 
        await analyticsRef.set({ 
            totalSales: admin.firestore.FieldValue.increment(sale.finalAmount), 
            totalProfit: admin.firestore.FieldValue.increment(totalProfit), 
            transactionCount: admin.firestore.FieldValue.increment(1) }, 
            { merge: true }); 
        });