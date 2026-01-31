import React from "react";
import styles from "./ShippingReturnsPage.module.css";

function ShippingReturnsPage() {
    return (
        <div className={styles.page}>
            <h1 className={styles.header}>SHIPPING & RETURNS</h1>

            <div className={styles.iconGrid}>
                {/* RETURN POLICY */}
                <div className={styles.card}>
                    <div className={styles.icon}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8e735b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <h3>RETURN POLICY</h3>
                    <p>Return is available within 14 days for standard sizes. Please note that XL size is not valid for return.</p>
                </div>

                {/* GUIDELINES */}
                <div className={styles.card}>
                    <div className={styles.icon}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8e735b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                    </div>
                    <h3>VALID RETURNS</h3>
                    <p>Items must be in original condition, unworn, unwashed, with tags attached. Custom sized orders are valid only for changes.</p>
                </div>

                {/* PROCESSING */}
                <div className={styles.card}>
                    <div className={styles.icon}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8e735b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                            <circle cx="12" cy="12" r="2"></circle>
                            <path d="M6 12h.01M18 12h.01"></path>
                        </svg>
                    </div>
                    <h3>REFUNDS & PROCESSING</h3>
                    <p>Once received and inspected, we will process your return. Store pickup is free at our Tumanyan 12 location.</p>
                </div>
            </div>

            <div className={styles.detailSection}>
                <h2>ADDITIONAL INFORMATION</h2>
                <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                        <h4>Standard Sizes</h4>
                        <p>We accept returns for all standard sizes (XS-L) within the 14-day window.</p>
                    </div>
                    <div className={styles.detailItem}>
                        <h4>Excluded Items</h4>
                        <p>Due to the limited nature of our collections, XL sizes and custom-fit pieces are non-returnable but eligible for alterations or size changes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShippingReturnsPage;
