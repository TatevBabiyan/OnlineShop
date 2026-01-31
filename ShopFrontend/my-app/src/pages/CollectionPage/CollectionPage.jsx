import styles from "./CollectionPage.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { useParams, useNavigate } from "react-router-dom";
import SortFilterBar from "../../components/SortFilterBar/SortFilterBar";
import FilterDrawer from "../../components/FilterDrawer/FilterDrawer";

function CollectionPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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
    if (slug) params.append("category", slug);

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
  }, [slug, filters, sortBy]);

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1>{slug?.toUpperCase()}</h1>
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
                <div className={styles.price}>{p.price} AMD</div>
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

export default CollectionPage;
