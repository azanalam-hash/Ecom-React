import { Link } from "react-router-dom";
import "./Footer.css"

/* =========================================
FOOTER COMPONENT
========================================= */

function Footer(){

  return(

    <footer className="footer">

      <div className="footer-container">

        {/* -----------------------------------------
        ABOUT SECTION
        ----------------------------------------- */}
        <div className="footer-section">

          <h3>About Us</h3>

          <p>
            Premium backpack store offering travel, office, and lifestyle bags.
          </p>

        </div>


        {/* -----------------------------------------
        QUICK LINKS (React Router Links)
        ----------------------------------------- */}
        <div className="footer-section">

          <h3>Quick Links</h3>

          {/* Link replaces <a> in React */}
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/contact">Contact</Link>

        </div>


        {/* -----------------------------------------
        CONTACT INFO
        ----------------------------------------- */}
        <div className="footer-section">

          <h3>Contact</h3>

          <p>Email: support@backpackstore.com</p>
          <p>Phone: +1 234 567 890</p>

        </div>


        {/* -----------------------------------------
        SOCIAL
        ----------------------------------------- */}
        <div className="footer-section">

          <h3>Follow Us</h3>

          <p>Facebook | Instagram | Twitter</p>

        </div>

      </div>


      {/* -----------------------------------------
      COPYRIGHT
      ----------------------------------------- */}
      <p className="copyright">
        © 2026 Backpack Store. All rights reserved.
      </p>

    </footer>

  );
}

export default Footer;