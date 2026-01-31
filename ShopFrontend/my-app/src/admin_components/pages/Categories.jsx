import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "../styles/admin.module.css";
import config from "../../config";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const API_URL = `${config.apiHost}/api/categories`;

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setImage("");
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingCategory) {
        // Edit Mode
        await axios.put(`${API_URL}/${editingCategory._id}`, { name, description, image });
      } else {
        // Create Mode
        await axios.post(API_URL, { name, description, image });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "An error occurred";
      setError(msg);
      console.error("CATEGORY ERROR:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h2>Categories</h2>
        <button onClick={openCreateModal} className={styles.primaryButton}>
          + New Category
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan="3">No categories found.</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    {cat.image ? (
                      <img src={cat.image.startsWith("http") ? cat.image : `${config.apiHost}${cat.image}`} alt="cat" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 10, color: '#ccc' }}>No Image</span>
                    )}
                  </td>
                  <td>{cat.name}</td>
                  <td>{cat.description || "-"}</td>
                  <td>
                    <button
                      style={{ marginRight: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
                      onClick={() => openEditModal(cat)}>Edit</button>
                    <button
                      style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                      onClick={() => handleDelete(cat._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{editingCategory ? "Edit Category" : "Create Category"}</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Image</label>
                {image && (
                  <div style={{ marginBottom: 10 }}>
                    <img
                      src={image.startsWith("http") ? image : `${config.apiHost}${image}`}
                      alt="preview"
                      style={{ height: 60, objectFit: 'cover' }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const fd = new FormData();
                    fd.append("file", file);
                    try {
                      const res = await axios.post(`${config.apiHost}/api/upload/image`, fd);
                      setImage(res.data.url);
                    } catch (err) {
                      console.error(err);
                      alert("Error uploading image");
                    }
                  }}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.secondaryButton}>Cancel</button>
                <button type="submit" className={styles.primaryButton}>{editingCategory ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
