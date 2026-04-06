import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { products } from "../data/products";
import "./Wishlist.css"

/* =========================================
WISHLIST PAGE
========================================= */

function Wishlist(){

  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  /* FILTER PRODUCTS FROM IDS */
  const wishlistItems = products.filter(p => wishlist.includes(p.id));

  return(

    <div className="wishlist-page">

      <h1>wishlist</h1>

      <div className="wishlist-grid">

        {wishlistItems.map(product => (

          <div key={product.id} className="wishlist-card">

            <img src={product.image} />

            <h3>{product.name}</h3>

            <p>
              ${product.price}
              {" "}
              <del>${product.originalPrice}</del>
            </p>

            <button
              onClick={() => removeFromWishlist(product.id)}
            >
              Remove From wishlist
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Wishlist;