import { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import "./Shop.css";
import ProductCard from "../components/ProductCard";

/* =========================================
SHOP PAGE COMPONENT
========================================= */

function Shop(){

  /* -----------------------------------------
  GLOBAL CART FUNCTION
  ----------------------------------------- */
  const { addToCart } = useContext(CartContext);

  /* -----------------------------------------
  STATE
  ----------------------------------------- */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  FETCH FROM SERVER (DYNAMIC FILTERING)
  ----------------------------------------- */
  useEffect(() => {
    // 1. Build Query Parameters
    const params = new URLSearchParams();
    
    if(selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(','));
    }
    if(minPrice) params.append("minPrice", minPrice);
    if(maxPrice) params.append("maxPrice", maxPrice);
    if(search) params.append("search", search);
    if(sort) params.append("sort", sort);

    // 2. Fetch Function
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = `http://localhost:5000/api/products?${params.toString()}`;
        console.log("Fetching:", url); // for debugging
        const res = await fetch(url);
        if(!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // 3. Debounce the fetch so we don't spam the server on every keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(delayDebounceFn);

  }, [selectedCategories, minPrice, maxPrice, search, sort]);

  /* -----------------------------------------
  LOAD MORE LOGIC
  ----------------------------------------- */
  const visibleProducts = products.slice(0, visibleCount);

  return(

    <>
      {/* PAGE TITLE */}
      <h1 className="page-title">Shop Backpacks</h1>

      {loading && <p style={{textAlign:"center", padding: "20px"}}>Loading products...</p>}
      {error && <p style={{textAlign:"center", color: "red", padding: "20px"}}>Error: {error}</p>}

      {!loading && !error && (
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

  <ProductCard key={product._id || product.id} product={product} />

))}

          </div>


          {/* LOAD MORE */}
          {visibleCount < products.length && (

            <button
              onClick={()=>setVisibleCount(prev => prev + 4)}
            >
              Load More
            </button>

          )}

        </section>

      </div>
      )}
    </>
  );
}

export default Shop;