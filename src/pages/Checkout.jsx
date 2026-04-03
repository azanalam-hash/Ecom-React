import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { products } from "../data/products";
import "./Checkout.css"

/* =========================================
CHECKOUT PAGE
========================================= */

function Checkout(){

  const { cart } = useContext(CartContext);

  /* -----------------------------------------
  CALCULATE TOTALS
  ----------------------------------------- */

  let subtotal = 0;

  const cartItems = cart.map(item => {

    const product = products.find(p => p.id === item.id);

    if(!product) return null;

    const itemTotal = product.price * item.quantity;

    subtotal += itemTotal;

    return {
      ...product,
      quantity: item.quantity,
      itemTotal
    };

  });

  const shipping = 0.16;
  const total = subtotal + shipping;

  return(

    <div className="checkout-container">

      {/* =============================
      LEFT SIDE (FORM)
      ============================= */}
      <div className="checkout-left">

        <h2>Contact</h2>

        <input placeholder="Email or phone number" />

        <label>
          <input type="checkbox" />
          Email me with news and offers
        </label>


        {/* DELIVERY */}
        <h2>Delivery</h2>

        <input placeholder="Country/Region" value="Pakistan" />

        <div className="row">
          <input placeholder="First name" />
          <input placeholder="Last name" />
        </div>

        <input placeholder="Address" />
        <input placeholder="Apartment, suite, etc." />

        <div className="row">
          <input placeholder="City" />
          <input placeholder="Postal code" />
        </div>


        {/* SHIPPING */}
        <h3>Shipping method</h3>

        <div className="shipping-box">
          Standard - $0.16
        </div>


        {/* PAYMENT */}
        <h3>Payment</h3>

        <div className="payment-box">
          Cash on Delivery (COD)
        </div>


        {/* COMPLETE ORDER */}
        <button className="complete-btn">
          Complete Order
        </button>

      </div>


      {/* =============================
      RIGHT SIDE (ORDER SUMMARY)
      ============================= */}
      <div className="checkout-right">

        {cartItems.map(item => item && (

          <div key={item.id} className="checkout-item">

            <img src={item.image} />

            <div>
              <h4>{item.name}</h4>
              <p>${item.price} x {item.quantity}</p>
            </div>

            <p>${item.itemTotal.toFixed(2)}</p>

          </div>

        ))}

        {/* TOTALS */}
        <div className="summary">

          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Shipping: ${shipping}</p>

          <h3>Total: ${total.toFixed(2)}</h3>

        </div>

      </div>

    </div>
  );
}

export default Checkout;