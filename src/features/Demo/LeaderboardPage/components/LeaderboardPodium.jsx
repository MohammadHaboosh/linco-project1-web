import styles from "./LeaderboardPodium.module.css";
import squidIcon from "/public/icons/winner2.webp";
import { useTranslation } from "react-i18next";

const LeaderboardPodium = ({ topThree, currentUserId }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);
  const safeTopThree = [
    topThree[0] || {
      rank: 1,
      totalScore: 0,
      isEmpty: true,
    },
    topThree[1] || {
      rank: 2,
      totalScore: 0,
      isEmpty: true,
    },
    topThree[2] || {
      rank: 3,
      totalScore: 0,
      isEmpty: true,
    },
  ];

  const podiumOrder = [
    { ...safeTopThree[1], podiumPos: 2 },
    { ...safeTopThree[0], podiumPos: 1 },
    { ...safeTopThree[2], podiumPos: 3 },
  ];

  return (
    <ol className={styles.podiumWrapper}>
      {podiumOrder.map((user, index) => {
        const isFirst = user.podiumPos === 1;
        const isMe =
          !user.isEmpty &&
          currentUserId != null &&
          user.user?.id != null &&
          String(user.user?.id) === String(currentUserId);
        const fullName = user.isEmpty
          ? ""
          : `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            t("member");
        const displayName = isMe
          ? t("leaderboard-current-user", { name: fullName })
          : fullName;
        const numericScore = Number(user.totalScore);
        const score = Number.isFinite(numericScore)
          ? Math.max(0, numericScore)
          : 0;
        const formattedRank = numberFormatter.format(user.podiumPos);
        const formattedScore = numberFormatter.format(score);
        const formattedLevel = numberFormatter.format(
          Math.floor(score / 100) + 1,
        );

        return (
          <li
            key={
              user.demoMemberId ||
              user.user?.id ||
              `${user.isEmpty ? "empty" : "podium"}-${index}`
            }
            className={`${styles.podiumCol} ${styles[`rank${user.podiumPos}`]} ${user.isEmpty ? styles.emptySpot : ""}`}
            aria-label={
              user.isEmpty
                ? t("leaderboard-empty-position", {
                    formattedRank,
                  })
                : t("leaderboard-entry-summary", {
                    name: displayName,
                    formattedRank,
                    formattedScore,
                    formattedLevel,
                    count: score,
                  })
            }
          >
            {isFirst && !user.isEmpty && (
              <img
                src={squidIcon}
                alt=""
                className={styles.squidMascot}
                aria-hidden="true"
              />
            )}

            <div className={styles.medalBadge} aria-hidden="true">
              {formattedRank}
            </div>

            <div className={styles.podiumBlock} aria-hidden="true">
              <span className={styles.rankNumber}>#{formattedRank}</span>
            </div>

            <div className={styles.userInfo}>
              <h4
                className={`${styles.userName} ${isMe ? styles.highlightUser : ""}`}
              >
                {user.isEmpty
                  ? t("leaderboard-position-available")
                  : displayName}
              </h4>
              {!user.isEmpty && (
                <span className={styles.scoreText}>
                  {t("leaderboard-points", {
                    count: score,
                    formattedCount: formattedScore,
                  })}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default LeaderboardPodium;
