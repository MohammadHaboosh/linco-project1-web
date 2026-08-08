import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoMenu,
  IoLogOutOutline,
  IoClose,
  IoMoonOutline,
} from "react-icons/io5";
import { SIDEBAR_CONFIG } from "./sidebarConfig";
import LanguageSwitcher from "../../common/LanguageSwitcher";
import { useHeader } from "../Header/hooks/useHeader.jsx";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { handleLogout } = useHeader();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const menuItems = SIDEBAR_CONFIG;

  return (
    <>
      <div className={styles["floating-btn"]} onClick={toggleSidebar}>
        <IoMenu className={styles["menu-icon"]} />
      </div>

      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles["top-section"]}>
          <span className={styles["brand-logo"]}>LinCo.</span>
          <div className={styles["close-btn"]} onClick={toggleSidebar}>
            <IoClose className={styles["close-icon"]} />
          </div>
        </div>

        <div className={styles["center-menu"]}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={index} className={styles["menu-item-container"]}>
                <Link
                  to={item.path}
                  className={`${styles["menu-item"]} ${isActive ? styles.active : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={styles["icon-wrapper"]}>
                    <span className={styles.icon}>{item.icon}</span>
                  </div>
                  <span className={styles.text}>
                    {t(item.translationKey, item.name)}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        <div className={styles["bottom-section"]}>
          <div className={styles["sidebar-actions"]}>
            <LanguageSwitcher />
            <button
              type="button"
              className={styles["action-btn"]}
              title={t("theme", "Theme")}
              aria-label={t("theme", "Theme")}
            >
              <IoMoonOutline />
            </button>
          </div>

          <button
            type="button"
            className={`${styles["menu-item"]} ${styles["logout-item"]}`}
            onClick={handleLogout}
          >
            <div className={styles["icon-wrapper"]}>
              <IoLogOutOutline className={styles.icon} />
            </div>
            <span className={styles.text}>{t("sign-out", "Sign out")}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
