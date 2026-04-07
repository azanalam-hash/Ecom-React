import React, { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error("Failed to fetch products from backend");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Utility to find product by id
  const getProductById = (id) => {
    // Note: MongoDB uses _id, not id
    return products.find(p => p._id === id || p.id == id);
  };

  return (
    <ProductContext.Provider value={{ products, loading, error, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
}
