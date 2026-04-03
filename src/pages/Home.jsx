import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Categories from "../components/Categories";


/* =========================================
HOME PAGE
========================================= */

function Home(){

  return(

    <div>

      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Categories */}
      <Categories />

    </div>

  );
}

export default Home;