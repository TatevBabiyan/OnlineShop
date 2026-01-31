import styles from "./HeroSection.module.css";
import { useNavigate } from "react-router-dom";
import config from "../../config";

function HeroSection({ banner }) {
  const navigate = useNavigate();
  if (!banner) return null;

  return (
    <section className={styles.hero}>
      <img src={`${config.apiHost}${banner.image}`} className={styles.img} alt="" />

      <div className={styles.center}>
        <h2>{banner.title}</h2>
        <button onClick={() => navigate(banner.buttonLink || "/")}>
          {banner.buttonText || "VIEW ALL"}
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
