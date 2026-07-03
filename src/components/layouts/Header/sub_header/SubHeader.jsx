import { Link, useLocation } from "react-router-dom";
import styles from "./SubHeader.module.css";

const SubHeader = ({ links }) => {
  const location = useLocation();

  // ===================== ( Debugging Logs ) =====================
  console.log("✨ [SubHeader] Received navLinks prop:", links);
  console.log("✨ [SubHeader] Is it an array?", Array.isArray(links));
  // ==============================================================

  if (!links || !Array.isArray(links) || links.length === 0) {
    console.warn("⚠️ [SubHeader] Hidden because links is empty or invalid!");
    return null;
  }
  // if (!links || !Array.isArray(links) || links.length === 0) {
  //   console.warn(
  //     "SubHeader is hidden because links is empty or invalid:",
  //     links,
  //   );
  //   return null;
  // }

  return (
    <div className={styles.subHeader}>
      <nav className={styles.navLinks}>
        {links.map((link, index) => (
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

            {index < links.length - 1 && <div className={styles.divider}></div>}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SubHeader;
