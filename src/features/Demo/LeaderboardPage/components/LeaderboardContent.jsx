import { useState } from "react";
import LeaderboardPodium from "./LeaderboardPodium";
import LeaderboardList from "./LeaderboardList";
import styles from "./LeaderboardContent.module.css";
import { useTranslation } from "react-i18next";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useUser } from "../../../../hooks/useUser";

const LeaderboardContent = () => {
  const { t } = useTranslation();
  const { profile } = useUser();
  const currentUserId = profile?.id;

  const { leaderboard, isLoading, error } = useLeaderboard();

  const [activeTab, setActiveTab] = useState("all-time");

  const topThree = leaderboard.slice(0, 3);
  const restOfUsers = leaderboard.slice(3);

  if (isLoading) {
    return (
      <div
        className={styles.contentArea}
        style={{ textAlign: "center", padding: "50px" }}
      >
        {t("loading", "Loading...")}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={styles.contentArea}
        style={{ color: "red", textAlign: "center" }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className={styles.contentArea}>
      <div className={styles.headerArea}>
        <span className={styles.subHeading}>{t("company-leaderboard-0")}</span>
        <h1 className={styles.mainHeading}>
          {t("department-tasks-leaderboard", "Department Leaderboard")}
        </h1>
      </div>

      <div className={styles.leaderboardContainer}>
        <LeaderboardPodium topThree={topThree} currentUserId={currentUserId} />

        <div className={styles.listHeader}>
          <h2>{t("company-leaderboard")}</h2>
        </div>

        <LeaderboardList allUsers={leaderboard} currentUserId={currentUserId} />
      </div>
    </div>
  );
};

export default LeaderboardContent;
