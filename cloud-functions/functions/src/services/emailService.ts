import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

// For production, use a service like SendGrid, Resend, or Nodemailer
// This is a placeholder that logs emails (works in development)
export async function sendEmail(to: string, subject: string, html: string) {
  console.log(`📧 Sending email to: ${to}`);
  console.log(`📧 Subject: ${subject}`);
  console.log(`📧 HTML: ${html}`);
  
  // In production, uncomment and configure your email provider:
  // const sendgridApiKey = functions.config().sendgrid?.key;
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(sendgridApiKey);
  // await sgMail.send({ to, from: 'noreply@furnituretimber.com', subject, html });
}

export async function sendLowStockAlert(productName: string, productId: string, currentStock: number) {
  const admins = await db.collection('users').where('role', '==', 'admin').get();
  const adminEmails = admins.docs.map(doc => doc.data().email).filter(Boolean);
  
  const subject = `⚠️ Low Stock Alert: ${productName}`;
  const html = `
    <h2>Low Stock Alert</h2>
    <p><strong>Product:</strong> ${productName}</p>
    <p><strong>Current Stock:</strong> ${currentStock}</p>
    <p><strong>Reorder Point:</strong> ${10}</p>
    <p>Please restock immediately.</p>
    <a href="https://furnituretimber.com/inventory/products/edit/${productId}">View Product</a>
  `;
  
  for (const email of adminEmails) {
    await sendEmail(email, subject, html);
  }
}

export async function sendExpenseApprovalRequest(expenseData: any) {
  const admins = await db.collection('users').where('role', '==', 'admin').get();
  const adminEmails = admins.docs.map(doc => doc.data().email).filter(Boolean);
  
  const subject = `💰 Expense Approval Request: ${expenseData.category}`;
  const html = `
    <h2>New Expense Needs Approval</h2>
    <p><strong>Category:</strong> ${expenseData.category}</p>
    <p><strong>Description:</strong> ${expenseData.description}</p>
    <p><strong>Amount:</strong> KES ${expenseData.totalAmount?.toLocaleString()}</p>
    <p><strong>Payee:</strong> ${expenseData.payeeName}</p>
    <a href="https://furnituretimber.com/finance/expenditures">Review Expenses</a>
  `;
  
  for (const email of adminEmails) {
    await sendEmail(email, subject, html);
  }
}