import { Link } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { PATHS } from "../../../../routes/paths";
import DepartmentSwitcher from "./DepartmentSwitcher";
// import RoleSwitcher from "./RoleSwitcher";
import styles from "./Header.module.css";

const Header = ({ role, currentDepartment, currentRoleView, onRoleChange }) => {
  return (
    <header className={styles.topHeader}>
      <div className={styles.logoArea}>
        <span className={styles.brand}>LinCo</span>
        <span className={styles.company}>.TechCorp</span>
      </div>

      <div className={styles.centerArea}>
        <Link to={PATHS.DASHBOARD} className={styles.backLink}>
          <IoChevronBack /> Go to my dashboard
        </Link>

        <div className={styles.divider}></div>

        {role === "trainee" && (
          <DepartmentSwitcher currentDept={currentDepartment} />
        )}

        {role === "sectionManager" && (
          <div className={styles.staticBadge}>{currentDepartment}</div>
        )}

        {role === "owner" && (
          <div></div>
          // <RoleSwitcher currentRole={currentRoleView} onChange={onRoleChange} />
        )}
      </div>

      <div className={styles.rightArea}>
        <span className={styles.fullBrand}>Link Company</span>
      </div>
    </header>
  );
};

export default Header;
