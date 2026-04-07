import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";

function ProductCard({ product }){

  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const productId = product._id || product.id;

  return(

    <div className="product-card">

      {/* CLICKABLE IMAGE + NAME */}
      <Link to={`/product/${productId}`}>

        <img src={product.image} alt={product.name} />

        <h3>{product.name}</h3>

        <p>${product.price}</p>

      </Link>

      {/* ADD TO CART */}
      <button onClick={() => addToCart(productId)}>
        Add to Cart
      </button>
      <button onClick={() => addToWishlist(productId)}>
  ❤️
</button>

    </div>
  );
}

export default ProductCard;