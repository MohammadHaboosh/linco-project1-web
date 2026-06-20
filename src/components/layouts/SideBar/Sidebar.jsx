import { useState } from "react";
import { Link } from "react-router-dom";
import { IoMenu, IoLogOutOutline } from "react-icons/io5";
import { SIDEBAR_ROLES } from "./sidebarConfig";
import styles from "./Sidebar.module.css";

const Sidebar = ({ role = "trainee" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = SIDEBAR_ROLES[role] || [];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles["menu-item"]} onClick={toggleSidebar} title="Menu">
        <div className={styles["icon-wrapper"]}>
          <IoMenu className={styles["menu-icon"]} />
        </div>
      </div>

      <div className={styles["center-menu"]}>
        {menuItems.map((item, index) => (
          <div key={index}>
            <Link
              to={item.path}
              className={styles["menu-item"]}
              title={item.name}
              style={{ textDecoration: "none" }}
            >
              <div className={styles["icon-wrapper"]}>
                <span className={styles.icon}>{item.icon}</span>
              </div>
              {isOpen && <span className={styles.text}>{item.name}</span>}
            </Link>

            {index < menuItems.length - 1 && (
              <div className={styles.divider}></div>
            )}
          </div>
        ))}
      </div>

      <div
        className={`${styles["sidebar-bottom"]} ${styles["menu-item"]}`}
        title="Log out"
      >
        <div className={styles["icon-wrapper"]}>
          <IoLogOutOutline className={styles.icon} />
        </div>
        {isOpen && <span className={styles.text}>Log out</span>}
      </div>
    </aside>
  );
};

export default Sidebar;
