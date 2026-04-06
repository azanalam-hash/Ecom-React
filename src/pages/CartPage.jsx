import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { products } from "../data/products";
import { useNavigate } from "react-router-dom";
import "./CartPage.css"
/* =========================================
CART PAGE
========================================= */

function CartPage(){

  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  let subtotal = 0;

  return(

    <div className="cart-page">

      <h1>Your Cart</h1>

      {/* TABLE HEADER */}
      <div className="cart-header">

        <p>Remove</p>
        <p>Image</p>
        <p>Product</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>

      </div>

      {/* CART ITEMS */}
      {cart.map(item => {

        const product = products.find(p => p.id === item.id);
        if(!product) return null;

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        return(

          <div key={item.id} className="cart-row">

            {/* REMOVE */}
            <button onClick={() => removeFromCart(item.id)}>✖</button>

            {/* IMAGE */}
            <img src={product.image} />

            {/* NAME */}
            <p>{product.name}</p>

            {/* PRICE */}
            <p>${product.price}</p>

            {/* QUANTITY */}
            <div className="quantity">

              <button onClick={() => removeFromCart(item.id)}>-</button>

              <span>{item.quantity}</span>

              <button onClick={() => addToCart(item.id)}>+</button>

            </div>

            {/* TOTAL */}
            <p>${itemTotal.toFixed(2)}</p>

          </div>

        );

      })}

      {/* SUMMARY */}
      <div className="cart-summary">

        <h3>Subtotal: ${subtotal.toFixed(2)}</h3>

        <button onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>

      </div>

    </div>
  );
}

export default CartPage;