import * as functions from 'firebase-functions'; 
import * as admin from 'firebase-admin'; 
const db = admin.firestore(); 
export const onProductionJobCreated = functions.firestore.document('production_jobs/{jobId}').onCreate(async (snap, ctx) => { 
    const job = snap.data(); 
    const batch = db.batch(); 
    for (const mat of job.materials) { const matRef = db.collection('products').doc(mat.materialId); 
        const matDoc = await matRef.get(); 
        const current = matDoc.data()?.stockQty || 0; 
        const newStock = current - mat.quantityRequired; 
        
        if (newStock < 0) throw new Error('Insufficient material'); 
        batch.update(matRef, { stockQty: newStock }); 
        batch.set(db.collection('stock_transactions').doc(), { 
            productId: mat.materialId, 
            type: 'issue_to_workshop', 
            quantity: -mat.quantityRequired, 
            referenceId: ctx.params.jobId }); 
        } batch.update(snap.ref, { 
                status: 'in_progress', 
                startDate: admin.firestore.FieldValue.serverTimestamp() 
            }); await batch.commit(); 
        }); 
        
        export const onProductionJobCompleted = functions.firestore.document('production_jobs/{jobId}').onUpdate(async (change) => { 
            const before = change.before.data(); 
            const after = change.after.data(); 
            
            if (before.status !== 'completed' && after.status === 'completed') 
                { const prodRef = admin.firestore().collection('products').doc(after.finishedProductId); 
                    await prodRef.update({ stockQty: admin.firestore.FieldValue.increment(after.quantityProduced) }); 
                } 
            });