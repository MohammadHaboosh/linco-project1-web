import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PATHS } from "../../../../../../routes/paths";
import styles from "./LeaderboardSection.module.css";

const LeaderboardSection = ({ leaders }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);

  return (
    <section
      className={styles["leaderboard-box"]}
      aria-labelledby="department-leaderboard-title"
    >
      <div className={styles["leaderboard-header"]}>
        <h2 id="department-leaderboard-title">
          {t("companys-leader-board-top-3")}
        </h2>
      </div>

      <div className={styles["leaderboard-list"]}>
        {leaders.map((user) => (
          <div
            key={user.rank}
            className={`${styles["leader-item"]} ${user.isCurrentUser ? styles.currentUser : ""}`}
            aria-current={user.isCurrentUser ? "true" : undefined}
          >
            <div className={styles["leader-info"]}>
              <span className={styles.rank}>
                {numberFormatter.format(user.rank)}
              </span>
              <div className={styles.avatar} aria-hidden="true">
                {user.avatar}
              </div>
              <span className={styles["leader-name"]}>
                {user.isCurrentUser
                  ? t("leaderboard-current-user", { name: user.name })
                  : user.name}
              </span>
            </div>
            <div className={styles["leader-points"]}>
              <span className={styles["points-badge"]}>
                {t("leaderboard-points", {
                  count: user.points,
                  formattedCount: numberFormatter.format(user.points),
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Link className={styles["view-full-btn"]} to={PATHS.LEADERBOARD}>
        {t("view-full-leaderboard")}
      </Link>
    </section>
  );
};

export default LeaderboardSection;
