import styles from "./CollectionPage.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { useParams, useNavigate } from "react-router-dom";

function CollectionPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  // No filters state anymore

  // Fetch Category Name for Header
  useEffect(() => {
    axios.get(`${config.apiHost}/api/categories/`)
      .then(res => {
        const found = res.data.find(c => c.slug === slug || c._id === slug);
        if (found) {
          setCategoryName(found.name);
        } else {
          // Fallback if not found in list (e.g. "all", "sale" etc if they are not in cats)
          const fallback = slug ? slug.replace(/-/g, ' ').toUpperCase() : "COLLECTION";
          setCategoryName(fallback);
        }
      })
      .catch(() => {
        setCategoryName(slug ? slug.replace(/-/g, ' ').toUpperCase() : "COLLECTION");
      });
  }, [slug]);

  // Fetch Products for this collection
  useEffect(() => {
    if (!slug) return;
    axios.get(`${config.apiHost}/api/products/?category=${slug}`)
      .then(res => setProducts(res.data))
      .catch(err => console.log("COLLECTION PRODUCTS ERROR:", err));
  }, [slug]);


  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1>{categoryName.toUpperCase()}</h1>
      </div>

      {/* Sort and Filters Removed */}

      {/* GRID */}
      <div className={styles.grid}>
        {products.map(p => {
          const getImgUrl = (url) => {
            if (!url) return "";
            return url.startsWith("http") ? url : `${config.apiHost}${url}`;
          };
          const mainImg = getImgUrl(p.images?.[0]);
          const hoverImg = getImgUrl(p.images?.[1] || p.images?.[0]);

          return (
            <div key={p._id} className={styles.card} onClick={() => navigate(`/product/${p._id}`)}>
              <div className={styles.imageContainer}>
                <img src={mainImg} className={styles.mainImg} alt={p.title} />
                {p.images?.length > 1 && (
                  <img src={hoverImg} className={styles.hoverImg} alt={`${p.title} hover`} />
                )}
              </div>
              <div className={styles.info}>
                <div className={styles.title}>{p.title}</div>
                <div className={styles.price}>֏ {p.price?.toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Drawer Removed */}
    </div>
  );
}

export default CollectionPage;
