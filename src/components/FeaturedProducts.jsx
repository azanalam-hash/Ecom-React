import { products } from "../data/products";
import "./FeaturedProducts.css";
import ProductCard from "./ProductCard"; // ✅ IMPORT COMPONENT

/* =========================================
FEATURED PRODUCTS COMPONENT
========================================= */

function FeaturedProducts(){

  return(

    <section className="featured-products">

      <h2>Featured Backpacks</h2>

      <div className="products-grid">

        {/* -----------------------------------------
        REUSE ProductCard COMPONENT
        ----------------------------------------- */}
        {products.slice(0, 8).map(product => (

          <ProductCard
            key={product.id}
            product={product}
          />

        ))}

      </div>

    </section>
  );
}

export default FeaturedProducts;