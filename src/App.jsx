// React Router imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout.jsx"
import CartPage from "./pages/CartPage.jsx";
import Wishlist from "./pages/Wishlist";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAddProduct from "./pages/admin/AddProduct";

// Mega Form
import MegaForm from "./pages/MegaForm";
// Navbar
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


function App() {
  return (

    <BrowserRouter>

      {/* Navbar will stay on all pages */}
      <Navbar />

      <Routes>

        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Shop Page */}
        <Route path="/shop" element={<Shop />} />
        /* ADD THIS ROUTE */
<Route path="/product/:id" element={<ProductDetail />} />
        {/* Checkout page */}
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/cart" element={<CartPage />} />

       

<Route path="/wishlist" element={<Wishlist />} />

        {/* Mega Form Route */}
        <Route path="/mega-form" element={<MegaForm />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AdminAddProduct />} />

      </Routes>
      <Footer />

    </BrowserRouter>

  );
}

export default App;