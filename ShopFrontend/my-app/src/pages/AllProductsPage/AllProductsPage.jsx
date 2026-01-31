import styles from "./AllProductsPage.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { useSearchParams, useNavigate } from "react-router-dom";
import SortFilterBar from "../../components/SortFilterBar/SortFilterBar";
import FilterDrawer from "../../components/FilterDrawer/FilterDrawer";

function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL Params
  const searchQuery = searchParams.get("search");

  // State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    colors: [],
    sizes: [],
    fabrics: [],
    minPrice: "",
    maxPrice: ""
  });
  const [sortBy, setSortBy] = useState("newest");

  // Fetch Products
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);

    filters.colors.forEach(c => params.append("colors", c));
    filters.sizes.forEach(s => params.append("sizes", s));
    filters.fabrics?.forEach(f => params.append("fabrics", f));
    if (filters.minPrice) params.append("min_price", filters.minPrice);
    if (filters.maxPrice) params.append("max_price", filters.maxPrice);

    params.append("sort", sortBy);

    const url = `${config.apiHost}/api/products/?${params.toString()}`;

    axios.get(url)
      .then(res => setProducts(res.data))
      .catch(err => console.log("PRODUCTS ERROR:", err));
  }, [searchQuery, filters, sortBy]);

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1>{searchQuery ? `Result for "${searchQuery}"` : "All Products"}</h1>
      </div>

      {/* NEW SORT/FILTER BAR */}
      <SortFilterBar
        onFilterClick={() => setIsDrawerOpen(true)}
        onSortChange={setSortBy}
        currentSort={sortBy}
      />

      {/* GRID */}
      <div className={styles.grid}>
        {products.map(p => {
          const getUrl = (url) => {
            if (!url) return "";
            return url.startsWith("http") ? url : `${config.apiHost}${url}`;
          };
          const mainImg = getUrl(p.images?.[0]);
          const hoverImg = getUrl(p.images?.[1] || p.images?.[0]);

          return (
            <div key={p._id} className={styles.card} onClick={() => navigate(`/product/${p._id}`)}>
              <div className={styles.imageContainer}>
                <img src={mainImg} className={styles.mainImg} alt={p.title} />
                {p.images?.length > 1 && (
                  <img src={hoverImg} className={`${styles.hoverImg} ${styles.imgTransition}`} alt={`${p.title} hover`} />
                )}
              </div>
              <div className={styles.info}>
                <div className={styles.title}>{p.title}</div>
                <div className={styles.price}>{p.price} AMD</div>

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

      {/* LEFT FILTER DRAWER */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentFilters={filters}
        onApply={setFilters}
      />
    </div>
  );
}

export default AllProductsPage;
