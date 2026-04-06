import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";

function ProductCard({ product }){

  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  return(

    <div className="product-card">

      {/* CLICKABLE IMAGE + NAME */}
      <Link to={`/product/${product.id}`}>

        <img src={product.image} alt={product.name} />

        <h3>{product.name}</h3>

        <p>${product.price}</p>

      </Link>

      {/* ADD TO CART */}
      <button onClick={() => addToCart(product.id)}>
        Add to Cart
      </button>
      <button onClick={() => addToWishlist(product.id)}>
  ❤️
</button>

    </div>
  );
}

export default ProductCard;