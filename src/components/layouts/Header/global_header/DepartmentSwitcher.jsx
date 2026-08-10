import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoChevronDown, IoCheckmarkCircle } from "react-icons/io5";
import { useDemo } from "../../../../hooks/useDemo";
import { useDepartmentNavigation } from "../../../../hooks/useDepartmentNavigation";
import styles from "./Header.module.css";

const DepartmentSwitcher = ({ currentDepartment }) => {
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const deptRef = useRef(null);
  const navigate = useNavigate();
  const { demoId } = useDemo();
  const { departmentId } = useParams();
  const { departments, isLoading } = useDepartmentNavigation(
    currentDepartment || "Departments",
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
      >
        <span>
          {currentDepartment ||
            (isLoading ? "Loading departments..." : "Departments")}
        </span>
        <IoChevronDown
          className={`${styles["dept-arrow"]} ${isDeptOpen ? styles["open"] : ""}`}
        />
      </button>

      {isDeptOpen && (
        <div className={styles["dept-dropdown"]}>
          <div className={styles["dept-dropdown-header"]}>
            Switch Department
          </div>
          <div className={styles["dept-list"]}>
            {isLoading ? (
              <div className={styles["dept-item"]}>Loading departments...</div>
            ) : departments.length === 0 ? (
              <div className={styles["dept-item"]}>
                No departments available
              </div>
            ) : (
              departments.map((dept) => {
                const isActive = dept.id === departmentId;

                return (
                  <button
                    key={dept.id}
                    type="button"
                    className={`${styles["dept-item"]} ${isActive ? styles["active"] : ""}`}
                    onClick={() => handleSelectDepartment(dept)}
                  >
                    <span>{dept.title || dept.name}</span>
                    {isActive && (
                      <IoCheckmarkCircle className={styles["check-icon"]} />
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
