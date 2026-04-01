import { useState } from "react";
import "./Navbar.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount } = useContext(CartContext);
  const [open, setOpen] = useState(false);


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

          <div className="cart-icon" onClick={() => setOpen(true)} >
            <i className="fa fa-shopping-bag"></i>
            <span>{cartCount}</span>
          </div>
          
        </div>

      </div>
      {/* CART DRAWER */}
      <CartDrawer
        isOpen={open}
        close={() => setOpen(false)}
      />

    </header>
  );
}