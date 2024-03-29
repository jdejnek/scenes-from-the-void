import { createContext, useState, useEffect } from "react";

// Add to cart. Receives current cart items and the product to add
const addCartItem = (cartItems, productToAdd) => {

    //Check if the item is already in the cart
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem.id === productToAdd.id);

    //If the item is in the cart, increment qty by 1. Else, return a new cart item
    if (existingCartItem) {
        // Map over the cart items
        return cartItems.map((cartItem) =>
            // Find the matching product
            cartItem.id === productToAdd.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
        );
    }
    // Return a new array that contains the previous cart items plus the new product with qty of 1
    return [...cartItems, { ...productToAdd, quantity: 1 }]
};

// Remove from cart

const removeCartItem = (cartItems, cartItemToRemove) => {

    // Check if the item is already in the cart
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem.id === cartItemToRemove.id);
    
    // If there is only one, remove the item
    if (existingCartItem.quantity === 1) {
        return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id);
    }
    // Otherwise, remove 1 qty
    return cartItems.map((cartItem) =>
        cartItem.id === cartItemToRemove.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
    );

};

// Clear item from cart
const clearCartItem = (cartItems, cartItemToClear) => {
    return cartItems.filter(cartItem => cartItem.id !== cartItemToClear.id);
}

// Save cart to local storage

const localStorageCart = JSON.parse(window.localStorage.getItem('SHOPPING_CART'))

const cartFromLocalStorage = () => {
    if (localStorageCart) {
        return localStorageCart
    } else {
        return [];
    }
}

// Cart context

export const CartContext = createContext({
    // Default values
    isCartOpen: false,
    setIsCartOpen: () => { },
    cartItems: [],
    addItemToCart: () => { },
    removeItemFromCart: () => { },
    clearItemFromCart: () => {},
    cartCount: 0,
    cartTotal: 0
});

export const CartProvider = ({ children }) => {

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState(cartFromLocalStorage);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    // Calculate cart count. Triggers when cartItems array is modified.
    useEffect(() => {
        const newCartCount = cartItems.reduce((total, cartItem) =>
            total + cartItem.quantity, 0) 
        setCartCount(newCartCount); 
    }, [cartItems])

    // Calculate cart total. Triggers when cartItems array is modified.
    useEffect(() => {
        const newCartTotal = cartItems.reduce((total, cartItem) =>
            total + cartItem.quantity * cartItem.price, 0);
        setCartTotal(newCartTotal);
    
    }, [cartItems])

    // Saving to local storage
    useEffect(() => {
        window.localStorage.setItem('SHOPPING_CART', JSON.stringify(cartItems))
    }, [cartItems])

    const addItemToCart = (productToAdd) => {
        setCartItems(addCartItem(cartItems, productToAdd))
    }

    const removeItemFromCart = (cartItemToRemove) => {
        setCartItems(removeCartItem(cartItems, cartItemToRemove))
    }

    const clearItemFromCart = (cartItemToClear) => {
        setCartItems(clearCartItem(cartItems, cartItemToClear))
    }

    const value = { isCartOpen, setIsCartOpen, addItemToCart, cartItems, cartCount, removeItemFromCart, clearItemFromCart, cartTotal };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    )
}