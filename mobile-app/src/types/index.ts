export interface User { uid: string; name: string; email: string; role: 'admin'|'salesperson'|'store_manager'; }
export interface Product { id: string; name: string; costPrice: number; sellingPrice: number; stockQty: number; }
export interface SaleItem { productId: string; productName: string; quantity: number; unitPrice: number; totalPrice: number; costPrice: number; }
export interface Sale { id?: string; customerName: string; items: SaleItem[]; subtotal: number; discountAmount: number; finalAmount: number; paymentMethod: string; profit?: number; createdAt: Date; }
export interface Expenditure { id?: string; category: string; description: string; totalAmount: number; approvalStatus: string; }
export const ExpenditureCategory = { DELIVERY: 'delivery', LABOUR: 'labour', SECURITY: 'security', LEGAL: 'legal_fees', ELECTRICITY: 'electricity' };