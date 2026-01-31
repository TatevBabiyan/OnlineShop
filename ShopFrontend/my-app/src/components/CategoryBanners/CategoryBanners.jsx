import styles from "./CategoryBanners.module.css";
import { useNavigate } from "react-router-dom";
import config from "../../config";

function CategoryBanners({ banner }) {
  const navigate = useNavigate();

  if (!banner) return null;

  return (
    <section className={styles.wrapper}>
      {banner.images.map((img, i) => (
        <div key={i} className={styles.item}>
          <img src={`${config.apiHost}${img}`} alt="category-img" />
          <div className={styles.overlay}>
            <h3>{banner.title[i]}</h3>
            <button onClick={() => navigate(banner.buttonLink[i])}>
              {banner.buttonText[i]}
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default CategoryBanners;
