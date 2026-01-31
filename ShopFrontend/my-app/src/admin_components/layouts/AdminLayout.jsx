import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "../styles/admin.module.css";

export default function AdminLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
