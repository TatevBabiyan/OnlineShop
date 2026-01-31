import { useEffect, useState } from "react";
import HeroSlider from "../../components/HeroSlider/HeroSlider"; // NEW
import CategoryBanners from "../../components/CategoryBanners/CategoryBanners";
import ShopTheLook from "../../components/ShopTheLook/ShopTheLook";
import axios from "axios";
import config from "../../config";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [categoryBanner, setCategoryBanner] = useState(null);
  const [look, setLook] = useState(null);

  useEffect(() => {
    // 1. Fetch Categories for Hero Slider
    axios.get(`${config.apiHost}/api/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));

    // 2. Fetch Banners (keeping existing logic for others)
    fetch(`${config.apiHost}/api/banner`)
      .then(res => res.json())
      .then(data => {
        setCategoryBanner(data.find(b => b.type === "category") || null);
        setLook(data.find(b => b.type === "look") || null);
      });
  }, []);

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Dynamic Slider */}
      {categories.length > 0 && <HeroSlider categories={categories} />}

      {/* "View All" button section - keeping it simple centered */}
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <a href="/all" style={{
          textDecoration: "none",
          color: "black",
          borderBottom: "1px solid black",
          paddingBottom: "4px",
          fontFamily: "'Montserrat-Alt1', sans-serif",
          fontSize: "14px",
          letterSpacing: "2px",
          textTransform: "uppercase"
        }}>
          View All Products
        </a>
      </div>

      {categoryBanner && <CategoryBanners banner={categoryBanner} />}
      {look && <ShopTheLook banner={look} />}
    </div>
  );
}
