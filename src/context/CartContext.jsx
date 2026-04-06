import { createContext, useState, useEffect } from "react";

/* =========================================
CREATE GLOBAL CART CONTEXT
========================================= */
export const CartContext = createContext();

/* =========================================
PROVIDER (WRAPS APP)
========================================= */
export function CartProvider({ children }){

  /* -----------------------------------------
  CART STATE
  ----------------------------------------- */
  const [cart, setCart] = useState([]);

  /* -----------------------------------------
  LOAD CART FROM LOCAL STORAGE (on start)
  ----------------------------------------- */
  useEffect(() => {

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

  }, []);

  /* -----------------------------------------
  SAVE CART TO LOCAL STORAGE (on change)
  ----------------------------------------- */
  useEffect(() => {

    localStorage.setItem("cart", JSON.stringify(cart));

  }, [cart]);

  /* -----------------------------------------
  ADD TO CART FUNCTION
  ----------------------------------------- */
  function addToCart(id){

    setCart(prev => {

      const existing = prev.find(item => item.id === id);

      if(existing){
        return prev.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { id, quantity: 1 }];

    });

  }
  function removeFromCart(id){

  setCart(prev => {

    const existing = prev.find(item => item.id === id);

    if(existing.quantity > 1){
      return prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    }

    return prev.filter(item => item.id !== id);

  });

}

  /* -----------------------------------------
  TOTAL COUNT (for badge)
  ----------------------------------------- */
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return(

    <CartContext.Provider value={{
      cart,
      addToCart,
      cartCount
    }}>
      {children}
    </CartContext.Provider>

  );
}