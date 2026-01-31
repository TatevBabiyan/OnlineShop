import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* COL 1: Brand & Social */}
        <div className={styles.col}>
          <div className={styles.logo}>BASIQ</div>
          <p className={styles.tagline}>Elevating your everyday essentials.</p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialLink}>Instagram</a>
            <a href="#" className={styles.socialLink}>Facebook</a>
            <a href="#" className={styles.socialLink}>Pinterest</a>
          </div>
        </div>

        {/* COL 2: Shop */}
        <div className={styles.col}>
          <h4>SHOP</h4>
          <a href="/all">New Arrivals</a>
          <a href="/all">Best Sellers</a>
          <a href="/all">All Products</a>
          <a href="/all">Sale</a>
        </div>

        {/* COL 3: Customer Care */}
        <div className={styles.col}>
          <h4>CUSTOMER CARE</h4>
          <a href="#">Shipping & Returns</a>
          <a href="#">Size Guide</a>
          <a href="#">FAQ</a>
          <a href="#">Contact Us</a>
        </div>

        {/* COL 4: Newsletter */}
        <div className={styles.col}>
          <h4>NEWSLETTER</h4>
          <p className={styles.newsletterText}>Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className={styles.inputGroup}>
            <input type="email" placeholder="Enter your email" className={styles.input} />
            <button className={styles.button}>SUBSCRIBE</button>
          </div>
        </div>

      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} BASIQ. All rights reserved.</p>
        <div className={styles.legal}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
