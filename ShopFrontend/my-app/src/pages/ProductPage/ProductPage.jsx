import { useParams } from "react-router-dom";
import styles from "./ProductPage.module.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import config from "../../config";
import { CartContext } from "../../store/CartContext";

function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiHost}/api/products/${id}`).then((res) => {
      const p = res.data;

      // Derive Colors/Sizes from Variants (Source of Truth)
      // If variants exist, use them. Else fallback to product fields.
      let derivedColors = p.colors || [];
      let derivedSizes = p.sizes || [];

      if (p.variants && p.variants.length > 0) {
        const vColors = new Set();
        const vSizes = new Set();
        p.variants.forEach(v => {
          if (v.color) vColors.add(v.color);
          if (v.size) vSizes.add(v.size);
        });
        if (vColors.size > 0) derivedColors = Array.from(vColors);
        if (vSizes.size > 0) derivedSizes = Array.from(vSizes);
      }

      const normalized = {
        ...p,
        images: (p.images || []).filter((img) => img && img.trim() !== ""),
        sizes: derivedSizes,
        colors: derivedColors,
        variants: p.variants || [],
        sku: p.sku || null,
      };

      setProduct(normalized);
      setSelectedColor(normalized.colors[0] || null);
    });
  }, [id]);

  if (!product) return <div className={styles.page}>Loading…</div>;

  // Stock Validation Helper
  const getVariantStock = (color, size) => {
    if (!product.variants || product.variants.length === 0) return 999; // Fallback if no link

    const v = product.variants.find(v =>
      (v.color || "").toLowerCase() === (color || "").toLowerCase() &&
      (v.size || "").toLowerCase() === (size || "").toLowerCase()
    );
    return v ? parseInt(v.stock || 0) : 0;
  };

  const currentStock = getVariantStock(selectedColor, selectedSize);
  const isOutOfStock = currentStock <= 0;

  const canAdd =
    (product.sizes.length === 0 || selectedSize) &&
    (product.colors.length === 0 || selectedColor) &&
    !isOutOfStock;

  const handleAdd = () => {
    if (!canAdd) return;

    addToCart({
      productId: id,
      title: product.title,
      price: product.price,
      image: product.images[0] || null,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      maxStock: currentStock
    });
  };

  const sections = [
    { label: "Description", key: "description" },
    { label: "Fit & Fabric", key: "fit_fabric" },
    { label: "Returns & Exchanges", key: "returns_exchanges" },
    { label: "Shipping", key: "shipping" },
  ];

  // Helper for image URLs
  const getImgUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${config.apiHost}${url}`;
  };

  const handleNext = () => {
    if (!product || !product.images) return;
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrev = () => {
    if (!product || !product.images) return;
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className={styles.page}>
      {/* LEFT – IMAGE SLIDER */}
      <div className={styles.left}>
        {product.images.length > 0 ? (
          <>
            <div className={styles.mainImageWrapper}>
              {product.images.length > 1 && (
                <button className={`${styles.arrow} ${styles.prev}`} onClick={handlePrev}>‹</button>
              )}

              <img
                src={getImgUrl(product.images[activeImageIndex])}
                className={styles.mainImg}
                alt={product.title}
              />

              {product.images.length > 1 && (
                <button className={`${styles.arrow} ${styles.next}`} onClick={handleNext}>›</button>
              )}
            </div>

            {/* THUMBNAILS */}
            {product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={getImgUrl(img)}
                    className={`${styles.thumb} ${i === activeImageIndex ? styles.active : ""}`}
                    onClick={() => setActiveImageIndex(i)}
                    alt="thumbnail"
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={styles.noImage}>No image available</div>
        )}
      </div>

      {/* RIGHT – INFO */}
      <div className={styles.right}>
        <h1 className={styles.title}>{product.title}</h1>
        {product.sku && <div className={styles.sku}>SKU: {product.sku}</div>}
        <div className={styles.price}>֏ {product.price?.toLocaleString()}</div>


        {/* SIZES */}
        {product.sizes.length > 0 && (
          <>
            <div className={styles.rowBetween}>
              <div className={styles.label}>Size:</div>
              <div className={styles.sizeChart}>Size chart</div>
            </div>

            <div className={styles.sizeRow}>
              {product.sizes.map((s) => (
                <div
                  key={s}
                  className={`${styles.sizeBox} ${selectedSize === s ? styles.sizeActive : ""
                    }`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          </>
        )}

        {/* COLORS */}
        {product.colors.length > 0 && (
          <>
            <div className={styles.label}>Other colors</div>
            <div className={styles.colorRow}>
              {product.colors.map((c, i) => (
                <div
                  key={i}
                  className={`${styles.colorDot} ${selectedColor === c ? styles.colorActive : ""
                    }`}
                  style={{ background: c }}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </div>
          </>
        )}

        {/* ADD TO CART */}
        <button
          className={canAdd ? styles.addBtn : styles.addBtnDisabled}
          disabled={!canAdd}
          onClick={handleAdd}
        >
          {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
        </button>

        {isOutOfStock && selectedSize && selectedColor && (
          <div style={{ color: "red", fontSize: 12, marginTop: -30, marginBottom: 20 }}>
            Selected combination is out of stock.
          </div>
        )}

        {/* COLLAPSIBLE */}
        <div className={styles.collapse}>
          {sections.map((sec) => (
            <div key={sec.key} className={styles.cItem}>
              <div
                className={styles.cHeader}
                onClick={() => setOpen(open === sec.key ? null : sec.key)}
              >
                <span>{sec.label}</span>
                <span>{open === sec.key ? "−" : "+"}</span>
              </div>
              {open === sec.key && (
                <div className={styles.cContent}>
                  {product[sec.key]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
