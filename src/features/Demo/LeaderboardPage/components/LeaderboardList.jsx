import styles from "./LeaderboardList.module.css";

const LeaderboardList = ({ allUsers, currentUserId }) => {
  if (!allUsers || allUsers.length === 0) return null;

  return (
    <div className={styles.listWrapper}>
      {allUsers.map((user, index) => {
        const rank = user.rank || index + 1;
        const isMe = user.user?.id === currentUserId;
        const fullName =
          `${user.firstName || ""} ${user.lastName || ""}`.trim();

        return (
          <div
            key={user.demoMemberId}
            className={`${styles.rowCard} ${isMe ? styles.currentUserRow : ""}`}
          >
            <div className={styles.rankCol}>
              <div
                className={`${styles.rankBadge} ${isMe ? styles.badgeMe : ""}`}
              >
                {rank}
              </div>
            </div>

            <div className={styles.nameCol}>
              <span className={styles.nameText}>{fullName}</span>
            </div>

            <div className={styles.roleCol}>{user.jobTitle || "Member"}</div>

            <div className={styles.levelCol}>
              Level {Math.floor((user.totalScore || 0) / 100) + 1}
            </div>

            <div className={styles.xpCol}>
              {(user.totalScore || 0).toLocaleString()} XP
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardList;
