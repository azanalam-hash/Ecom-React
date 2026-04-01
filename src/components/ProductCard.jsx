import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }){

  const { addToCart } = useContext(CartContext);

  return(

    <div className="product-card">

      <img src={product.image} />

      <h3>{product.name}</h3>

      <p>${product.price}</p>

      {/* 🔥 React way */}
      <button onClick={() => addToCart(product.id)}>
        Add to Cart
      </button>

    </div>

  );
}