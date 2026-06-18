import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-grid"]}>
        <div className={styles["footer-col"]}>
          <h4>Quick Links</h4>
          <ul>
            <li>Pending Invitations</li>
            <li>Joined Rooms</li>
            <li>My Own Rooms</li>
          </ul>
        </div>
        <div className={styles["footer-col"]}>
          <h4>Contact Info</h4>
          <ul>
            <li>Damascus, Syria</li>
            <li>contact@linco.com</li>
            <li>+963-XXX-XXXXXX</li>
          </ul>
        </div>
        <div className={styles["footer-col"]}>
          <h4>Legal</h4>
          <ul>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Cookies Policy</li>
          </ul>
        </div>
      </div>
      <div className={styles["footer-bottom"]}>
        &copy; 2024 LinCo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
