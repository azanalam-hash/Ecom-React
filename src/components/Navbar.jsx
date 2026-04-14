import { useState } from "react";
import "./Navbar.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import CartDrawer from "./CartDrawer";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


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
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/mega-form">Mega Form</Link></li>

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
          
          {user ? (
            <div className="user-icon-menu popup-menu-trigger" style={{position: 'relative', display: 'inline-block', cursor: 'pointer', marginLeft: '15px'}}>
              <span onClick={handleLogout} title="Logout" style={{ fontWeight: "bold", color: "#3b82f6" }}>
                 Welcome, {user.name.split(' ')[0]} <i className="fa fa-sign-out" style={{marginLeft: '4px'}}></i>
              </span>
            </div>
          ) : (
            <Link to="/login" style={{color: 'inherit'}}><i className="fa fa-user"></i></Link>
          )}

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