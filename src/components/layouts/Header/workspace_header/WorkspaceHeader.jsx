import { Link } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import DepartmentSwitcher from "./DepartmentSwitcher";
import { PATHS } from "../../../../routes/paths";
import { COLORS } from "../../../../theme/colors";
import styles from "../global_header/Header.module.css";

const WorkspaceHeader = ({ companyName, roomName, showDeptSwitcher }) => {
  return (
    <header
      className={styles["workspace-top-header"]}
      style={{ background: COLORS.navyGradient }}
    >
      <div className={styles["workspace-logo"]}>
        <span className={styles["brand-name"]}>LinCo</span>{" "}
        <span className={styles["company-name"]}>.{companyName}</span>
      </div>

      <div className={styles["workspace-center"]}>
        <Link to={PATHS.HOME} className={styles["go-dashboard"]}>
          <IoChevronBack /> Go to my dashboard
        </Link>
        <div className={styles["nav-divider"]}></div>

        {showDeptSwitcher ? (
          <DepartmentSwitcher currentRoom={roomName} />
        ) : (
          <div className={styles["room-badge-static"]}>{roomName}</div>
        )}
      </div>

      <div className={styles["workspace-right"]}>
        <span className={styles["brand-name-full"]}>Link Company</span>
      </div>
    </header>
  );
};

export default WorkspaceHeader;
