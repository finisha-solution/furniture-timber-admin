import * as functions from 'firebase-functions'; 
import * as admin from 'firebase-admin'; 
export const onStockReceive = functions.firestore.document('stock_transactions/{txnId}').onCreate(async (snap) => { const tx = snap.data(); 
    if (tx.type === 'receive') { 
        const prodRef = admin.firestore().collection('products').doc(tx.productId); 
        await prodRef.update({ 
            stockQty: admin.firestore.FieldValue.increment(tx.quantity) }); 
        } 
    });