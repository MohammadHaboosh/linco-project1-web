import { Link, useLocation } from "react-router-dom";
import styles from "./SubHeader.module.css";

const SubHeader = ({ navLinks }) => {
  const location = useLocation();

  if (!navLinks || !Array.isArray(navLinks) || navLinks.length === 0) {
    console.warn(
      "SubHeader is hidden because navLinks is empty or invalid:",
      navLinks,
    );
    return null;
  }

  return (
    <div className={styles.subHeader}>
      <nav className={styles.navLinks}>
        {navLinks.map((link, index) => (
          <div key={index} className={styles.navItem}>
            <Link
              to={link.path || ""}
              className={`${styles.navLink} ${
                location.pathname.endsWith(link.path) ? styles.active : ""
              }`}
            >
              <span className={styles.icon}>{link.icon}</span>
              {link.name}
            </Link>

            {index < navLinks.length - 1 && (
              <div className={styles.divider}></div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SubHeader;
