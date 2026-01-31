import { useState } from "react";
import styles from "./SortFilterBar.module.css";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Alphabetically: A-Z", value: "title_asc" },
  { label: "Alphabetically: Z-A", value: "title_desc" },
];

function SortFilterBar({ onFilterClick, onSortChange, currentSort }) {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleSortSelect = (value) => {
    onSortChange(value);
    setIsSortOpen(false);
  };

  return (
    <div className={styles.bar}>
      {/* SORT (Left 50%) */}
      <div
        className={styles.sortSection}
        onClick={() => setIsSortOpen(!isSortOpen)}
      >
        <span className={styles.label}>
          SORT BY <span className={styles.icon}>▼</span>
        </span>

        {isSortOpen && (
          <div className={styles.sortDropdown}>
            {SORT_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                className={`${styles.sortOption} ${currentSort === opt.value ? styles.activeSort : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSortSelect(opt.value);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FILTER (Right 50%) */}
      <div className={styles.filterSection} onClick={onFilterClick}>
        <span className={styles.label}>FILTER</span>
      </div>
    </div>
  );
}

export default SortFilterBar;
