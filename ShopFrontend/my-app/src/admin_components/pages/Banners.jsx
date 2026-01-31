import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import styles from "../styles/admin.module.css";

export default function Banners() {
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editing, setEditing] = useState(null);

    const emptyForm = {
        type: "category",
        title: "",
        buttonText: "",
        buttonLink: "",
        image: "",
        price: "",
        linkedProducts: [],
        // For category grid (mapping 3 slots)
        images: ["", "", ""],
        titles: ["", "", ""],
        buttonTexts: ["", "", ""],
        buttonLinks: ["", "", ""]
    };
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        fetchBanners();
        fetchProducts();
    }, []);

    const fetchBanners = () => {
        axios.get(`${config.apiHost}/api/banner/`).then(res => setBanners(res.data));
    };

    const fetchProducts = () => {
        axios.get(`${config.apiHost}/api/products/`).then(res => setProducts(res.data));
    };

    const handleEdit = (b) => {
        setEditing(b._id);
        setForm({
            ...emptyForm,
            ...b,
            images: b.images || ["", "", ""],
            titles: b.titles || ["", "", ""],
            buttonTexts: b.buttonTexts || ["", "", ""],
            buttonLinks: b.buttonLinks || ["", "", ""]
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete banner?")) return;
        axios.delete(`${config.apiHost}/api/banner/${id}`).then(fetchBanners);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = editing
            ? `${config.apiHost}/api/banner/${editing}`
            : `${config.apiHost}/api/banner/`;
        const method = editing ? "put" : "post";

        axios[method](url, form).then(() => {
            setEditing(null);
            setForm(emptyForm);
            fetchBanners();
        });
    };

    const handleImageUpload = async (e, index = null) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append("file", file);
        try {
            const res = await axios.post(`${config.apiHost}/api/upload/image`, fd);
            if (index !== null) {
                const newImgs = [...form.images];
                newImgs[index] = res.data.url;
                setForm({ ...form, images: newImgs });
            } else {
                setForm({ ...form, image: res.data.url });
            }
        } catch (err) {
            alert("Upload failed");
        }
    };

    const toggleProductSelection = (id) => {
        const current = form.linkedProducts || [];
        if (current.includes(id)) {
            setForm({ ...form, linkedProducts: current.filter(p => p !== id) });
        } else {
            setForm({ ...form, linkedProducts: [...current, id] });
        }
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.adminPage}>
            <h2>Banner Management</h2>

            <div className={styles.bannerGrid}>
                {banners.map(b => (
                    <div key={b._id} className={styles.bannerCard} style={{ border: '1px solid #eee', padding: 15, marginBottom: 10 }}>
                        <strong>{b.type.toUpperCase()}</strong>: {b.title || "No Title"}
                        <div style={{ marginTop: 10 }}>
                            <button onClick={() => handleEdit(b)}>Edit</button>
                            <button onClick={() => handleDelete(b._id)} style={{ marginLeft: 10, color: 'red' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <hr style={{ margin: '40px 0' }} />

            <form onSubmit={handleSubmit} className={styles.adminForm} style={{ maxWidth: 800 }}>
                <h3>{editing ? "Edit Banner" : "Create New Banner"}</h3>

                <div className={styles.formGroup}>
                    <label>Banner Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="category">Category Grid (3 Images)</option>
                        <option value="look">Shop The Look (ALL Products Slider)</option>
                    </select>
                </div>

                {form.type === "look" ? (
                    <>
                        <div className={styles.formGroup}>
                            <label>Section Title (e.g. SHOP THE LOOK)</label>
                            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Sub-title / Price Label (e.g. SETS)</label>
                            <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Main Background Image</label>
                            {form.image && <img src={`${config.apiHost}${form.image}`} alt="Main Preview" style={{ width: 100, display: 'block', marginBottom: 10 }} />}
                            <input type="file" onChange={handleImageUpload} />
                        </div>

                        <div className={styles.formGroup} style={{ marginTop: 20 }}>
                            <label>Linked Products (Select multiple)</label>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>Leave empty to show ALL products by default.</p>

                            <input
                                placeholder="Filter products..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ marginBottom: 10, padding: 8, width: '100%' }}
                            />

                            <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ddd', padding: 10 }}>
                                {filteredProducts.map(p => (
                                    <div key={p._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                                        <input
                                            type="checkbox"
                                            checked={(form.linkedProducts || []).includes(p._id)}
                                            onChange={() => toggleProductSelection(p._id)}
                                        />
                                        <span style={{ marginLeft: 10 }}>{p.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.categoryGridForm}>
                        {[0, 1, 2].map(i => (
                            <div key={i} style={{ border: '1px solid #eee', padding: 15, marginBottom: 15 }}>
                                <h4>Slot {i + 1}</h4>
                                <div className={styles.formGroup}>
                                    <label>Title</label>
                                    <input value={form.titles[i]} onChange={e => {
                                        const newTitles = [...form.titles];
                                        newTitles[i] = e.target.value;
                                        setForm({ ...form, titles: newTitles });
                                    }} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Image</label>
                                    {form.images[i] && <img src={`${config.apiHost}${form.images[i]}`} alt={`Preview ${i + 1}`} style={{ width: 100, display: 'block', marginBottom: 10 }} />}
                                    <input type="file" onChange={(e) => handleImageUpload(e, i)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Button Text</label>
                                    <input value={form.buttonTexts[i]} onChange={e => {
                                        const newBtnTexts = [...form.buttonTexts];
                                        newBtnTexts[i] = e.target.value;
                                        setForm({ ...form, buttonTexts: newBtnTexts });
                                    }} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Link (e.g. /c/dresses)</label>
                                    <input value={form.buttonLinks[i]} onChange={e => {
                                        const newLinks = [...form.buttonLinks];
                                        newLinks[i] = e.target.value;
                                        setForm({ ...form, buttonLinks: newLinks });
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.formActions} style={{ marginTop: 20 }}>
                    <button type="submit" className={styles.primaryButton}>
                        {editing ? "Update Banner" : "Create Banner"}
                    </button>
                    {editing && (
                        <button type="button" onClick={() => { setEditing(null); setForm(emptyForm); }} style={{ marginLeft: 10 }}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
