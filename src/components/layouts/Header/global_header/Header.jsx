import { Link } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { PATHS } from "../../../../routes/paths";
import DepartmentSwitcher from "./DepartmentSwitcher";
import styles from "./Header.module.css";
import { useDemo } from "../../../../hooks/useDemo";
import { useDepartmentNavigation } from "../../../../hooks/useDepartmentNavigation";
import { useTranslation } from "react-i18next";

const Header = ({ currentDepartment }) => {
  const { t, i18n } = useTranslation();
  const { demoData, demoId } = useDemo();
  const demoHomePath = demoId ? `/demos/${demoId}` : PATHS.DEMO;
  const { selectedDepartmentName } = useDepartmentNavigation(
    currentDepartment || t("departments"),
  );

  return (
    <header className={styles.topHeader} dir={i18n.dir()}>
      <div className={styles.logoArea}>
        <span className={styles.brand}>{t("linco")}</span>
        <Link to={demoHomePath}>
          <span className={styles.company}>
            .{demoData?.name || t("workspace")}
          </span>
        </Link>
      </div>

      <div className={styles.centerArea}>
        <Link to={PATHS.HOME} className={styles.backLink}>
          <IoChevronBack aria-hidden="true" /> {t("go-to-my-dashboard")}
        </Link>

        <div className={styles.divider} aria-hidden="true"></div>
        <DepartmentSwitcher currentDepartment={selectedDepartmentName} />
      </div>

      <div className={styles.rightArea}>
        <span className={styles.fullBrand}>{t("link-company-0")}</span>
      </div>
    </header>
  );
};

export default Header;
