import { useState } from "react";
import adminApi from "../api/adminApi";
import styles from "../styles/admin.module.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await adminApi.post("/api/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      onLogin?.();
      window.location.href = "/admin/dashboard";
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Connection error. Please check Render logs.";
      alert("Error: " + errorMsg);
    }
  };

  return (
    <div className={styles.login}>
      <h2>Admin Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}
