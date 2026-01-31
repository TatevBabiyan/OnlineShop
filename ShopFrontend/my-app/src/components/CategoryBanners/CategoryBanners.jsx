import MediaRenderer from "../MediaRenderer/MediaRenderer";
import { useNavigate } from "react-router-dom";
import styles from "./CategoryBanners.module.css";

function CategoryBanners({ banner }) {
  const navigate = useNavigate();

  const handleLink = (link) => {
    if (!link) return;
    if (link.startsWith("http")) {
      window.location.href = link;
    } else {
      navigate(link);
    }
  };

  if (!banner) return null;

  return (
    <section className={styles.wrapper}>
      {banner.images.map((img, i) => (
        <div key={i} className={styles.item}>
          <MediaRenderer src={img} alt="category-media" />
          <div className={styles.overlay}>
            <h3>{banner.title?.[i] || ""}</h3>
            <button onClick={() => handleLink(banner.buttonLink?.[i])}>
              {banner.buttonText?.[i] || "Shop Now"}
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default CategoryBanners;
