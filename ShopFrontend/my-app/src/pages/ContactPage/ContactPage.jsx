import React from "react";
import styles from "./ContactPage.module.css";

function ContactPage() {
    return (
        <div className={styles.page}>
            <h1 className={styles.header}>CONTACT US</h1>

            <div className={styles.grid}>
                {/* CHAT WITH US / PHONE */}
                <div className={styles.card}>
                    <div className={styles.icon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L22 4z"></path>
                            <polyline points="7 11 12 11 12 12"></polyline>
                        </svg>
                    </div>
                    <h3>CALL OR WHATSAPP</h3>
                    <p className={styles.hours}>Mon-Sun: 9AM - 9PM GMT+4</p>
                    <a href="tel:+37441911994" className={styles.link}>+374 41 911 994</a>
                    <div className={styles.tag}>Fastest Response</div>
                </div>

                {/* EMAIL US */}
                <div className={styles.card}>
                    <div className={styles.icon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </div>
                    <h3>EMAIL US 24/7</h3>
                    <p className={styles.hours}>We'll get back to you within 24 hours.</p>
                    <a href="mailto:yourbasiq@gmail.com" className={styles.link}>yourbasiq@gmail.com</a>
                </div>

                {/* STORE LOCATOR */}
                <div className={styles.card}>
                    <div className={styles.icon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>
                    <h3>VISIT US</h3>
                    <p className={styles.hours}>Tumanyan 12, Yerevan</p>
                    <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Find a Store Near You</a>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
