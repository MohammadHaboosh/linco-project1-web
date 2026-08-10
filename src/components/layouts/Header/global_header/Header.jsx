import { Link } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { PATHS } from "../../../../routes/paths";
import DepartmentSwitcher from "./DepartmentSwitcher";
import styles from "./Header.module.css";
import { useDemo } from "../../../../hooks/useDemo";
import { useDepartmentNavigation } from "../../../../hooks/useDepartmentNavigation";

const Header = ({
  role,
  currentDepartment,
  currentRoleView,
  onRoleChange,
  demoPath,
}) => {
  const { demoData, demoId } = useDemo();
  const demoHomePath = demoId ? `/demos/${demoId}` : PATHS.DEMO;
  const { selectedDepartmentName } = useDepartmentNavigation(
    currentDepartment || "Departments",
  );

  return (
    <header className={styles.topHeader}>
      <div className={styles.logoArea}>
        <span className={styles.brand}>LinCo</span>
        <Link to={demoHomePath}>
          <span className={styles.company}>.{demoData?.name || "Demo"}</span>
        </Link>
      </div>

      <div className={styles.centerArea}>
        <Link to={PATHS.HOME} className={styles.backLink}>
          <IoChevronBack /> Go to my dashboard
        </Link>

        {/* {demoPath && (
          <Link
            to={demoPath}
            className={`${styles.backLink} ${styles.demoBackLink}`}
            aria-label={t("back-to-demo")}
            title={t("back-to-demo")}
          >
            <IoBusinessOutline /> {t("back-to-demo")}
          </Link>
        )} */}

        <div className={styles.divider}></div>
        <DepartmentSwitcher currentDepartment={selectedDepartmentName} />
      </div>

      <div className={styles.rightArea}>
        <span className={styles.fullBrand}>Link Company</span>
      </div>
    </header>
  );
};

export default Header;
