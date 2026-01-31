// src/pages/OrderSuccessPage/OrderSuccessPage.jsx
import styles from "./OrderSuccessPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <div style={{ padding: 50 }}>No order found</div>;
  }

  const { total, cart, user } = state;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        <div className={styles.left}>
          <div className={styles.checkCircle}>✔</div>
          <h2>Your order is on its way!</h2>
          <p>We'll contact you soon with delivery details.</p>

          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
        </div>

        <div className={styles.right}>
          <div className={styles.summaryTitle}>Order Summary</div>

          <div className={styles.summaryBlock}>
            <div className={styles.line}>
              <span>Name</span>
              <span>{user.firstName} {user.lastName}</span>
            </div>

            <div className={styles.line}>
              <span>Email</span>
              <span>{user.email}</span>
            </div>

            <div className={styles.line}>
              <span>Phone</span>
              <span>{user.phone}</span>
            </div>

            <div className={styles.line}>
              <span>Address</span>
              <span>
                {user.address}
                {user.apartment && `, Apt ${user.apartment}`}<br />
                {user.city}, {user.postal}<br />
                {user.country}
              </span>
            </div>
          </div>

          <div className={styles.itemsBlock}>
            {cart.map((item, i) => (
              <div key={i} className={styles.itemRow}>
                <span>{item.title} ({item.variantColor})</span>
                <span>{item.qty} × ֏ {item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className={styles.totalBlock}>
            <div className={styles.line}>
              <span>Total</span>
              <span className={styles.totalValue}>
                ֏ {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderSuccessPage;
