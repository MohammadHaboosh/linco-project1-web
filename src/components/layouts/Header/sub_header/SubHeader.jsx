import { Link, useLocation } from "react-router-dom";
import { HEADER_CONFIG } from "../headerConfig";
import styles from "./SubHeader.module.css";

const SubHeader = ({ role = "trainee" }) => {
  const location = useLocation();

  const subNavLinks = HEADER_CONFIG[role]?.subNavLinks || [];

  if (subNavLinks.length === 0) return null;

  return (
    <div className={styles["workspace-sub-header"]}>
      <nav className={styles["sub-nav-links"]}>
        {subNavLinks.map((link, index) => {
          const isActive = location.pathname === link.path;

          return (
            <div key={index} className={styles["sub-nav-item"]}>
              <Link
                to={link.path}
                className={`${styles["sub-nav-link"]} ${isActive ? styles["active"] : ""}`}
              >
                <span className={styles["sub-nav-icon"]}>{link.icon}</span>
                {link.name}
              </Link>
              {index < subNavLinks.length - 1 && (
                <div className={styles["sub-nav-divider"]}></div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default SubHeader;
