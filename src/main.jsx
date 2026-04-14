import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // Tailwind globally
import App from './App.jsx'
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProductProvider } from "./context/ProductContext"; // NEW API CONTEXT


import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ProductProvider>
      <WishlistProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </WishlistProvider>
    </ProductProvider>
  </AuthProvider>
)