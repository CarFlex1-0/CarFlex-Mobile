import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      setCart: (cartItems) => {
        const normalizedCart = Array.isArray(cartItems) ? cartItems : [cartItems];
        set({
          cart: normalizedCart.map(item => ({
            ...item,
            quantity: item.quantity || 1
          }))
        });
      },

      addToCart: (item) => set((state) => {
        const existingItemIndex = state.cart.findIndex(
          (cartItem) => cartItem._id === item._id
        );

        if (existingItemIndex > -1) {
          const updatedCart = [...state.cart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: (updatedCart[existingItemIndex].quantity || 0) + 1
          };
          return { cart: updatedCart };
        }

        return { cart: [...state.cart, { ...item, quantity: 1 }] };
      }),

      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter((item) => item._id !== itemId)
      })),

      updateQuantity: (itemId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item._id === itemId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter((item) => item.quantity > 0)
      })),

      clearCart: () => set({ cart: [] }),

      getTotalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + (item.price * (item.quantity || 1)),
          0
        );
      }
    }),
    {
      name: 'car-parts-cart-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
); 