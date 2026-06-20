import { Link, useLocation } from "react-router-dom";
import { IoChevronBack, IoPersonOutline } from "react-icons/io5";
import styles from "./Header.module.css";
import { HEADER_CONFIG } from "../headerConfig";
import appIconImg from "../../../../assets/images/linco-logo.jpg";

const Header = ({
  role = "global",
  companyName = "CompanyName",
  roomName = "Company Demo",
}) => {
  const location = useLocation();

  if (role !== "global") {
    return (
      <header className={styles["workspace-top-header"]}>
        <div className={styles["workspace-logo"]}>
          <span className={styles["brand-name"]}>LinCo</span>{" "}
          <span className={styles["company-name"]}>.{companyName}</span>
        </div>

        <div className={styles["workspace-center"]}>
          <Link to="/" className={styles["go-dashboard"]}>
            <IoChevronBack /> Go to my dashboard
          </Link>
          <div className={styles["nav-divider"]}></div>
          <div className={styles["room-badge"]}>{roomName}</div>
        </div>

        <div className={styles["workspace-right"]}>
          <span className={styles["brand-name-full"]}>Link Company</span>
        </div>
      </header>
    );
  }

  const globalLinks = HEADER_CONFIG.global.navLinks;

  return (
    <header className={styles.header}>
      <div className={styles["header-left"]}>
        <div className={styles.logo}>
          <span className={styles["brand-name"]}>LinCo</span>{" "}
          <span className={styles["company-text"]}>Link Company.</span>
        </div>
        <div className={styles["user-profile"]}>
          <div className={styles["user-avatar"]}>AA</div>
          <span className={styles["user-name"]}>Abrar Abo Auad</span>
          <div className={styles["dropdown-icon"]}></div>
        </div>
      </div>

      <nav className={styles["nav-links"]}>
        {globalLinks.map((link, index) => (
          <div key={index} className={styles["nav-item-wrapper"]}>
            <Link
              to={link.path}
              className={
                location.pathname === link.path ||
                (index === 0 && location.pathname === "/")
                  ? styles.active
                  : ""
              }
            >
              {link.name}
            </Link>
            {index < globalLinks.length - 1 && (
              <div className={styles["nav-divider"]}></div>
            )}
          </div>
        ))}
      </nav>

      <div className={styles["header-actions"]}>
        <button className={styles["btn-workspace"]}>
          <IoPersonOutline style={{ marginRight: "5px" }} /> Create a Workspace
        </button>
        <div className={styles["app-icon"]}>
          <img
            src={appIconImg}
            alt="App Icon"
            className={styles["app-icon-img"]}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
