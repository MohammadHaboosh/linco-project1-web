import { styles } from "./FooterStyle";

const Footer = () => {
  return (
    <footer className={styles.wrapper}>
      <div className={styles.brandContainer}>
        LinCo LMS
        <span className={styles.copyrightText}>
          © 2026 All rights reserved. Powered by ShamCash.
        </span>
      </div>

      <div className={styles.linksContainer}>
        <a href="#" className={styles.linkItem}>
          Courses Library
        </a>
        <a href="#" className={styles.linkItem}>
          Leaderboard
        </a>
        <a href="#" className={styles.linkItem}>
          FAQs
        </a>
      </div>
    </footer>
  );
};

export default Footer;
