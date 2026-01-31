import { useState, useEffect } from "react";
import styles from "./HeroSlider.module.css";
import { useNavigate } from "react-router-dom";
import config from "../../config";

function HeroSlider({ categories }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    // Filter categories that have images
    const slides = categories.filter(c => c.image && c.image.trim() !== "");

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slides.length);
        }, 4000); // 4 seconds per slide

        return () => clearInterval(interval);
    }, [slides.length]);

    if (slides.length === 0) return null;

    return (
        <div className={styles.slider}>
            {slides.map((cat, index) => {
                const isActive = index === currentIndex;
                const imageUrl = cat.image.startsWith("http") ? cat.image : `${config.apiHost}${cat.image}`;

                return (
                    <div
                        key={cat._id}
                        className={`${styles.slide} ${isActive ? styles.active : ""}`}
                    >
                        <img src={imageUrl} className={styles.image} alt={cat.name} />

                        <div className={styles.content}>
                            <h2 className={styles.title}>{cat.name}</h2>
                            <button
                                className={styles.button}
                                onClick={() => navigate(`/c/${cat.name.toLowerCase()}`)}
                            >
                                SHOP {cat.name}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default HeroSlider;
