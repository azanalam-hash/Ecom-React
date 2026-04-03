import { useParams } from "react-router-dom";
import { useState, useContext } from "react";
import { products } from "../data/products";
import { CartContext } from "../context/CartContext";
import "./ProductDetail.css";

/* =========================================
PRODUCT DETAIL PAGE
========================================= */

function ProductDetail(){

  /* -----------------------------------------
  GET PRODUCT ID FROM URL
  ----------------------------------------- */
  const { id } = useParams();

  /* Convert string → number */
  const productId = parseInt(id);

  /* Find product */
  const product = products.find(p => p.id === productId);

  /* Cart */
  const { addToCart } = useContext(CartContext);

  /* -----------------------------------------
  STATE
  ----------------------------------------- */
  const [mainImage, setMainImage] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0]
  );

  /* If product not found */
  if(!product){
    return <h2>Product not found</h2>;
  }

  return(

    <div className="product-detail">

      {/* =============================
      TOP SECTION
      ============================= */}
      <div className="product-top">

        {/* LEFT: IMAGES */}
        <div className="product-images">

          {/* MAIN IMAGE */}
          <img
            className="main-image"
            src={mainImage}
          />

          {/* THUMBNAILS */}
          <div className="thumbnails">

            {product.images.map((img, i) => (

              <img
                key={i}
                src={img}
                onClick={() => setMainImage(img)}
              />

            ))}

          </div>

        </div>


        {/* RIGHT: INFO */}
        <div className="product-info">

          <h2>{product.name}</h2>

          <p className="rating">
            ⭐ {product.rating} ({product.reviewCount} reviews)
          </p>

          {/* PRICE */}
          <h3>
            ${selectedVariant?.price || product.price}
            {" "}
            <del>${product.originalPrice}</del>
          </h3>

          {/* DESCRIPTION */}
          <p>{product.description}</p>


          {/* =============================
          COLORS (VARIANTS)
          ============================= */}
          <div className="colors">

            {product.variants.map((v, i) => (

              <button
                key={i}
                onClick={()=>{
                  setSelectedVariant(v);
                  setMainImage(v.image);
                }}
              >
                {v.color}
              </button>

            ))}

          </div>


          {/* =============================
          QUANTITY
          ============================= */}
          <div className="quantity">

            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >-</button>

            <span>{quantity}</span>

            <button
              onClick={() => setQuantity(q => q + 1)}
            >+</button>

          </div>


          {/* =============================
          ADD TO CART
          ============================= */}
          <button
            className="add-to-cart"
            onClick={() => addToCart(product.id)}
          >
            Add to Cart
          </button>

        </div>

      </div>


      {/* =============================
      RELATED PRODUCTS
      ============================= */}
      <div className="related">

        <h2>Related Products</h2>

        <div className="products-grid">

          {products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0,4)
            .map(item => (

              <div key={item.id} className="product-card">

                <img src={item.image} />
                <h4>{item.name}</h4>
                <p>${item.price}</p>

              </div>

            ))}

        </div>

      </div>

    </div>
  );
}

export default ProductDetail;