import { products } from "../data/products";
import "./Categories.css"

import { categories } from "../data/products";

/* =========================================
CATEGORIES COMPONENT
========================================= */

function Categories(){

  return(

    <section className="categories">

      <h2>Shop by Category</h2>

      <div className="category-grid">

        {/* -----------------------------------------
        LOOP CATEGORIES
        ----------------------------------------- */}
        {categories.map(category => (

          <div key={category.id} className="category-card">

            {/* Image */}
            <img src={category.image} alt={category.name} />

            {/* Name */}
            <h3>{category.name}</h3>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Categories;