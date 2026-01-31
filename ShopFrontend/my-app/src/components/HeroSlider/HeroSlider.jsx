import { useState, useEffect } from "react";
import styles from "./HeroSlider.module.css";
import { useNavigate } from "react-router-dom";
import MediaRenderer from "../MediaRenderer/MediaRenderer";

function HeroSlider({ categories }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    // Filter categories that have images/videos
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

                return (
                    <div
                        key={cat._id}
                        className={`${styles.slide} ${isActive ? styles.active : ""}`}
                    >
                        <MediaRenderer
                            src={cat.image}
                            className={styles.image}
                            alt={cat.name}
                        />

                        <div className={styles.content}>
                            <h2 className={styles.title}>{cat.name || "Shop Now"}</h2>
                            <button
                                className={styles.button}
                                onClick={() => navigate(`/c/${cat.slug || cat._id}`)}
                            >
                                SHOP {cat.name || ""}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default HeroSlider;
