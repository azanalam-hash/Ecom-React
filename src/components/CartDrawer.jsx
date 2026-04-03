import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { products } from "../data/products";
import "./CartDrawer.css";
import { useNavigate } from "react-router-dom";

/* =========================================
CART DRAWER COMPONENT (CONNECTED TO CSS)
========================================= */

function CartDrawer({ isOpen, close }){

  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  let subtotal = 0;

  return(

    <>
      {/* =========================================
      OVERLAY (matches .cart-overlay)
      ========================================= */}
      <div
        className={`cart-overlay ${isOpen ? "active" : ""}`}
        onClick={close}
      ></div>


      {/* =========================================
      DRAWER PANEL (matches .cart-drawer)
      ========================================= */}
      <div className={`cart-drawer ${isOpen ? "active" : ""}`}>

        {/* HEADER */}
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button onClick={close}>✖</button>
        </div>


        {/* ITEMS */}
        <div className="cart-items">

          {cart.length === 0 && <p>No items in cart</p>}

          {cart.map(item => {

            const product = products.find(p => p.id === item.id);

            if(!product) return null;

            subtotal += product.price * item.quantity;

            return(
              <div key={item.id} className="cart-item">

                <img src={product.image} alt="" />

                <div>
                  <h4>{product.name}</h4>
                  <p>${product.price} x {item.quantity}</p>
                </div>

              </div>
            );
          })}

        </div>


        {/* FOOTER */}
        <div className="cart-footer">

          <h3>Subtotal: ${subtotal.toFixed(2)}</h3>

          <button
  className="checkout-btn"
  onClick={() => navigate("/checkout")}
>
  Checkout
</button>

        </div>

      </div>
    </>
  );
}

export default CartDrawer;