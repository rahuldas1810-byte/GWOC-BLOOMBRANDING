import React from 'react';
import styles from './Marquee.module.css';

const Marquee = () => {
  const text = "Helping Brands Bloom";
  // Create 8 copies to ensure it covers wide screens
  const repetitions = Array(8).fill(text);

  return (
    <div className={styles.marqueeWrapper}>
      <div className={styles.marqueeTrack}>
        {/* Set 1 */}
        <div className={styles.marqueeContent}>
          {repetitions.map((item, index) => (
            <div key={`set1-${index}`} className={styles.marqueeItem}>
              {item}
              <span className={styles.separator}></span>
            </div>
          ))}
        </div>
        {/* Set 2 (Duplicate for seamless loop) */}
        <div className={styles.marqueeContent}>
          {repetitions.map((item, index) => (
            <div key={`set2-${index}`} className={styles.marqueeItem}>
              {item}
              <span className={styles.separator}></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
