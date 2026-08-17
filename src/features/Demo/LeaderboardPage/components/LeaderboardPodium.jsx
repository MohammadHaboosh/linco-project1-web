import styles from "./LeaderboardPodium.module.css";
import squidIcon from "/public/icons/winner2.png";

const LeaderboardPodium = ({ topThree, currentUserId }) => {
  const safeTopThree = [
    topThree[0] || {
      rank: 1,
      firstName: "_",
      lastName: "",
      totalScore: 0,
      isEmpty: true,
    },
    topThree[1] || {
      rank: 2,
      firstName: "_",
      lastName: "",
      totalScore: 0,
      isEmpty: true,
    },
    topThree[2] || {
      rank: 3,
      firstName: "_",
      lastName: "",
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
    <div className={styles.podiumWrapper}>
      {podiumOrder.map((user, index) => {
        const isFirst = user.podiumPos === 1;
        const isMe = !user.isEmpty && user.user?.id === currentUserId;
        const fullName = user.isEmpty
          ? "_"
          : `${user.firstName || ""} ${user.lastName || ""}`.trim();

        return (
          <div
            key={user.demoMemberId || `empty-${index}`}
            className={`${styles.podiumCol} ${styles[`rank${user.podiumPos}`]} ${user.isEmpty ? styles.emptySpot : ""}`}
          >
            {isFirst && !user.isEmpty && (
              <img
                src={squidIcon}
                alt="Champion"
                className={styles.squidMascot}
              />
            )}

            <div className={styles.medalBadge}>{user.podiumPos}</div>

            <div className={styles.podiumBlock}>
              <span className={styles.rankNumber}>#{user.podiumPos}</span>
            </div>

            <div className={styles.userInfo}>
              <h4
                className={`${styles.userName} ${isMe ? styles.highlightUser : ""}`}
              >
                {fullName}
              </h4>
              {!user.isEmpty && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#64748b",
                    fontWeight: "bold",
                  }}
                >
                  {user.totalScore} XP
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardPodium;
