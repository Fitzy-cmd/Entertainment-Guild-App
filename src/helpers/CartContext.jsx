import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage or initialize with an empty array
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Update localStorage whenever the cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (productID, quantity, source) => {
        setCart((prevCart) => {
            // Check if an item with the same productID and source already exists
            const existingProduct = prevCart.find(
                (item) => item.productID === productID && item.source === source
            );
    
            if (existingProduct) {
                // If it exists, update the quantity
                return prevCart.map((item) =>
                    item.productID === productID && item.source === source
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // If it doesn't exist, add a new product entry
                return [...prevCart, { productID, quantity, source }];
            }
        });
    };

    const removeFromCart = (productID, source) => {
        // Filter out the product based on both productID and source
        setCart((prevCart) =>
            prevCart.filter((item) => !(item.productID === productID && item.source === source))
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCart = () => {
        return cart;
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, clearCart, removeFromCart, getCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
