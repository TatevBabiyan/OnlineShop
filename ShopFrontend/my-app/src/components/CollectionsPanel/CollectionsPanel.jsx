import styles from "./CollectionsPanel.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";

function CollectionsPanel({ onClose }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${config.apiHost}/api/categories/`)
      .then(res => setCategories(res.data))
      .catch(err => console.log("CATEGORIES ERROR:", err));
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.head}>COLLECTIONS</h2>
        <div className={styles.list}>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/c/${cat.slug || cat._id}`}
              className={styles.item}
              onClick={onClose}
            >
              {cat.name || "Unnamed Collection"}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollectionsPanel;
