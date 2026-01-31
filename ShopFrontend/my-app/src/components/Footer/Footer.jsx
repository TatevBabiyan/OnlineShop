import { useState } from "react";
import axios from "axios";
import config from "../../config";
import styles from "./Footer.module.css";

function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      await axios.post(`${config.apiHost}/api/newsletter/`, { email });
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* COL 1: Brand & Social */}
        <div className={styles.col}>
          <div className={styles.logo}>BASIQ</div>
          <p className={styles.tagline}>Your detail and solution</p>
          <div className={styles.socials}>
            <a href="https://www.instagram.com/yourbasiq?igsh=MW5qdjJsb2R6YXlmcA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* COL 2: Shop */}
        <div className={styles.col}>
          <h4>SHOP</h4>
          <a href="/all">Best Sellers</a>
          <a href="/all">All Products</a>
          <a href="/all">Sale</a>
        </div>

        {/* COL 3: Customer Care */}
        <div className={styles.col}>
          <h4>CUSTOMER CARE</h4>
          <a href="/shipping-returns">Shipping & Returns</a>
          <a href="/size-guide">Size Guide</a>
          <a href="/faq">FAQ</a>
          <a href="/contact">Contact Us</a>
        </div>

        {/* COL 4: Newsletter */}
        <div className={styles.col}>
          <h4>NEWSLETTER</h4>
          {status === "success" ? (
            <div className={styles.successMessage}>
              <p>Thank you! You've successfully subscribed.</p>
            </div>
          ) : (
            <>
              <p className={styles.newsletterText}>Subscribe to receive updates, access to exclusive deals, and more.</p>
              <form onSubmit={handleSubscribe} className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  className={styles.button}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "SUBMITTING..." : "SUBSCRIBE"}
                </button>
                {status === "error" && <p className={styles.errorText}>An error occurred. Please try again.</p>}
              </form>
            </>
          )}
        </div>

      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} BASIQ. All rights reserved.</p>
        <div className={styles.legal}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="/">Privacy Policy</a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="/">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
