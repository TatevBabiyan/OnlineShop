import styles from "./CartDrawer.module.css";
import { useContext } from "react";
import { CartContext } from "../../store/CartContext";
import { useNavigate } from "react-router-dom";
import config from "../../config";

function CartDrawer({ onClose }) {
  const { cart, updateQty, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const getImgUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${config.apiHost}${url}`;
  };

  const handleViewCart = () => {
    onClose();
    navigate("/cart");
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>CART</h2>
          <span className={styles.close} onClick={onClose}>✕</span>
        </div>

        {cart.length === 0 && <div className={styles.empty}>Your cart is empty.</div>}

        <div className={styles.items}>
          {cart.map((item, i) => (
            <div key={i} className={styles.item}>
              <img src={getImgUrl(item.image)} alt="" className={styles.thumb} />

              <div className={styles.info}>
                <div className={styles.title}>{item.title} {item.variantColor}</div>
                <div className={styles.price}>֏ {item.price.toLocaleString()}</div>
                <div className={styles.variant}>
                  {item.size} / {item.variantColor}
                </div>

                <div className={styles.controls}>
                  <div className={styles.qtyWrapper}>
                    <button onClick={() => updateQty(item, item.qty - 1)} disabled={item.qty <= 1}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item, item.qty + 1)} disabled={item.qty >= (item.maxStock || 999)}>+</button>
                  </div>
                  <span className={styles.remove} onClick={() => removeFromCart(item)}>Remove</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <button className={styles.viewBtn} onClick={handleViewCart}>
              VIEW CART
            </button>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              CHECKOUT • ֏ {subtotal.toLocaleString()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
