import styles from "./LeaderboardList.module.css";
import { useTranslation } from "react-i18next";

const LeaderboardList = ({ allUsers, currentUserId }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);

  if (!allUsers || allUsers.length === 0) return null;

  return (
    <div className={styles.listWrapper}>
      <div className={styles.columnHeader} aria-hidden="true">
        <span>{t("leaderboard-rank-column")}</span>
        <span>{t("leaderboard-member-column")}</span>
        <span>{t("leaderboard-role-column")}</span>
        <span>{t("leaderboard-level-column")}</span>
        <span>{t("leaderboard-points-column")}</span>
      </div>
      <ol className={styles.rankingList} aria-label={t("full-rankings-list")}>
        {allUsers.map((user, index) => {
          const numericRank = Number(user.rank);
          const rank =
            Number.isFinite(numericRank) && numericRank > 0
              ? numericRank
              : index + 1;
          const isMe =
            currentUserId != null &&
            user.user?.id != null &&
            String(user.user.id) === String(currentUserId);
          const fullName =
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            t("member");
          const displayName = isMe
            ? t("leaderboard-current-user", { name: fullName })
            : fullName;
          const numericScore = Number(user.totalScore);
          const score = Number.isFinite(numericScore)
            ? Math.max(0, numericScore)
            : 0;
          const level = Math.floor(score / 100) + 1;
          const formattedRank = numberFormatter.format(rank);
          const formattedScore = numberFormatter.format(score);
          const formattedLevel = numberFormatter.format(level);
          const role = user.jobTitle || t("member");

          return (
            <li
              key={user.demoMemberId || user.user?.id || `rank-${index}`}
              className={`${styles.rowCard} ${isMe ? styles.currentUserRow : ""}`}
              aria-current={isMe ? "true" : undefined}
              aria-label={t("leaderboard-entry-summary", {
                name: displayName,
                formattedRank,
                formattedScore,
                formattedLevel,
                count: score,
              })}
            >
              <div className={styles.rankCol}>
                <div
                  className={`${styles.rankBadge} ${isMe ? styles.badgeMe : ""}`}
                  aria-hidden="true"
                >
                  {formattedRank}
                </div>
              </div>

              <div className={styles.nameCol}>
                <span className={styles.nameText}>{displayName}</span>
              </div>

              <div className={styles.detailsCol}>
                <div className={styles.roleCol}>
                  <span className={styles.mobileLabel}>
                    {t("leaderboard-role-column")}
                  </span>
                  <span className={styles.fieldValue}>{role}</span>
                </div>

                <div className={styles.levelCol}>
                  <span className={styles.mobileLabel}>
                    {t("leaderboard-level-column")}
                  </span>
                  <span className={styles.fieldValue}>
                    {t("leaderboard-level", { formattedLevel })}
                  </span>
                </div>
              </div>

              <div className={styles.xpCol}>
                <span className={styles.mobileLabel}>
                  {t("leaderboard-points-column")}
                </span>
                <span className={styles.fieldValue}>
                  {t("leaderboard-points", {
                    count: score,
                    formattedCount: formattedScore,
                  })}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default LeaderboardList;
