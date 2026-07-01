import styles from "./LeaderboardPodium.module.css";
import squidIcon from "/public/icons/winner2.png";

const LeaderboardPodium = ({ topThree }) => {
  if (!topThree || topThree.length < 3) return null;

  const podiumOrder = [
    { ...topThree[1], rank: 2 },
    { ...topThree[0], rank: 1 },
    { ...topThree[2], rank: 3 },
  ];

  return (
    <div className={styles.podiumWrapper}>
      {podiumOrder.map((user) => {
        const isFirst = user.rank === 1;

        return (
          <div
            key={user.id}
            className={`${styles.podiumCol} ${styles[`rank${user.rank}`]}`}
          >
            {isFirst && (
              <img
                src={squidIcon}
                alt="Champion"
                className={styles.squidMascot}
              />
            )}

            <div className={styles.medalBadge}>{user.rank}</div>

            <div className={styles.podiumBlock}>
              <span className={styles.rankNumber}>#{user.rank}</span>
            </div>

            <div className={styles.userInfo}>
              <h4
                className={`${styles.userName} ${user.isCurrentUser ? styles.highlightUser : ""}`}
              >
                {user.name}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardPodium;
