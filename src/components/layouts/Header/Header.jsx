import styles from "./Header.module.css";
import appIconImg from "../../../assets/images/linco-logo.jpg";

const Header = () => {
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
        <a href="#" className={styles.active}>
          Home
        </a>
        <div className={styles["nav-divider"]}></div>
        <a href="#">Pending Invitations</a>
        <div className={styles["nav-divider"]}></div>
        <a href="#">Joined Rooms</a>
        <div className={styles["nav-divider"]}></div>
        <a href="#">My Own Rooms</a>
        <div className={styles["nav-divider"]}></div>
        <a href="#">My Profile</a>
      </nav>

      <div className={styles["header-actions"]}>
        <button className={styles["btn-workspace"]}>Create a Workspace</button>
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
