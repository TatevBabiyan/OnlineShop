import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ShopTheLook.module.css";
import { useNavigate } from "react-router-dom";
import config from "../../config";

function ShopTheLook({ banner }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    if (banner) {
      if (banner.linkedProducts && banner.linkedProducts.length > 0) {
        const ids = banner.linkedProducts.join(",");
        axios.get(`${config.apiHost}/api/products/?ids=${ids}`)
          .then(res => setProducts(res.data))
          .catch(err => console.error(err));
      } else {
        // Fetch ALL products if none linked
        axios.get(`${config.apiHost}/api/products/`)
          .then(res => setProducts(res.data))
          .catch(err => console.error(err));
      }
    }
  }, [banner]);

  if (!banner) return null;

  const getImgUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${config.apiHost}${url}`;
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h4>{banner.price || "COLLECTION"}</h4>
        <h3>{banner.title || "SHOP THE LOOK"}</h3>
      </div>

      <div className={styles.wrapper}>
        {/* PREV ARROW */}
        <button
          className={`${styles.arrow} ${styles.prev}`}
          onClick={() => setActiveIndex((prev) => (prev - 1 + products.length) % products.length)}
          style={{ visibility: products.length > 1 ? 'visible' : 'hidden' }}
        >
          ‹
        </button>

        <div className={styles.container}>
          {/* LEFT: MAIN IMAGE (STATIC) */}
          <div className={styles.left}>
            {banner.image && <img src={getImgUrl(banner.image)} alt={banner.title} className={styles.mainImage} />}
            {/* Visual Hotspots */}
            <div className={styles.hotspot} style={{ top: '60%', left: '40%', animationDelay: '0s' }} />
            <div className={styles.hotspot} style={{ top: '30%', left: '65%', animationDelay: '1s' }} />
          </div>

          {/* RIGHT: PRODUCT CARD */}
          <div className={styles.right}>
            {products.length > 0 && products[activeIndex] && (
              <div className={styles.productCard}>
                <div className={styles.imgWrapper} onClick={() => navigate(`/product/${products[activeIndex]._id}`)}>
                  <img src={getImgUrl(products[activeIndex].images?.[0])} alt={products[activeIndex].title} />
                </div>

                <div className={styles.info}>
                  <div className={styles.pTitle} onClick={() => navigate(`/product/${products[activeIndex]._id}`)}>
                    {products[activeIndex].title}
                  </div>
                  <div className={styles.pPrice}>{products[activeIndex].price} AMD</div>

                  <button className={styles.viewBtn} onClick={() => navigate(`/product/${products[activeIndex]._id}`)}>
                    VIEW PRODUCT
                  </button>

                  {/* DOTS */}
                  {products.length > 1 && (
                    <div className={styles.dots}>
                      {products.map((_, i) => (
                        <span
                          key={i}
                          className={`${styles.dot} ${i === activeIndex ? styles.activeDot : ""}`}
                          onClick={() => setActiveIndex(i)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NEXT ARROW */}
        <button
          className={`${styles.arrow} ${styles.next}`}
          onClick={() => setActiveIndex((prev) => (prev + 1) % products.length)}
          style={{ visibility: products.length > 1 ? 'visible' : 'hidden' }}
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default ShopTheLook;
