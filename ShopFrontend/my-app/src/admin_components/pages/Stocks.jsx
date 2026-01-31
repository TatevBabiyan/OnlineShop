import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/admin.module.css";
import config from "../../config";
export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create/Edit State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    variants: []
  });

  const API_URL = `${config.apiHost}/api/stocks/`;

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setStocks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = stocks.filter(s =>
    s.productName?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (stock = null) => {
    if (stock) {
      setEditingId(stock._id);
      setFormData({
        productName: stock.productName,
        variants: stock.variants || []
      });
    } else {
      setEditingId(null);
      setFormData({ productName: "", variants: [] });
    }
    setIsModalOpen(true);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { color: "", size: "", fabric: "", stock: 0, sku: "" }]
    });
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setIsModalOpen(false);
      fetchStocks();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error saving stock");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this stock?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStocks();
    } catch (err) {
      alert("Error deleting");
    }
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h2>Stock Management</h2>
        <button onClick={() => openModal()} className={styles.primaryButton}>+ Add Stock</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search stocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          style={{ padding: '10px', width: '300px', borderRadius: '6px', border: '1px solid #ddd' }}
        />
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Total Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="3" style={{ textAlign: 'center', padding: 20 }}>Loading...</td></tr> :
              filteredStocks.map(s => (
                <tr key={s._id}>
                  <td style={{ fontWeight: 500 }}>{s.productName}</td>
                  <td style={{ fontWeight: 600 }}>{s.totalStock}</td>
                  <td>
                    <button onClick={() => openModal(s)} style={{ marginRight: '10px', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                    <button onClick={() => handleDelete(s._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ width: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>{editingId ? "Edit Stock" : "Add Stock"}</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <input value={formData.productName} onChange={e => setFormData({ ...formData, productName: e.target.value })} required />
              </div>

              <div className={styles.formGroup}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Variants
                  <button type="button" onClick={addVariant} style={{ fontSize: '0.8rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+ Add Variant</button>
                </label>

                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '6px', background: '#fafafa' }}>
                  {formData.variants.length === 0 && <span style={{ color: '#999', fontSize: '0.9rem' }}>No variants added.</span>}

                  {formData.variants.map((v, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <input
                          type="color"
                          value={v.color?.startsWith("#") ? v.color : "#000000"}
                          onChange={e => handleVariantChange(i, 'color', e.target.value)}
                          style={{ width: 30, height: 30, padding: 0, border: 'none', cursor: 'pointer' }}
                        />
                        <input
                          placeholder="#000000"
                          value={v.color || ""}
                          onChange={e => handleVariantChange(i, 'color', e.target.value)}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <input placeholder="Size" value={v.size || ""} onChange={e => handleVariantChange(i, 'size', e.target.value)} />
                      <input placeholder="Fabric" value={v.fabric || ""} onChange={e => handleVariantChange(i, 'fabric', e.target.value)} />
                      <input placeholder="Qty" type="number" value={v.stock || ""} onChange={e => handleVariantChange(i, 'stock', e.target.value)} />
                      <button type="button" onClick={() => removeVariant(i)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.secondaryButton}>Cancel</button>
                <button type="submit" className={styles.primaryButton}>Save Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
