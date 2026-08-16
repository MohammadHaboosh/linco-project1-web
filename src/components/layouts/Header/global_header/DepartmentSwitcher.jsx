import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoChevronDown, IoCheckmarkCircle } from "react-icons/io5";
import { useDemo } from "../../../../hooks/useDemo";
import { useDepartmentNavigation } from "../../../../hooks/useDepartmentNavigation";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.css";

const DepartmentSwitcher = ({ currentDepartment }) => {
  const { t } = useTranslation();
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const deptRef = useRef(null);
  const navigate = useNavigate();
  const { demoId } = useDemo();
  const { departmentId } = useParams();
  const { departments, isLoading, error } = useDepartmentNavigation(
    currentDepartment || t("departments"),
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptRef.current && !deptRef.current.contains(event.target)) {
        setIsDeptOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectDepartment = (dept) => {
    setIsDeptOpen(false);

    if (!demoId || !dept?.id) return;

    navigate(`/demos/${demoId}/departments/${dept.id}`);
  };

  return (
    <div className={styles["dept-selector"]} ref={deptRef}>
      <button
        type="button"
        className={styles["room-badge"]}
        onClick={() => setIsDeptOpen((prev) => !prev)}
        aria-label={t("select-department")}
        aria-expanded={isDeptOpen}
        aria-controls="department-switcher-menu"
      >
        <span>
          {currentDepartment ||
            (isLoading ? t("loading-departments") : t("departments"))}
        </span>
        <IoChevronDown
          className={`${styles["dept-arrow"]} ${isDeptOpen ? styles["open"] : ""}`}
          aria-hidden="true"
        />
      </button>

      {isDeptOpen && (
        <div
          id="department-switcher-menu"
          className={styles["dept-dropdown"]}
        >
          <div className={styles["dept-dropdown-header"]}>
            {t("switch-department")}
          </div>
          <div className={styles["dept-list"]}>
            {isLoading ? (
              <div className={styles["dept-item"]} role="status">
                {t("loading-departments")}
              </div>
            ) : error ? (
              <div className={styles["dept-item"]} role="alert">
                {t("departments-navigation-load-failed")}
              </div>
            ) : departments.length === 0 ? (
              <div className={styles["dept-item"]}>
                {t("no-departments-available")}
              </div>
            ) : (
              departments.map((dept) => {
                const isActive = String(dept.id) === String(departmentId);

                return (
                  <button
                    key={dept.id}
                    type="button"
                    className={`${styles["dept-item"]} ${isActive ? styles["active"] : ""}`}
                    onClick={() => handleSelectDepartment(dept)}
                  >
                    <span>{dept.title || dept.name}</span>
                    {isActive && (
                      <IoCheckmarkCircle
                        className={styles["check-icon"]}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentSwitcher;
