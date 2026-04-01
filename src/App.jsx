// React Router imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";

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

      </Routes>
      <Footer />

    </BrowserRouter>

  );
}

export default App;