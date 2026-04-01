import { products } from "../data/products";
import "./FeaturedProducts.css"
import { useContext } from "react";
import { CartContext } from "../context/CartContext";


/* =========================================
FEATURED PRODUCTS COMPONENT
========================================= */

function FeaturedProducts(){
  const { addToCart } = useContext(CartContext);

  return(

    <section className="featured-products">

      <h2>Featured Backpacks</h2>

      <div className="products-grid">

        {/* -----------------------------------------
        LOOP PRODUCTS (React replaces JS DOM)
        ----------------------------------------- */}
        {products.slice(0, 8).map(product => (

          <div key={product.id} className="product-card">

            {/* Product Image */}
            <img src={product.image} alt={product.name} />

            {/* Product Name */}
            <h3>{product.name}</h3>

            {/* Price */}
            <p>
              ${product.price}
              {" "}
              <del>${product.originalPrice}</del>
            </p>

            {/* Rating */}
            <p>⭐ {product.rating}</p>

            {/* Button */}
            <button onClick={() => addToCart(product.id)}>Add to Cart</button>

          </div>

        ))}

      </div>

    </section>
  );
}

export default FeaturedProducts;