import { sendExpenseApprovalRequest } from '../services/emailService';
import * as functions from 'firebase-functions'; 
import * as admin from 'firebase-admin'; 
const db = admin.firestore(); 

export const onExpenditureCreated = functions.firestore.document('expenditures/{expId}').onCreate(async (snap) => { 
    const exp = snap.data(); 
    if (exp.approvalStatus !== 'approved') 
        return; 
    const monthKey = exp.expenseDate.toDate().toISOString().slice(0,7); 
    const monthRef = db.collection('analytics').doc('monthly_expenses').collection('records').doc(monthKey); 
    await monthRef.set({ 
        totalExpenses: admin.firestore.FieldValue.increment(exp.totalAmount), 
        byCategory: { [exp.category]: admin.firestore.FieldValue.increment(exp.totalAmount)} 
    }, { merge: true });
    
    // Send approval request email
    if (exp.approvalStatus === 'pending') {
    await sendExpenseApprovalRequest(exp);
    }
});