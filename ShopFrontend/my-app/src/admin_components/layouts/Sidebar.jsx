import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/admin.module.css";

export default function Sidebar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname.startsWith(path) ? `${styles.active}` : "";
  };

  return (
    <aside className={styles.sidebar}>
      <h3>Carol's Shop</h3>
      <Link to="/admin/dashboard" className={getLinkClass("/admin/dashboard")}>Dashboard</Link>
      <Link to="/admin/stocks" className={getLinkClass("/admin/stocks")}>Stocks</Link>
      <Link to="/admin/products" className={getLinkClass("/admin/products")}>Products</Link>
      <Link to="/admin/categories" className={getLinkClass("/admin/categories")}>Categories</Link>
      <Link to="/admin/banners" className={getLinkClass("/admin/banners")}>Banners</Link>
      <Link to="/admin/orders" className={getLinkClass("/admin/orders")}>Orders</Link>
    </aside>
  );
}
