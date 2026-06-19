import * as admin from 'firebase-admin'; 
const serviceAccount = require('../cloud-functions/serviceAccountKey.json'); 
admin.initializeApp({ 
    credential: admin.credential.cert(serviceAccount) }); 
    const db = admin.firestore(); 
    async function seed() {

         
        await db.collection('products').doc('tbl1').set({ 
            name: 'Office Table', 
            sku: 'TBL001', 
            costPrice: 8000, 
            sellingPrice: 12000, 
            stockQty: 20, 
            category: 'furniture' 
         }); 
        await db.collection('products').doc('tbl2').set({ 
            name: 'Bed 6x6', 
            sku: 'BED001', 
            costPrice: 15000, 
            sellingPrice: 25000, 
            stockQty: 8, 
            category: 'furniture' }); 
        await db.collection('products').doc('tim1').set({

            name: 'Cypress 12ft', 
            sku: 'TIM001', 
            costPrice: 1200, 
            sellingPrice: 1800, 
            stockQty: 100, 
            category: 'timber' }); 
        await db.collection('users').doc('admin').set({ name: 'Admin User', email: 'admin@tbms-project.com', role: 'admin', createdAt: new Date() }); console.log('Seeded 3 products and admin user'); process.exit(0); } seed();