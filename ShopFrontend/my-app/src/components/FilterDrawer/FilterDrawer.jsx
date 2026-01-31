import styles from "./FilterDrawer.module.css";
import { useState, useEffect } from "react";

const ALL_COLORS = ["Black", "White", "Red", "Blue", "Green", "Beige", "Brown", "Pink", "Grey"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const ALL_FABRICS = ["Cotton", "Silk", "Linen", "Polyester", "Wool", "Denim", "Velvet"];

function FilterDrawer({ isOpen, onClose, currentFilters, onApply }) {
    // Local state to manage filters before applying
    const [localFilters, setLocalFilters] = useState(currentFilters);

    // Sync when opening
    useEffect(() => {
        if (isOpen) {
            setLocalFilters(currentFilters);
        }
    }, [isOpen, currentFilters]);

    const toggleArrayFilter = (field, value) => {
        setLocalFilters(prev => {
            const list = prev[field] || [];
            const newList = list.includes(value)
                ? list.filter(item => item !== value)
                : [...list, value];
            return { ...prev, [field]: newList };
        });
    };

    const handlePriceChange = (field, value) => {
        setLocalFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleClear = () => {
        const cleared = { colors: [], sizes: [], fabrics: [], minPrice: "", maxPrice: "" };
        setLocalFilters(cleared);
        onApply(cleared); // Optional: auto-apply clear or wait for Apply button
        // onClose(); // Keep open or close? User usually expects clear to just reset form
    };

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.drawerOverlay} onClick={onClose} />
            {/* Add drawerOpen class for animation if we mount it always, but here we condition render. 
          To animate, we'd need to mount always and toggle class. For simplicity, plain conditional. 
          To do slide in, we need the element to exist. Let's wrap. */}

            <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`} style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
                <div className={styles.drawerHeader}>
                    <h2>Filters</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                {/* COLORS */}
                <div className={styles.filterSection}>
                    <h3>Color</h3>
                    <div className={styles.colorGrid}>
                        {ALL_COLORS.map(c => (
                            <div
                                key={c}
                                className={`${styles.colorOption} ${localFilters.colors.includes(c) ? styles.colorSelected : ""}`}
                                style={{ background: c.toLowerCase() }}
                                onClick={() => toggleArrayFilter("colors", c)}
                                title={c}
                            />
                        ))}
                    </div>
                </div>

                {/* SIZES */}
                <div className={styles.filterSection}>
                    <h3>Size</h3>
                    <div className={styles.sizeGrid}>
                        {ALL_SIZES.map(s => (
                            <div
                                key={s}
                                className={`${styles.sizeOption} ${localFilters.sizes.includes(s) ? styles.sizeSelected : ""}`}
                                onClick={() => toggleArrayFilter("sizes", s)}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                </div>

                {/* FABRIC */}
                <div className={styles.filterSection}>
                    <h3>Fabric</h3>
                    <div className={styles.fabricList}>
                        {ALL_FABRICS.map(f => (
                            <label key={f} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={localFilters.fabrics?.includes(f) || false}
                                    onChange={() => toggleArrayFilter("fabrics", f)}
                                />
                                {f}
                            </label>
                        ))}
                    </div>
                </div>

                {/* PRICE RANGE */}
                <div className={styles.filterSection}>
                    <h3>Price Range</h3>
                    <div className={styles.priceInputs}>
                        <input
                            type="number"
                            placeholder="MIN"
                            className={styles.priceInput}
                            value={localFilters.minPrice}
                            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                        />
                        <span>—</span>
                        <input
                            type="number"
                            placeholder="MAX"
                            className={styles.priceInput}
                            value={localFilters.maxPrice}
                            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
                    <button className={styles.applyBtn} onClick={handleApply}>Apply</button>
                </div>
            </div>
        </>
    );
}

export default FilterDrawer;
