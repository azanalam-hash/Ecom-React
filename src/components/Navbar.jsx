import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="header">

      {/* Top Bar */}
      <div className="top-bar">
        <div> Select Language | USD </div>

        <div className="social-icons">
          <i className="fa fa-facebook"></i>
          <i className="fa fa-twitter"></i>
          <i className="fa fa-linkedin"></i>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="navbar">

        {/* Logo */}
        <div className="logo">Payne.</div>

        {/* Hamburger */}
        <div 
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* Menu */}
        <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>

          <li><a href="#">Home</a></li>
          <li><a href="/pages/product.html">Shop</a></li>

          <li 
            className={`dropdown ${dropdownOpen ? "active" : ""}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <a href="#">Pages</a>

            <ul className="dropdown-menu">
              <li><a href="#">About</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Checkout</a></li>
            </ul>
          </li>

          <li><a href="#">Blog</a></li>
          <li><a href="#">Contact Us</a></li>

        </ul>

        {/* Icons */}
        <div className="nav-icons">
          <i className="fa fa-search"></i>
          <i className="fa fa-user"></i>
          <i className="fa fa-heart"></i>

          <div className="cart-icon">
            <i className="fa fa-shopping-bag"></i>
            <span>0</span>
          </div>
        </div>

      </div>

    </header>
  );
}