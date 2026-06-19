import { z } from 'zod';

export const SaleItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  finalUnitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  costPrice: z.number().positive()
});

export const SaleSchema = z.object({
  customerName: z.string().min(1, 'Customer name required'),
  items: z.array(SaleItemSchema).min(1, 'At least one item'),
  finalAmount: z.number().positive(),
  paymentMethod: z.enum(['cash', 'mpesa', 'bank_transfer'])
});

export const ExpenditureSchema = z.object({
  category: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().optional(),
  payeeName: z.string().min(1)
});