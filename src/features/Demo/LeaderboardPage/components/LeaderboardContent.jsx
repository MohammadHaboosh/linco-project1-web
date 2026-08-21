import LeaderboardPodium from "./LeaderboardPodium";
import LeaderboardList from "./LeaderboardList";
import {
  LeaderboardListSkeleton,
  LeaderboardPodiumSkeleton,
} from "./LeaderboardSkeletons";
import styles from "./LeaderboardContent.module.css";
import { useTranslation } from "react-i18next";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useUser } from "../../../../hooks/useUser";
import Skeleton from "react-loading-skeleton";
import {
  IoAlertCircleOutline,
  IoPeopleOutline,
  IoTrophyOutline,
} from "react-icons/io5";

const LeaderboardContent = () => {
  const { t, i18n } = useTranslation();
  const { profile } = useUser();
  const currentUserId = profile?.id;
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);

  const { leaderboard, isLoading, error, retry } = useLeaderboard();

  const topThree = leaderboard.slice(0, 3);
  const formattedParticipantCount = numberFormatter.format(leaderboard.length);

  return (
    <section
      className={styles.contentArea}
      aria-labelledby="department-leaderboard-title"
      aria-busy={isLoading}
    >
      <div className={styles.headerArea}>
        <span className={styles.subHeading}>{t("workspace-leaderboard")}</span>
        <h1 id="department-leaderboard-title" className={styles.mainHeading}>
          {t("department-leaderboard-title")}
        </h1>
        <p className={styles.headerDescription}>
          {t("department-leaderboard-description")}
        </p>
      </div>

      {error ? (
        <div
          className={`${styles.statePanel} ${styles.errorState}`}
          role="alert"
        >
          <IoAlertCircleOutline aria-hidden="true" />
          <strong>{t("leaderboard-load-failed")}</strong>
          <p>{error || t("leaderboard-load-error-message")}</p>
          <button type="button" onClick={retry}>
            {t("try-again")}
          </button>
        </div>
      ) : leaderboard.length === 0 && !isLoading ? (
        <div className={styles.statePanel} role="status">
          <IoPeopleOutline aria-hidden="true" />
          <strong>{t("leaderboard-empty-title")}</strong>
          <p>{t("leaderboard-empty-description")}</p>
        </div>
      ) : (
        <div className={styles.leaderboardContainer}>
          <section
            className={styles.listSection}
            aria-labelledby="full-rankings-title"
          >
            <div className={styles.listHeader}>
              <h2 id="full-rankings-title">
                {t("leaderboard-full-ranking-title")}
              </h2>
              {isLoading ? (
                <div style={{ opacity: 0.7 }}>
                  <Skeleton width={110} height={32} borderRadius={12} />
                </div>
              ) : (
                <p className={styles.participantCount}>
                  <IoPeopleOutline />
                  {t("leaderboard-participant-count", {
                    count: leaderboard.length,
                    formattedCount: formattedParticipantCount,
                  })}
                </p>
              )}
            </div>

            {isLoading ? (
              <LeaderboardListSkeleton />
            ) : (
              <LeaderboardList
                allUsers={leaderboard}
                currentUserId={currentUserId}
              />
            )}
          </section>

          <section
            className={styles.podiumSection}
            aria-labelledby="top-performers-title"
          >
            <div className={styles.podiumWidget}>
              <div className={styles.widgetHeader}>
                <IoTrophyOutline className={styles.widgetIcon} />
                <h2 id="top-performers-title" className={styles.widgetTitle}>
                  {t("leaderboard-top-performers")}
                </h2>
              </div>

              {isLoading ? (
                <LeaderboardPodiumSkeleton />
              ) : (
                <LeaderboardPodium
                  topThree={topThree}
                  currentUserId={currentUserId}
                />
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default LeaderboardContent;
