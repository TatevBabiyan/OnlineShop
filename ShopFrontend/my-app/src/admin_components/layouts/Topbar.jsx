import styles from "../styles/admin.module.css";

export default function Topbar() {
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <header className={styles.topbar}>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
