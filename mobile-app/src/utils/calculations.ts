export const calculateProfit = (sellingPrice: number, costPrice: number, quantity: number): number => {
  return (sellingPrice - costPrice) * quantity;
};

export const applyDiscount = (amount: number, discount: number, isPercentage: boolean): number => {
  if (isPercentage) return amount - (amount * discount / 100);
  return amount - discount;
};

export const calculateSubtotal = (items: Array<{ quantity: number; unitPrice: number }>): number => {
  return items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);
};