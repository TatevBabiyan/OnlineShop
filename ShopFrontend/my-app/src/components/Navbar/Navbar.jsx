import { useContext, useState } from "react";
import { CartContext } from "../../store/CartContext";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

import logo from "../../assets/logo_cropped.jpg";

function Navbar({ onOpenCollections, onLogoClick, onOpenCart }) {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearchKey = (e) => {
    if (e.key === "Enter" && query.trim()) {
      setSearchOpen(false);
      setMenuOpen(false);
      navigate(`/all?search=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  return (
    <nav className={styles.nav}>
      <button className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.active : ""}`}>
        <button className={styles.closeInline} style={{ alignSelf: "flex-end", fontSize: 32, marginBottom: 20 }} onClick={() => setMenuOpen(false)}>×</button>

        <div className={styles.mobileSearchWrapper}>
          <input
            type="text"
            placeholder="SEARCH..."
            className={styles.mobileSearchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKey}
          />
        </div>

        <span className={styles.mobileLink} onClick={() => { setMenuOpen(false); onOpenCollections(); }}>COLLECTIONS</span>
        <span className={styles.mobileLink} onClick={() => { setMenuOpen(false); navigate("/all"); }}>SHOP ALL</span>
      </div>

      <div className={styles.left}>
        <span className={styles.link} onClick={onOpenCollections}>COLLECTIONS</span>
        <span className={styles.link} onClick={() => navigate("/all")}>SHOP ALL</span>
      </div>

      <div className={styles.logo} onClick={() => navigate("/")}>
        <img src={logo} alt="BASIQ" className={styles.logoImg} />
      </div>

      <div className={styles.right}>
        {searchOpen ? (
          <div className={styles.searchWrapper}>
            <input
              autoFocus
              type="text"
              placeholder="SEARCH..."
              className={styles.inlineSearchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKey}
              onBlur={() => !query && setSearchOpen(false)}
            />
            <button className={styles.closeInline} onClick={() => setSearchOpen(false)}>×</button>
          </div>
        ) : (
          <button className={styles.iconLink} onClick={() => setSearchOpen(true)}>
            SEARCH
          </button>
        )}

        <span className={styles.cartIcon} onClick={onOpenCart}>
          BAG {cart.length > 0 && `(${cart.length})`}
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
