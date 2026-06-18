import { useState } from "react";
import {
  IoMenu,
  IoSettings,
  IoNotifications,
  IoPersonOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      {/* Top Menu Icon (Clickable to toggle) */}
      <div className={styles["menu-item"]} onClick={toggleSidebar} title="Menu">
        <div className={styles["icon-wrapper"]}>
          <IoMenu className={styles["menu-icon"]} />
        </div>
      </div>

      {/* Center Icons with Dividers */}
      <div className={styles["center-menu"]}>
        <div className={styles["menu-item"]} title="Settings">
          <div className={styles["icon-wrapper"]}>
            <IoSettings className={styles.icon} />
          </div>
          {isOpen && <span className={styles.text}>Settings</span>}
        </div>

        <div className={styles.divider}></div>

        <div className={styles["menu-item"]} title="Notifications">
          <div className={styles["icon-wrapper"]}>
            <IoNotifications className={styles.icon} />
          </div>
          {isOpen && <span className={styles.text}>Notifications</span>}
        </div>

        <div className={styles.divider}></div>

        <div className={styles["menu-item"]} title="Profile">
          <div className={styles["icon-wrapper"]}>
            <IoPersonOutline className={styles.icon} />
          </div>
          {isOpen && <span className={styles.text}>Profile</span>}
        </div>

        <div className={styles.divider}></div>
      </div>

      {/* Bottom Logout Icon */}
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
