import styles from "./CartPage.module.css";
import { useContext } from "react";
import { CartContext } from "../../store/CartContext";
import { useNavigate } from "react-router-dom";
import config from "../../config";

function CartPage() {
  const { cart, updateQty, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const getImgUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${config.apiHost}${url}`;
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>CART</h1>

      {cart.length === 0 && (
        <div className={styles.empty}>Your cart is empty.</div>
      )}

      {cart.length > 0 && (
        <>
          <div className={styles.list}>
            {cart.map((item, i) => (
              <div key={i} className={styles.row}>
                {/* IMAGE */}
                <img src={getImgUrl(item.image)} alt="" className={styles.img} />

                {/* INFO */}
                <div className={styles.info}>
                  <div className={styles.itemTitle}>
                    {item.title} {item.variantColor}
                  </div>

                  <div className={styles.price}>
                    {item.price.toLocaleString()} AMD
                  </div>

                  <div className={styles.variant}>
                    {item.size} / {item.variantColor}
                  </div>

                  {/* QUANTITY CONTROL */}
                  <div className={styles.controls}>
                    <button
                      onClick={() => updateQty(item, item.qty - 1)}
                      disabled={item.qty <= 1}
                    >
                      –
                    </button>

                    <span>{item.qty}</span>

                    <button onClick={() => updateQty(item, item.qty + 1)} disabled={item.qty >= (item.maxStock || 999)}>
                      +
                    </button>

                    <span
                      className={styles.remove}
                      onClick={() => removeFromCart(item)}
                    >
                      Remove
                    </span>
                  </div>
                </div>

                {/* TOTAL PRICE RIGHT SIDE */}
                <div className={styles.totalRight}>
                  {(item.price * item.qty).toLocaleString()} AMD
                </div>
              </div>
            ))}
          </div>

          {/* ORDER NOTE */}
          <div className={styles.noteBlock}>
            <label>Add order note</label>
            <textarea placeholder="How can we help you?" />
          </div>

          {/* SUMMARY */}
          <div className={styles.summary}>
            <div className={styles.summaryLine}>
              <span>Total:</span>
              <span>{subtotal.toLocaleString()} AMD</span>
            </div>

            <div className={styles.taxInfo}>
              Tax included. Shipping calculated at checkout.
            </div>

            <button
              className={styles.checkoutBtn}
              onClick={() => navigate("/checkout")}
            >
              CHECKOUT
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
