import { useState, useRef, useEffect } from "react";
import { IoChevronDown, IoCheckmarkCircle } from "react-icons/io5";
import styles from "../global_header/Header.module.css";

const DepartmentSwitcher = ({ currentRoom }) => {
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const deptRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptRef.current && !deptRef.current.contains(event.target)) {
        setIsDeptOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableDepartments = [
    { id: 1, name: "Front-End Dept", active: true },
    { id: 2, name: "Back-End Dept", active: false },
    { id: 3, name: "UI/UX Design", active: false },
  ];

  return (
    <div className={styles["dept-selector"]} ref={deptRef}>
      <div
        className={styles["room-badge"]}
        onClick={() => setIsDeptOpen(!isDeptOpen)}
      >
        {currentRoom}
        <IoChevronDown
          className={`${styles["dept-arrow"]} ${isDeptOpen ? styles["open"] : ""}`}
        />
      </div>

      {isDeptOpen && (
        <div className={styles["dept-dropdown"]}>
          <div className={styles["dept-dropdown-header"]}>
            Switch Department
          </div>
          <div className={styles["dept-list"]}>
            {availableDepartments.map((dept) => (
              <div
                key={dept.id}
                className={`${styles["dept-item"]} ${dept.active ? styles["active"] : ""}`}
                onClick={() => setIsDeptOpen(false)}
              >
                <span>{dept.name}</span>
                {dept.active && (
                  <IoCheckmarkCircle className={styles["check-icon"]} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentSwitcher;
