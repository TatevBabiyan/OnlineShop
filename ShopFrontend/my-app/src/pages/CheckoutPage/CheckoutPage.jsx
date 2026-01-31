// src/pages/CheckoutPage/CheckoutPage.jsx
import styles from "./CheckoutPage.module.css";
import { useContext, useState } from "react";
import { CartContext } from "../../store/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";

function CheckoutPage() {
  const { cart, note } = useContext(CartContext);
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState("haypost"); // 'haypost' | 'pickup' | 'express'

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 0; // All current delivery methods are free
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    email: "",
    country: "Armenia",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    postal: "",
    city: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    // Simple verification
    if (!form.email || !form.firstName || !form.lastName || !form.phone) {
      // Address logic: If pickup, maybe address isn't strictly required? 
      // But user still provides billing info usually. Let's keep it required for now or relax it if pickup.
      // User didn't ask to relax address for pickup, so I'll keep it simple.
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...form,
      products: cart,
      subtotal,
      shipping,
      shippingMethod, // Added
      total,
      payment: "Cash",
      note: note || "" // Include the cart note
    };

    try {
      await axios.post(`${config.apiHost}/api/orders/create`, payload);

      navigate("/order-success", {
        state: {
          total,
          cart,
          user: form
        }
      });
    } catch (err) {
      console.error("ORDER ERROR:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.page}>
      {/* Simple Header for Checkout */}


      <div className={styles.main}>
        {/* LEFT */}
        <div className={styles.left}>
          <div className={styles.sectionTitle}>Contact</div>
          <input
            name="email"
            placeholder="Email"
            className={styles.input}
            value={form.email}
            onChange={handleChange}
            required
            type="email"
          />



          <div className={styles.sectionTitle}>Delivery Details</div>

          <select
            name="country"
            className={styles.input}
            value={form.country}
            onChange={handleChange}
            disabled
          >
            <option>Armenia</option>
          </select>

          <div className={styles.row2}>
            <input
              name="firstName"
              placeholder="First name"
              className={styles.input}
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last name"
              className={styles.input}
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="address"
            placeholder="Address"
            className={styles.input}
            value={form.address}
            onChange={handleChange}
            required
          />

          <input
            name="apartment"
            placeholder="Apartment (optional)"
            className={styles.input}
            value={form.apartment}
            onChange={handleChange}
          />

          <div className={styles.row2}>
            <input
              name="postal"
              placeholder="Postal code"
              className={styles.input}
              value={form.postal}
              onChange={handleChange}
              required
            />
            <input
              name="city"
              placeholder="City"
              className={styles.input}
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="phone"
            placeholder="Phone number"
            className={styles.input}
            value={form.phone}
            onChange={handleChange}
            required
          />

          <div className={styles.sectionTitle}>Shipping Method</div>

          <div className={styles.shippingOptions}>
            {/* Option 1: Hay Post */}
            <div
              className={`${styles.shipOption} ${shippingMethod === 'haypost' ? styles.selected : ''}`}
              onClick={() => setShippingMethod('haypost')}
            >
              <div className={styles.radioCircle}>
                {shippingMethod === 'haypost' && <div className={styles.radioDot} />}
              </div>
              <div className={styles.shipInfo}>
                <div className={styles.shipTitle}>Via Hay Post (for Regions)</div>
                <div className={styles.shipDesc}>1-3 business days</div>
              </div>
              <div className={styles.shipPrice}>Free</div>
            </div>

            {/* Option 2: Express Shipping */}
            <div
              className={`${styles.shipOption} ${shippingMethod === 'express' ? styles.selected : ''}`}
              onClick={() => setShippingMethod('express')}
            >
              <div className={styles.radioCircle}>
                {shippingMethod === 'express' && <div className={styles.radioDot} />}
              </div>
              <div className={styles.shipInfo}>
                <div className={styles.shipTitle}>Express Shipping</div>
                <div className={styles.shipDesc}>1-2 Business Days</div>
              </div>
              <div className={styles.shipPrice}>Free</div>
            </div>

            {/* Option 3: Store Pickup */}
            <div
              className={`${styles.shipOption} ${shippingMethod === 'pickup' ? styles.selected : ''}`}
              onClick={() => setShippingMethod('pickup')}
            >
              <div className={styles.radioCircle}>
                {shippingMethod === 'pickup' && <div className={styles.radioDot} />}
              </div>
              <div className={styles.shipInfo}>
                <div className={styles.shipTitle}>Store Pickup</div>
                <div className={styles.shipDesc}>Tumanyan 12</div>
              </div>
              <div className={styles.shipPrice}>Free</div>
            </div>
          </div>

          {/* Express Notice */}
          <div className={styles.expressNotice}>
            If you want your order to be delivered fast, we suggest placing your order via call: <a href="tel:+37441911994">+374 41 911 994</a>
          </div>

          <button className={styles.placeOrder} onClick={handlePlaceOrder}>
            Pay with Cash • {total.toLocaleString()} AMD
          </button>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          {cart.map((item, i) => (
            <div key={i} className={styles.summaryItem}>
              <div className={styles.qtyBubble}>{item.qty}</div>
              <img
                src={item.image?.startsWith("http") ? item.image : `${config.apiHost}${item.image}`}
                className={styles.summaryImg}
                alt=""
              />
              <div className={styles.sInfo}>
                <div className={styles.sTitle}>{item.title}</div>
                <div className={styles.sVariant}>
                  {item.size} / {item.variantColor}
                </div>
              </div>
              <div className={styles.sPrice}>
                {(item.price * item.qty).toLocaleString()} AMD
              </div>
            </div>
          ))}

          <div className={styles.sumLine}>
            <span>Subtotal ({cart.length} items)</span>
            <span>{subtotal.toLocaleString()} AMD</span>
          </div>

          <div className={styles.sumLine}>
            <span>Shipping</span>
            <span>{shipping.toLocaleString()} AMD</span>
          </div>

          <div className={styles.totalLine}>
            <span>Total</span>
            <span>AMD {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
