import React, { useState } from "react";
import styles from "./FAQPage.module.css";

const FAQ_DATA = [
    {
        category: "Shipping",
        questions: [
            {
                q: "What are your shipping options?",
                a: "We offer standard shipping (1-3 business days) via HayPost and store pickup at our Tumanyan 12 location."
            },
            {
                q: "Do you ship internationally?",
                a: "Currently, we primary focus on local delivery, but please contact us for international shipping inquiries."
            }
        ]
    },
    {
        category: "Orders",
        questions: [
            {
                q: "How can I track my order?",
                a: "Once your order is processed, we will contact you via the phone number or email provided with tracking details."
            },
            {
                q: "Can I cancel or change my order?",
                a: "Orders can be modified within 1 hour of placement. Please contact us immediately if you need to make changes."
            }
        ]
    },
    {
        category: "Returns & Exchanges",
        questions: [
            {
                q: "What is your return policy?",
                a: "We accept returns within 14 days of delivery. Items must be in original condition with tags attached."
            },
            {
                q: "How do I start an exchange?",
                a: "To start an exchange, please visit our store or contact our customer support team."
            }
        ]
    },
    {
        category: "Product & Stock",
        questions: [
            {
                q: "How do I know my size?",
                a: "Please refer to our Size Guide for detailed measurements and fit recommendations."
            },
            {
                q: "Will you restock sold-out items?",
                a: "We frequently restock our best sellers. Sign up for our newsletter to be notified of restocks."
            }
        ]
    }
];

function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>FAQS</h1>
                <p>How can we help you?</p>
            </header>

            <div className={styles.content}>
                {FAQ_DATA.map((cat, catIdx) => (
                    <div key={catIdx} className={styles.section}>
                        <h2 className={styles.catTitle}>{cat.category}</h2>
                        {cat.questions.map((item, qIdx) => {
                            const globalIdx = `${catIdx}-${qIdx}`;
                            const isOpen = openIndex === globalIdx;
                            return (
                                <div key={qIdx} className={styles.faqItem}>
                                    <button className={styles.question} onClick={() => toggle(globalIdx)}>
                                        <span>{item.q}</span>
                                        <span className={styles.icon}>{isOpen ? "−" : "+"}</span>
                                    </button>
                                    <div className={`${styles.answer} ${isOpen ? styles.open : ""}`}>
                                        <p>{item.a}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FAQPage;
