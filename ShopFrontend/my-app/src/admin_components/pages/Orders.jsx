import { useEffect, useState } from "react";
import styles from "../styles/admin.module.css";
import adminApi from "../api/adminApi";
import config from "../../config";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await adminApi.get("/api/orders/");
      setOrders(res.data);
    } catch (err) {
      console.error("FAILED TO LOAD ORDERS:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Change status to "${status}"?`)) return;
    try {
      await adminApi.put(`/api/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return { date: "-", time: "-" };
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return { bg: '#fff7ed', color: '#c2410c' }; // Orange
      case 'confirmed': return { bg: '#dbeafe', color: '#1d4ed8' }; // Blue
      case 'shipped': return { bg: '#f3e8ff', color: '#7e22ce' }; // Purple
      case 'delivered': return { bg: '#dcfce7', color: '#15803d' }; // Green
      case 'cancelled': return { bg: '#fef2f2', color: '#b91c1c' }; // Red
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  if (loading) return <p style={{ padding: 24 }}>Loading orders...</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>{error}</p>;

  return (
    <>
      <div className={styles.pageHeader}>
        <h2>Orders</h2>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 20 }}>No orders found</td></tr>
            ) : orders.map((order) => {
              const { date, time } = formatDate(order.createdAt);
              const statusStyle = getStatusColor(order.status || 'pending');
              const currentStatus = (order.status || 'pending').toLowerCase();

              return (
                <tr key={order._id} style={{ verticalAlign: 'top' }}>
                  <td style={{ minWidth: 100 }}>
                    <div style={{ fontWeight: 600 }}>{date}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{time}</div>
                  </td>
                  <td style={{ minWidth: 150 }}>
                    <div style={{ fontWeight: 500 }}>{order.firstName} {order.lastName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{order.phone || "-"}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 4 }}>
                      {order.city}<br />{order.address} {order.zip}
                    </div>
                    {order.note && (
                      <div style={{ fontSize: '0.75rem', color: '#c2410c', marginTop: 8, padding: '4px 8px', background: '#fff7ed', borderRadius: 4, borderLeft: '2px solid #c2410c' }}>
                        <strong>Note:</strong> {order.note}
                      </div>
                    )}
                  </td>
                  <td style={{ minWidth: 250 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(order.productIds || []).map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {item.image ? (
                            <img src={item.image.startsWith("http") ? item.image : `${config.apiHost}${item.image}`} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} alt="product" />
                          ) : (
                            <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4 }} />
                          )}
                          <div>
                            <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{item.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#666' }}>
                              {item.size && <span>Size: {item.size} </span>}
                              {item.color && <span> | Color: {item.color}</span>}
                              <span style={{ marginLeft: 5 }}>x{item.qty || item.quantity || 1}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#16a34a' }}>
                    ֏ {(order.total / 100).toLocaleString()}
                  </td>
                  <td>
                    <span style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      padding: '4px 10px', borderRadius: 12,
                      fontSize: '0.75rem', fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {currentStatus === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(order._id, 'confirmed')} style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 4, border: '1px solid #16a34a', background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 600 }}>
                            ✓ Approve
                          </button>
                          <button onClick={() => updateStatus(order._id, 'cancelled')} style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 4, border: '1px solid #dc2626', background: '#fee2e2', color: '#991b1b', fontSize: '0.75rem', fontWeight: 600 }}>
                            ✕ Reject
                          </button>
                        </>
                      )}
                      {currentStatus === 'confirmed' && (
                        <button onClick={() => updateStatus(order._id, 'shipped')} style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 4, border: '1px solid #3b82f6', background: '#dbeafe', color: '#1e40af', fontSize: '0.75rem', fontWeight: 600 }}>
                          Mark Shipped
                        </button>
                      )}
                      {currentStatus === 'shipped' && (
                        <button onClick={() => updateStatus(order._id, 'delivered')} style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 4, border: '1px solid #16a34a', background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 600 }}>
                          Mark Delivered
                        </button>
                      )}
                      {(currentStatus === 'delivered' || currentStatus === 'cancelled') && (
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
