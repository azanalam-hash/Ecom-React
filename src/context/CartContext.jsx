import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

/* =========================================
CREATE GLOBAL CART CONTEXT
========================================= */
export const CartContext = createContext();

/* =========================================
PROVIDER (WRAPS APP)
========================================= */
export function CartProvider({ children }){

  const { user } = useContext(AuthContext);
  const cartKey = user ? `cart_${user._id}` : "cart_guest";

  /* -----------------------------------------
  CART STATE
  ----------------------------------------- */
  const [cart, setCart] = useState([]);
  const [loadedKey, setLoadedKey] = useState(null);

  /* -----------------------------------------
  LOAD CART FROM LOCAL STORAGE
  ----------------------------------------- */
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(storedCart);
    setLoadedKey(cartKey); // Track that we successfully loaded this key
  }, [cartKey]);

  /* -----------------------------------------
  SAVE CART TO LOCAL STORAGE (on change)
  ----------------------------------------- */
  useEffect(() => {
    // Only save if the cart we are holding actually belongs to the current user!
    // This fixes a famous React race condition where switching users copies the old cart over.
    if (loadedKey === cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, loadedKey, cartKey]);

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