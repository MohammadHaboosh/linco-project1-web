import { useTranslation } from "react-i18next";
import styles from "./LeaderboardSection.module.css";

const LeaderboardSection = ({ leaders }) => {
  const { t } = useTranslation();
  return (
    <div className={styles["leaderboard-box"]}>
      <div className={styles["leaderboard-header"]}>
        <h3>{t("companys-leader-board-top-3")}</h3>
      </div>

      <div className={styles["leaderboard-list"]}>
        {leaders.map((user) => (
          <div
            key={user.rank}
            className={`${styles["leader-item"]} ${user.isCurrentUser ? styles.currentUser : ""}`}
          >
            <div className={styles["leader-info"]}>
              <span className={styles.rank}>{user.rank}</span>
              <div className={styles.avatar}>{user.avatar}</div>
              <span className={styles["leader-name"]}>{user.name}</span>
            </div>
            <div className={styles["leader-points"]}>
              <span className={styles["points-badge"]}>{user.points} XP</span>
            </div>
          </div>
        ))}
      </div>

      <button className={styles["view-full-btn"]}>
        {t("view-full-leaderboard")}
      </button>
    </div>
  );
};

export default LeaderboardSection;
