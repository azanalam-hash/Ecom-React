import { createContext, useState, useEffect } from "react";

/* =========================================
CREATE CONTEXT
========================================= */
export const WishlistContext = createContext();

/* =========================================
PROVIDER
========================================= */
export function WishlistProvider({ children }){

  /* -----------------------------------------
  LOAD FROM LOCAL STORAGE
  ----------------------------------------- */
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  });

  /* -----------------------------------------
  SAVE TO LOCAL STORAGE
  ----------------------------------------- */
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

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