import React from "react";
import styles from "./SizeGuidePage.module.css";
import sizeGuideImg from "../../assets/SizeGuide.png";

const SIZE_DATA = [
    { size: "XS", a: 36, b: 28, c: 34, d: 52 },
    { size: "S", a: 38, b: 30, c: 36, d: 54 },
    { size: "M", a: 40, b: 32, c: 38, d: 56 },
    { size: "L", a: 42, b: 34, c: 40, d: 58 },
    { size: "XL", a: 44, b: 36, c: 42, d: 60 },
];

function SizeGuidePage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>SIZE GUIDE</h1>
                <p>Find your perfect fit with our detailed measurement chart.</p>
            </header>

            <div className={styles.content}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>SIZE</th>
                                <th>Λ (A)</th>
                                <th>B (B)</th>
                                <th>C (C)</th>
                                <th>D (D)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SIZE_DATA.map((row) => (
                                <tr key={row.size}>
                                    <td className={styles.sizeName}>{row.size}</td>
                                    <td>{row.a}</td>
                                    <td>{row.b}</td>
                                    <td>{row.c}</td>
                                    <td>{row.d}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.diagramSection}>
                    <h2>HOW TO MEASURE</h2>
                    <div className={styles.diagramWrapper}>
                        <img src={sizeGuideImg} alt="Measurement Diagram" className={styles.diagramImg} />
                    </div>
                    <div className={styles.measureInfo}>
                        <div className={styles.measureItem}>
                            <strong>Λ (A) - CHEST:</strong> Measure across the fullest part of the chest.
                        </div>
                        <div className={styles.measureItem}>
                            <strong>B (B) - WAIST:</strong> Measure across the narrowest part of the waist.
                        </div>
                        <div className={styles.measureItem}>
                            <strong>C (C) - HEM:</strong> Measure across the bottom of the garment.
                        </div>
                        <div className={styles.measureItem}>
                            <strong>D (D) - LENGTH:</strong> Measure from the highest point of the shoulder to the hem.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SizeGuidePage;
