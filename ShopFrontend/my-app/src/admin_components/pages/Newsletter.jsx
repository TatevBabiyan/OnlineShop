import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/admin.module.css";
import config from "../../config";

export default function Newsletter() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const res = await axios.get(`${config.apiHost}/api/newsletter/`);
            setSubscribers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles.pageHeader}>
                <h2>Newsletter Subscribers</h2>
            </div>

            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Subscription Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="2" style={{ padding: 20, textAlign: 'center' }}>Loading...</td></tr>
                        ) : subscribers.length === 0 ? (
                            <tr><td colSpan="2" style={{ padding: 20, textAlign: 'center' }}>No subscribers found.</td></tr>
                        ) : (
                            subscribers.map((sub, idx) => (
                                <tr key={idx}>
                                    <td style={{ fontWeight: 500 }}>{sub.email}</td>
                                    <td>{sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleDateString() : "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
