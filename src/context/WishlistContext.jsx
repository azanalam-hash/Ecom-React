import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

/* =========================================
CREATE CONTEXT
========================================= */
export const WishlistContext = createContext();

/* =========================================
PROVIDER
========================================= */
export function WishlistProvider({ children }){

  const { user } = useContext(AuthContext);
  const wishlistKey = user ? `wishlist_${user._id}` : "wishlist_guest";

  const [wishlist, setWishlist] = useState([]);
  const [loadedKey, setLoadedKey] = useState(null);

  /* -----------------------------------------
  LOAD FROM LOCAL STORAGE
  ----------------------------------------- */
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];
    setWishlist(storedWishlist);
    setLoadedKey(wishlistKey); // Track successful load
  }, [wishlistKey]);

  /* -----------------------------------------
  SAVE TO LOCAL STORAGE
  ----------------------------------------- */
  useEffect(() => {
    // Only save if the state matches the active user key!
    if (loadedKey === wishlistKey) {
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    }
  }, [wishlist, loadedKey, wishlistKey]);

  /* -----------------------------------------
  ADD TO WISHLIST
  ----------------------------------------- */
  function addToWishlist(id){

    setWishlist(prev => {

      if(prev.includes(id)) return prev; // avoid duplicate

      return [...prev, id];

    });

  }

  /* -----------------------------------------
  REMOVE FROM WISHLIST
  ----------------------------------------- */
  function removeFromWishlist(id){

    setWishlist(prev => prev.filter(item => item !== id));

  }

  return(
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}