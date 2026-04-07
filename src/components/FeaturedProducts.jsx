import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import "./FeaturedProducts.css";
import ProductCard from "./ProductCard";

/* =========================================
FEATURED PRODUCTS COMPONENT
========================================= */

function FeaturedProducts(){
  const { products, loading, error } = useContext(ProductContext);

  if(loading) return <p style={{textAlign:"center"}}>Loading...</p>;
  if(error) return <p style={{textAlign:"center", color: "red"}}>Error: {error}</p>;

  return(

    <section className="featured-products">

      <h2>Featured Products</h2>

      <div className="products-grid">

        {/* -----------------------------------------
        REUSE ProductCard COMPONENT
        ----------------------------------------- */}
        {products.slice(0, 8).map(product => (

          <ProductCard
            key={product._id || product.id}
            product={product}
          />

        ))}

      </div>

    </section>
  );
}

export default FeaturedProducts;