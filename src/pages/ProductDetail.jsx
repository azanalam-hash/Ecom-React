import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
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

  /* Cart & DB */
  const { addToCart } = useContext(CartContext);
  const { getProductById, loading, error, products } = useContext(ProductContext);

  /* Find product */
  const product = getProductById(id);

  /* -----------------------------------------
  STATE
  ----------------------------------------- */
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Initialize state when product is found
  useEffect(() => {
    if (product) {
      setMainImage(product.image);
      setSelectedVariant(product.variants?.[0] || null);
    }
  }, [product]);

  /* If fetching */
  if (loading) return <h2 style={{textAlign:"center", padding: "40px"}}>Loading...</h2>;
  if (error) return <h2 style={{textAlign:"center", padding: "40px", color: "red"}}>Error: {error}</h2>;

  /* If product not found */
  if(!product){
    return <h2 style={{textAlign:"center", padding: "40px"}}>Product not found</h2>;
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
            src={mainImage || "https://via.placeholder.com/400"}
          />

          {/* THUMBNAILS (Defensive check for older mock vs new DB) */}
          {product.images && product.images.length > 0 && (
            <div className="thumbnails">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}

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
          COLORS (VARIANTS) - Display only if exists
          ============================= */}
          {product.variants && product.variants.length > 0 && (
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
          )}


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
            .filter(p => p.category === product.category && (p._id !== product._id && p.id !== product.id))
            .slice(0,4)
            .map(item => (

              <div key={item._id || item.id} className="product-card">

                <img src={item.image || "https://via.placeholder.com/200"} />
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