import styles from "./AllProductsPage.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { useSearchParams, useNavigate } from "react-router-dom";
import MediaRenderer from "../../components/MediaRenderer/MediaRenderer";

function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL Params
  const searchQuery = searchParams.get("search");

  // No filters state anymore

  // Fetch Products
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);

    const url = `${config.apiHost}/api/products/?${params.toString()}`;

    axios.get(url)
      .then(res => setProducts(res.data))
      .catch(err => console.log("PRODUCTS ERROR:", err));
  }, [searchQuery]);

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1>{searchQuery ? `Result for "${searchQuery}"` : "All Products"}</h1>
      </div>

      {/* Sort and Filters Removed */}

      {/* GRID */}
      <div className={styles.grid}>
        {products.map(p => {
          return (
            <div key={p._id} className={styles.card} onClick={() => navigate(`/product/${p._id}`)}>
              <div className={styles.imageContainer}>
                <MediaRenderer src={p.images?.[0]} className={styles.mainImg} alt={p.title} />
                {p.images?.length > 1 && (
                  <MediaRenderer src={p.images?.[1] || p.images?.[0]} className={`${styles.hoverImg} ${styles.imgTransition}`} alt={`${p.title} hover`} />
                )}
              </div>
              <div className={styles.info}>
                <div className={styles.title}>{p.title}</div>
                <div className={styles.price}>֏ {p.price?.toLocaleString()}</div>

                {/* COLOR PREVIEW */}
                {p.colors && p.colors.length > 0 && (
                  <div className={styles.cardColors}>
                    {p.colors.slice(0, 4).map((c, idx) => (
                      <div key={idx} className={styles.cardColorDot} style={{ background: c, border: c?.toLowerCase() === '#ffffff' ? '1px solid #ddd' : 'none' }} />
                    ))}
                    {p.colors.length > 4 && <span className={styles.moreColors}>+{p.colors.length - 4}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Drawer Removed */}
    </div>
  );
}

export default AllProductsPage;
