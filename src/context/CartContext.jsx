import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load cart data from localStorage only
  const loadCart = () => {
    setLoading(true);
    
    try {
      // Get cart from localStorage
      const carritoLocal = localStorage.getItem('carrito');
      if (carritoLocal) {
        const items = JSON.parse(carritoLocal);
        setCartItems(items);
        
        // Calculate total items
        const itemCount = items.reduce((total, item) => total + item.cantidad, 0);
        setCartItemCount(itemCount);
      } else {
        setCartItems([]);
        setCartItemCount(0);
        localStorage.setItem('carrito', JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
      setCartItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart (localStorage only)
  // In your CartContext.jsx file, make sure the addToCart function updates the cartItemCount immediately
  
  const addToCart = (producto) => {
    try {
      // Get current cart
      const carritoLocal = localStorage.getItem('carrito');
      let items = carritoLocal ? JSON.parse(carritoLocal) : [];
      
      // Check if product already exists
      const existingItemIndex = items.findIndex(item => 
        item.id === producto.id && item.tipo === producto.tipo
      );
      
      if (existingItemIndex >= 0) {
        // If exists, increment quantity
        items[existingItemIndex].cantidad += 1;
      } else {
        // If not, add as new
        items.push({ ...producto, cantidad: 1 });
      }
      
      // Save to localStorage
      localStorage.setItem('carrito', JSON.stringify(items));
      
      // Update state immediately
      setCartItems(items);
      
      // Calculate and update the count immediately
      const itemCount = items.reduce((total, item) => total + item.cantidad, 0);
      setCartItemCount(itemCount);
      
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  // Update cart item quantity (localStorage only)
  const updateCartItemQuantity = (productoId, tipo, cantidad) => {
    try {
      // Get current cart
      const carritoLocal = localStorage.getItem('carrito');
      if (!carritoLocal) return false;
      
      let items = JSON.parse(carritoLocal);
      
      if (cantidad <= 0) {
        // Remove item if quantity is 0 or less
        items = items.filter(item => !(item.id === productoId && item.tipo === tipo));
      } else {
        // Update quantity
        const itemIndex = items.findIndex(item => item.id === productoId && item.tipo === tipo);
        if (itemIndex !== -1) {
          items[itemIndex].cantidad = cantidad;
        }
      }
      
      // Save to localStorage
      localStorage.setItem('carrito', JSON.stringify(items));
      
      // Update state
      setCartItems(items);
      const itemCount = items.reduce((total, item) => total + item.cantidad, 0);
      setCartItemCount(itemCount);
      
      return true; // Simulate successful operation
    } catch (error) {
      console.error("Error updating cart:", error);
      return false;
    }
  };

  // Remove item from cart (localStorage only)
  const removeFromCart = (productoId, tipo) => {
    try {
      // Get current cart
      const carritoLocal = localStorage.getItem('carrito');
      if (!carritoLocal) return false;
      
      let items = JSON.parse(carritoLocal);
      
      // Filter out the item to remove
      items = items.filter(item => !(item.id === productoId && item.tipo === tipo));
      
      // Save to localStorage
      localStorage.setItem('carrito', JSON.stringify(items));
      
      // Update state
      setCartItems(items);
      const itemCount = items.reduce((total, item) => total + item.cantidad, 0);
      setCartItemCount(itemCount);
      
      return true; // Simulate successful operation
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  };

  // Clear cart (localStorage only)
  const clearCart = () => {
    try {
      // Clear localStorage cart
      localStorage.setItem('carrito', JSON.stringify([]));
      
      // Update state
      setCartItems([]);
      setCartItemCount(0);
      
      return true; // Simulate successful operation
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  };

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, []);

  // Value to be provided by the context
  const value = {
    cartItems,
    cartItemCount,
    loading,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};