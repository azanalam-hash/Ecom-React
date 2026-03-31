// React Router imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import { Shop } from "./pages/Shop";

// Navbar
import Navbar from "./components/Navbar";

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

    </BrowserRouter>

  );
}

export default App;