import * as functions from 'firebase-functions'; 
import * as admin from 'firebase-admin'; 
const db = admin.firestore(); 
export const auditSaleCreation = functions.firestore.document('sales/{saleId}').onCreate(async (snap, ctx) => { 
    const sale = snap.data(); 
    await db.collection('audit_logs').add({ action: 'SALE_CREATED', referenceId: ctx.params.saleId, userId: sale.salespersonId, userName: sale.salespersonName, details: 
        { 
            amount: sale.finalAmount, items: sale.items.length }, 
            createdAt: admin.firestore.FieldValue.serverTimestamp() 
        }); 
    }); 
    
export const auditUserLogin = functions.auth.user().onSignIn(async (user) => { 
    const userDoc = await db.collection('users').doc(user.uid).get(); 
    await db.collection('audit_logs').add({ 
        action: 'LOGIN', 
        userId: user.uid, 
        userName: userDoc.data()?.name || user.email, 
        details: { email: user.email }, 
        createdAt: admin.firestore.FieldValue.serverTimestamp() 
    }); 
});