import styles from "./LeaderboardList.module.css";

const LeaderboardList = ({ allUsers }) => {
  return (
    <div className={styles.listWrapper}>
      {allUsers.map((user, index) => {
        const rank = index + 1;
        const isMe = user.isCurrentUser;

        return (
          <div
            key={user.id}
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
              <span className={styles.nameText}>{user.name}</span>
            </div>

            <div className={styles.roleCol}>{user.role}</div>

            <div className={styles.levelCol}>{user.level}</div>

            <div className={styles.xpCol}>{user.xp.toLocaleString()} XP</div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardList;
