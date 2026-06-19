import { useDispatch, useSelector } from 'react-redux'; 
import { addToCart, removeFromCart, clearCart, updateCartItem } from '../store/slices/cartSlice'; 
import { syncManager } from '../services/sync/SyncManager'; 
import { db } from '../services/firebase/config'; 
import { collection, addDoc } from 'firebase/firestore'; 

export const useCart = () => { 
    const dispatch = useDispatch(); 
    const items = useSelector(state => state.cart.items); 
    const user = useSelector(state => state.auth.user); 
    const addItem = (p) => dispatch(addToCart(p)); 
    const updateQuantity = (id, qty) => dispatch(updateCartItem({ productId: id, quantity: qty })); const removeItem = (id) => dispatch(removeFromCart(id)); 
    const clear = () => dispatch(clearCart()); 
    const checkout = async (customerName, paymentMethod, discount = 0) => { 
        const subtotal = items.reduce((s,i)=>s+i.totalPrice,0); 
        const saleData = { 
            customerName, 
            salespersonId: user?.uid, 
            items, 
            subtotal, 
            discountAmount: discount, 
            finalAmount: subtotal - discount, 
            paymentMethod, 
            createdAt: new Date(), 
            createdOffline: !syncManager.isOnline() 
        }; 
        
        if (!syncManager.isOnline()) 
            await syncManager.add('sales', saleData); 
        else 
            await addDoc(collection(db, 'sales'), saleData); 
        clear(); 
    }; 
    return { 
        items, 
        addItem, 
        updateQuantity, 
        removeItem, 
        clear, 
        checkout, 
        subtotal: items.reduce((s,i)=>s+i.totalPrice,0) 
    }; 
};