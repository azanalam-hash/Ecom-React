import { useState, useContext } from "react";
import { products } from "../data/products";
import { CartContext } from "../context/CartContext";
import "./Shop.css";

/* =========================================
SHOP PAGE COMPONENT
========================================= */

function Shop(){

  /* -----------------------------------------
  GLOBAL CART FUNCTION
  ----------------------------------------- */
  const { addToCart } = useContext(CartContext);

  /* -----------------------------------------
  STATE (REPLACES ALL OLD JS)
  ----------------------------------------- */

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(8); // Load more

  /* -----------------------------------------
  HANDLE CATEGORY FILTER
  ----------------------------------------- */
  function handleCategoryChange(e){

    const value = e.target.value;

    setSelectedCategories(prev =>

      prev.includes(value)
        ? prev.filter(c => c !== value) // remove
        : [...prev, value] // add

    );
  }

  /* -----------------------------------------
  FILTER PRODUCTS
  ----------------------------------------- */
  let filteredProducts = products.filter(product => {

    // Category filter
    if(
      selectedCategories.length > 0 &&
      !selectedCategories.includes(product.category)
    ){
      return false;
    }

    // Price filter
    if(minPrice && product.price < minPrice) return false;
    if(maxPrice && product.price > maxPrice) return false;

    // Search filter
    if(
      !product.name.toLowerCase().includes(search.toLowerCase())
    ){
      return false;
    }

    return true;
  });

  /* -----------------------------------------
  SORT PRODUCTS
  ----------------------------------------- */
  if(sort === "low-high"){
    filteredProducts.sort((a,b) => a.price - b.price);
  }

  if(sort === "high-low"){
    filteredProducts.sort((a,b) => b.price - a.price);
  }

  if(sort === "name"){
    filteredProducts.sort((a,b) => a.name.localeCompare(b.name));
  }

  if(sort === "rating"){
    filteredProducts.sort((a,b) => b.rating - a.rating);
  }

  /* -----------------------------------------
  LOAD MORE LOGIC
  ----------------------------------------- */
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return(

    <>
      {/* PAGE TITLE */}
      <h1 className="page-title">Shop Backpacks</h1>

      <div className="shop-container">

        {/* =========================================
        SIDEBAR FILTERS
        ========================================= */}
        <aside className="filters">

          <h3>Categories</h3>

          {["Travel","Office","School","Hiking"].map(cat => (

            <label key={cat}>

              <input
                type="checkbox"
                value={cat}
                onChange={handleCategoryChange}
              />

              {cat}

            </label>

          ))}


          {/* PRICE */}
          <h3>Price Range</h3>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e)=>setMinPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e)=>setMaxPrice(e.target.value)}
          />


          {/* SORT */}
          <h3>Sort By</h3>

          <select onChange={(e)=>setSort(e.target.value)}>

            <option value="">Default</option>
            <option value="low-high">Price Low to High</option>
            <option value="high-low">Price High to Low</option>
            <option value="name">Name A-Z</option>
            <option value="rating">Top Rating</option>

          </select>

        </aside>


        {/* =========================================
        PRODUCTS AREA
        ========================================= */}
        <section className="products-area">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />


          {/* GRID */}
          <div className="products-grid">

            {visibleProducts.map(product => (

              <div key={product.id} className="product-card">

                <img src={product.image} />

                <h3>{product.name}</h3>

                <p>${product.price}</p>

                <p className="rating">⭐ {product.rating}</p>

                {/* 🔥 ADD TO CART (React way) */}
                <button
                  className="add-to-cart"
                  onClick={()=>addToCart(product.id)}
                >
                  Add to Cart
                </button>

              </div>

            ))}

          </div>


          {/* LOAD MORE */}
          {visibleCount < filteredProducts.length && (

            <button
              onClick={()=>setVisibleCount(prev => prev + 4)}
            >
              Load More
            </button>

          )}

        </section>

      </div>
    </>
  );
}

export default Shop;