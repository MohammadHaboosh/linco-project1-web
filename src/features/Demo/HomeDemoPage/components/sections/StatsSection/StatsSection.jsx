import styles from "./StatsSection.module.css";

const StatsSection = ({ stats }) => {
  return (
    <div className={styles["stats-row"]}>
      {/* Active Courses */}
      <div className={styles["stat-box"]}>
        <div className={styles["stat-title"]}>Active Courses</div>
        <div className={styles["stat-values"]}>
          <span className={styles.highlight}>
            {stats.activeCourses.current}
          </span>
          <div className={styles.divider}></div>
          <span className={styles.secondary}>
            All
            <br />
            {stats.activeCourses.total}
          </span>
        </div>
      </div>

      {/* Tasks Completed */}
      <div className={styles["stat-box"]}>
        <div className={styles["stat-title"]}>Tasks Completed</div>
        <div className={styles["stat-values"]}>
          <span className={styles.highlight}>{stats.tasks.completed}</span>
          <div className={styles.divider}></div>
          <span className={styles.secondary}>
            NUMBER OF TASKS
            <br />
            YOU FINISHED {stats.tasks.total}
          </span>
        </div>
      </div>

      {/* Certificates Earned */}
      <div className={styles["stat-box"]}>
        <div className={styles["stat-title"]}>Certificates Earned</div>
        <div className={styles["stat-values"]}>
          <span className={styles.highlight}>{stats.certificates.earned}</span>
          <div className={styles.divider}></div>
          <span className={styles.secondary}>
            YOU HAVE ONLY
            <br />
            LEFT {stats.certificates.left}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
