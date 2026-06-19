import { createSlice } from '@reduxjs/toolkit';
const initialState = { items: [] };
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => { state.items.push(action.payload); },
    updateCartItem: (state, action) => { const idx = state.items.findIndex(i => i.productId === action.payload.productId); if (idx !== -1) state.items[idx].quantity = action.payload.quantity; },
    removeFromCart: (state, action) => { state.items = state.items.filter(i => i.productId !== action.payload); },
    clearCart: (state) => { state.items = []; }
  }
});
export const { addToCart, updateCartItem, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;