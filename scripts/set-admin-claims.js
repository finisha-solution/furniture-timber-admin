const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Try to load service account from multiple locations
let serviceAccount;
try {
  // Try cloud-functions location
  serviceAccount = require('../cloud-functions/serviceAccountKey.json');
} catch (e) {
  try {
    // Try admin-dashboard location
    serviceAccount = require('../admin-dashboard/serviceAccountKey.json');
  } catch (e2) {
    console.error('❌ Service account key not found.');
    console.log('   Please download from Firebase Console → Project Settings → Service Accounts');
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id || 'tbms-project'
});

console.log('🔑 Setting admin claims...\n');

async function setAdminClaims() {
  const email = 'admin@tbms-project.com';
  
  try {
    // Check if user exists
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        console.log(`❌ User "${email}" not found.`);
        console.log('   Please create this user in Firebase Console first.');
        console.log('   Go to Authentication → Users → Add user');
        process.exit(0);
      }
      throw err;
    }
    
    // Set admin claims
    await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
    
    console.log(`✅ Admin claims set for ${email}`);
    console.log(`   UID: ${user.uid}`);
    console.log(`   Role: admin`);
    console.log('\nℹ️  User will need to log out and log in again for claims to take effect.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

setAdminClaims();