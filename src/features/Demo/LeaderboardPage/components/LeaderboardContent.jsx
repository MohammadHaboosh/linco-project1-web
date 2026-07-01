import { useState } from "react";
import LeaderboardPodium from "./LeaderboardPodium";
import LeaderboardList from "./LeaderboardList";
import styles from "./LeaderboardContent.module.css";

const mockLeaderboard = [
  {
    id: 1,
    name: "Lina H.",
    role: "Front-End Developer",
    level: "Senior",
    xp: 2490,
    avatar: "/images/avatar4.jpg",
  },
  {
    id: 2,
    name: "Ahmad Ahmad",
    role: "Front-End Developer",
    level: "Senior",
    xp: 2400,
    avatar: "/images/avatar1.jpg",
  },
  {
    id: 3,
    name: "Abrar (You)",
    role: "Front-End Developer",
    level: "Senior",
    xp: 2350,
    avatar: "/images/avatar2.jpg",
    isCurrentUser: true,
  },
  {
    id: 4,
    name: "Omar Nabil",
    role: "Front-End Developer",
    level: "Mid-Level",
    xp: 2200,
    avatar: "/images/avatar3.jpg",
  },
  {
    id: 5,
    name: "Tarek Ziad",
    role: "Front-End Developer",
    level: "Junior",
    xp: 2100,
    avatar: "/images/avatar5.jpg",
  },
  {
    id: 6,
    name: "Nour Samer",
    role: "Front-End Developer",
    level: "Junior",
    xp: 2050,
    avatar: "/images/avatar6.jpg",
  },
];

const LeaderboardContent = () => {
  const [activeTab, setActiveTab] = useState("weekly");

  const topThree = mockLeaderboard.slice(0, 3);
  const restOfUsers = mockLeaderboard.slice(3);

  return (
    <div className={styles.contentArea}>
      <div className={styles.headerArea}>
        <span className={styles.subHeading}>COMPANY LEADERBOARD</span>
        <h1 className={styles.mainHeading}>Weekly Tasks Leaderboard</h1>
      </div>

      <div className={styles.leaderboardContainer}>
        <LeaderboardPodium topThree={topThree} />

        <div className={styles.listHeader}>
          <h2>Company Leaderboard</h2>
        </div>

        <LeaderboardList allUsers={mockLeaderboard} />
      </div>
    </div>
  );
};

export default LeaderboardContent;
