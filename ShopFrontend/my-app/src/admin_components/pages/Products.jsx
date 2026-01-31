import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "../styles/admin.module.css";
import config from "../../config";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Stock, 2: Product Details
  const [selectedStock, setSelectedStock] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  // Inline Stock Creation State
  const [isCreatingStock, setIsCreatingStock] = useState(false);
  const [newStockData, setNewStockData] = useState({ productName: "", variants: [] });

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    fit_fabric: "",
    returns_exchanges: "",
    shipping: "",
    images: []
  });

  const [editingId, setEditingId] = useState(null);

  const API_PRODUCTS = `${config.apiHost}/api/products`;
  const API_STOCKS = `${config.apiHost}/api/stocks`;
  const API_CATEGORIES = `${config.apiHost}/api/categories`;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, sRes, cRes] = await Promise.all([
        axios.get(API_PRODUCTS + "/"),
        axios.get(API_STOCKS + "/"),
        axios.get(API_CATEGORIES + "/")
      ]);
      setProducts(pRes.data);
      setStocks(sRes.data);
      setCategories(cRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_PRODUCTS, API_STOCKS, API_CATEGORIES]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAddModal = () => {
    setStep(1);
    setSelectedStock(null);
    setIsCreatingStock(false);
    setNewStockData({ productName: "", variants: [] });
    setEditingId(null);
    setFormData({
      title: "",
      category: "",
      price: "",
      description: "",
      fit_fabric: "",
      returns_exchanges: "",
      shipping: "",
      images: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setStep(2); // Skip stock selection for edit
    setEditingId(product._id);
    setSelectedStock(null);
    setFormData({
      title: product.title,
      stock_id: product.stock_id, // Ensure we keep track of linked stock
      category: product.category,
      price: product.price,
      description: product.description || "",
      fit_fabric: product.fit_fabric || "",
      returns_exchanges: product.returns_exchanges || "",
      shipping: product.shipping || "",
      images: product.images || []
    });
    setIsModalOpen(true);
  };

  const handleStockSelect = (e) => {
    const stockId = e.target.value;
    const stock = stocks.find(s => s._id === stockId);
    setSelectedStock(stock);
    if (stock) {
      setFormData(prev => ({
        ...prev,
        title: stock.productName, // Pre-fill title
        stock_id: stock._id,
        quantity: stock.totalStock,
        colors: stock.variants?.map(v => v.color).filter(Boolean) || [],
        sizes: stock.variants?.map(v => v.size).filter(Boolean) || []
      }));
    }
  };

  const handleNext = () => {
    if (selectedStock) {
      setStep(2);
    } else {
      alert("Please select a stock item or create a new one.");
    }
  };

  const handleToggleStockCreation = () => {
    setIsCreatingStock(!isCreatingStock);
    setNewStockData({ productName: "", variants: [] }); // Reset on toggle
  };

  const addVariant = () => {
    setNewStockData(prev => ({
      ...prev,
      variants: [...prev.variants, { color: "", size: "", fabric: "", stock: 0 }]
    }));
  };

  const removeVariant = (index) => {
    setNewStockData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...newStockData.variants];
    updated[index][field] = value;
    setNewStockData({ ...newStockData, variants: updated });
  };

  const handleCreateStock = async () => {
    if (!newStockData.productName) return alert("Stock name required");
    if (newStockData.variants.length === 0) return alert("Add at least one variant");

    try {
      const res = await axios.post(API_STOCKS, newStockData);
      const createdStock = res.data; // API should return the created object including _id

      // Add to local stocks list
      setStocks(prev => [...prev, createdStock]);

      // Auto-select and proceed
      setSelectedStock(createdStock);
      setIsCreatingStock(false);

      // Pre-fill form data from the new stock
      setFormData(prev => ({
        ...prev,
        title: createdStock.productName,
        stock_id: createdStock._id,
        quantity: createdStock.totalStock
      }));

      setStep(2);
    } catch (err) {
      alert("Error creating stock: " + (err.response?.data?.error || err.message));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (let file of files) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await axios.post(`${config.apiHost}/api/upload/image`, fd);
        setFormData(prev => ({ ...prev, images: [...prev.images, res.data.url] }));
      } catch (err) {
        alert("Error uploading image");
      }
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_PRODUCTS}/${editingId}`, formData);
      } else {
        await axios.post(API_PRODUCTS + "/", formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Error saving product: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_PRODUCTS}/${id}`);
      fetchData();
    } catch (err) {
      alert("Error deleting");
    }
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h2>Products</h2>
        <button onClick={openAddModal} className={styles.primaryButton}>+ Add Product</button>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock Qty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{ padding: 20, textAlign: 'center' }}>Loading...</td></tr> :
              products.map(p => (
                <tr key={p._id}>
                  <td>
                    {p.images && p.images[0] ? (
                      <img src={`${config.apiHost}${p.images[0]}`} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} alt="product" />
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: '#ccc' }}>No IMG</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{p.title}</td>
                  <td style={{ color: '#555' }}>
                    {(() => {
                      const cat = categories.find(c => (c.slug === p.category || c.name.toLowerCase() === p.category?.toLowerCase() || c._id === p.category));
                      return cat ? cat.name : p.category;
                    })()}
                  </td>
                  <td style={{ fontWeight: 600 }}>֏ {p.price?.toLocaleString()}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <button onClick={() => openEditModal(p)} style={{ marginRight: 10, cursor: 'pointer', background: 'none', border: 'none', color: '#2563eb', fontWeight: 500 }}>Edit</button>
                    <button onClick={() => handleDelete(p._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ width: '800px', maxWidth: '95%' }}>

            {step === 1 ? (
              /* STOCK SELECTION STEP */
              <>
                <h3 style={{ marginTop: 0 }}>Select Stock Item</h3>

                {!isCreatingStock ? (
                  // EXISTING STOCK DROPDOWN MODE
                  <div className={styles.formGroup}>
                    <label>Choose Stock Item to Link</label>
                    <select onChange={handleStockSelect} value={selectedStock?._id || ""} style={{ padding: '10px' }}>
                      <option value="">-- Select a Stock Item --</option>
                      {stocks.map(s => (
                        <option key={s._id} value={s._id}>
                          {s.productName} (Qty: {s.totalStock})
                        </option>
                      ))}
                    </select>

                    <div style={{ margin: '20px 0', textAlign: 'center', position: 'relative' }}>
                      <span style={{ background: 'white', padding: '0 10px', color: '#888', position: 'relative', zIndex: 1 }}>OR</span>
                      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#eee', zIndex: 0 }}></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleStockCreation}
                      style={{ width: '100%', padding: '12px', border: '1px dashed #2563eb', background: '#eff6ff', color: '#2563eb', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                    >
                      + Create New Stock Item
                    </button>

                    <div className={styles.modalActions}>
                      <button onClick={() => setIsModalOpen(false)} className={styles.secondaryButton}>Cancel</button>
                      <button onClick={handleNext} className={styles.primaryButton} disabled={!selectedStock}>Next</button>
                    </div>
                  </div>
                ) : (
                  // CREATE NEW STOCK MODE
                  <div className={styles.formGroup} style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 15px 0' }}>New Stock Details</h4>

                    <div className={styles.formGroup}>
                      <label>Stock Name (e.g. "Summer Dress Inventory")</label>
                      <input
                        value={newStockData.productName}
                        onChange={e => setNewStockData({ ...newStockData, productName: e.target.value })}
                        placeholder="Enter a name for this inventory..."
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Variants (Colors & Sizes)
                        <button type="button" onClick={addVariant} style={{ fontSize: '0.8rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+ Add Variant</button>
                      </label>
                      <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 6, padding: 10, maxHeight: 200, overflowY: 'auto' }}>
                        {newStockData.variants.length === 0 && <div style={{ color: '#ccc', textAlign: 'center', padding: 10 }}>No variants added yet.</div>}
                        {newStockData.variants.map((v, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto', gap: 10, marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <input
                                type="color"
                                value={v.color?.startsWith("#") ? v.color : "#000000"}
                                onChange={e => handleVariantChange(i, 'color', e.target.value)}
                                style={{ width: 30, height: 30, padding: 0, border: 'none', cursor: 'pointer' }}
                              />
                              <input
                                placeholder="#000000"
                                value={v.color}
                                onChange={e => handleVariantChange(i, 'color', e.target.value)}
                                style={{ padding: 6, width: '100%' }}
                              />
                            </div>
                            <input placeholder="Size" value={v.size} onChange={e => handleVariantChange(i, 'size', e.target.value)} style={{ padding: 6 }} />
                            <input placeholder="Fabric" value={v.fabric} onChange={e => handleVariantChange(i, 'fabric', e.target.value)} style={{ padding: 6 }} />
                            <input placeholder="Qty" type="number" value={v.stock} onChange={e => handleVariantChange(i, 'stock', e.target.value)} style={{ padding: 6 }} />
                            <button type="button" onClick={() => removeVariant(i)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.modalActions}>
                      <button type="button" onClick={handleToggleStockCreation} className={styles.secondaryButton}>Back to Select</button>
                      <button type="button" onClick={handleCreateStock} className={styles.primaryButton}>Create & Link Stock</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* PRODUCT DETAILS STEP (TABS) */
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0 }}>{editingId ? "Edit Product" : "New Product"}</h3>

                  {/* TABS HEADER */}
                  <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 6, padding: 4 }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab("general")}
                      style={{
                        padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                        background: activeTab === "general" ? "white" : "transparent",
                        boxShadow: activeTab === "general" ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                        color: activeTab === "general" ? "#0f172a" : "#64748b"
                      }}
                    >
                      General Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("details")}
                      style={{
                        padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                        background: activeTab === "details" ? "white" : "transparent",
                        boxShadow: activeTab === "details" ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                        color: activeTab === "details" ? "#0f172a" : "#64748b"
                      }}
                    >
                      Descriptions
                    </button>
                  </div>
                </div>

                {/* TAB CONTENT: GENERAL */}
                {activeTab === "general" && (
                  <div className={styles.tabContent}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className={styles.formGroup}>
                        <label>Title</label>
                        <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Category</label>
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                          <option value="">-- Select --</option>
                          {categories.map(c => (
                            <option key={c._id} value={c.slug || c.name.toLowerCase()}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* VARIANT MAPPING DISPLAY */}
                    <div className={styles.formGroup} style={{ marginTop: 20 }}>
                      <label>Linked Stock Variants (Read-only)</label>
                      {(() => {
                        // Find linked stock either by selectedStock (creation) or formData.stock_id (edit)
                        const linkedStockId = selectedStock?._id || formData.stock_id;
                        const linkedStock = stocks.find(s => s._id === linkedStockId);

                        if (!linkedStock) {
                          return <div style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>No stock linked yet.</div>;
                        }

                        return (
                          <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.85rem', marginBottom: 5, fontWeight: 600 }}>
                              Stock: {linkedStock.productName} (Total: {linkedStock.totalStock})
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                              <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                                  <th style={{ padding: 4 }}>Color</th>
                                  <th style={{ padding: 4 }}>Size</th>
                                  <th style={{ padding: 4 }}>Fabric</th>
                                  <th style={{ padding: 4 }}>Qty</th>
                                </tr>
                              </thead>
                              <tbody>
                                {linkedStock.variants && linkedStock.variants.map((v, idx) => (
                                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: 4 }}>
                                      {v.color ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                          <span style={{ width: 12, height: 12, background: v.color, borderRadius: '50%', border: '1px solid #ddd' }}></span>
                                          {v.color}
                                        </span>
                                      ) : '-'}
                                    </td>
                                    <td style={{ padding: 4 }}>{v.size || '-'}</td>
                                    <td style={{ padding: 4 }}>{v.fabric || '-'}</td>
                                    <td style={{ padding: 4 }}>{v.stock}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })()}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Price (֏)</label>
                      <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    </div>

                    {/* IMAGE UPLOADER */}
                    <div className={styles.formGroup} style={{ background: '#fafafa', padding: 15, borderRadius: 8, border: '1px solid #eee', marginTop: 10 }}>
                      <label>Product Images (Max 6)</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                        {formData.images.map((img, i) => (
                          <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                            <img src={`${config.apiHost}${img}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} alt="upload" />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              style={{
                                position: 'absolute', top: -5, right: -5,
                                background: 'red', color: 'white',
                                border: 'none', borderRadius: '50%',
                                width: 20, height: 20, fontSize: 12, cursor: 'pointer'
                              }}
                            >
                              X
                            </button>
                          </div>
                        ))}
                        {formData.images.length < 6 && (
                          <label style={{
                            width: 80, height: 80,
                            border: '2px dashed #ccc',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', borderRadius: 4, color: '#999', fontSize: 24
                          }}>
                            +
                            <input type="file" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: DETAILS */}
                {activeTab === "details" && (
                  <div className={styles.tabContent}>
                    <div className={styles.formGroup}>
                      <label>Description</label>
                      <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        rows="4"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div className={styles.formGroup}>
                        <label>Fit & Fabric</label>
                        <textarea
                          value={formData.fit_fabric}
                          onChange={e => setFormData({ ...formData, fit_fabric: e.target.value })}
                          rows="3"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Returns & Exchanges</label>
                        <textarea
                          value={formData.returns_exchanges}
                          onChange={e => setFormData({ ...formData, returns_exchanges: e.target.value })}
                          rows="3"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Shipping</label>
                        <textarea
                          value={formData.shipping}
                          onChange={e => setFormData({ ...formData, shipping: e.target.value })}
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.modalActions} style={{ borderTop: '1px solid #eee', paddingTop: 20, marginTop: 20 }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className={styles.secondaryButton}>Cancel</button>
                  <button type="submit" className={styles.primaryButton}>
                    {editingId ? "Update Product" : "Create Product"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
