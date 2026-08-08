import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoBusinessOutline, IoChevronBack } from "react-icons/io5";
import { PATHS } from "../../../../routes/paths";
import DepartmentSwitcher from "./DepartmentSwitcher";
// import RoleSwitcher from "./RoleSwitcher";
import styles from "./Header.module.css";

const Header = ({
  role,
  currentDepartment,
  currentRoleView,
  onRoleChange,
  demoPath,
}) => {
  const { t } = useTranslation();

  return (
    <header className={styles.topHeader}>
      <div className={styles.logoArea}>
        <span className={styles.brand}>LinCo</span>
        <span className={styles.company}>.TechCorp</span>
      </div>

      <div className={styles.centerArea}>
        {demoPath && (
          <Link
            to={demoPath}
            className={`${styles.backLink} ${styles.demoBackLink}`}
            aria-label={t("back-to-demo")}
            title={t("back-to-demo")}
          >
            <IoBusinessOutline /> {t("back-to-demo")}
          </Link>
        )}

        <Link to={PATHS.HOME} className={styles.backLink}>
          <IoChevronBack /> Go to my dashboard
        </Link>

        <div className={styles.divider}></div>

        {role === "member" && (
          <DepartmentSwitcher currentDept={currentDepartment} />
        )}

        {role === "admin" && (
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
