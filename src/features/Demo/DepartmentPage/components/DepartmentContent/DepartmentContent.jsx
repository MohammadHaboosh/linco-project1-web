import styles from "./DepartmentContent.module.css";
import WelcomeSection from "../sections/WelcomeSection/WelcomeSection";
import LeaderboardSection from "../sections/LeaderboardSection/LeaderboardSection";
import StatsSection from "../sections/StatsSection/StatsSection";
import CoursesSection from "../sections/CourseSection/CoursesSection";
import LivesSection from "../sections/LivesSection/LivesSection";

const DepartmentContent = () => {
  const departmentData = { departmentName: "Front-End", userName: "Abrar" };

  const leaderboardData = [
    {
      rank: 1,
      avatar: "SA",
      name: "Ahmad",
      points: "1,250",
      isCurrentUser: false,
    },
    {
      rank: 2,
      avatar: "AA",
      name: "Abrar A (You)",
      points: "1,120",
      isCurrentUser: true,
    },
    {
      rank: 3,
      avatar: "MK",
      name: "Omar",
      points: "980",
      isCurrentUser: false,
    },
  ];

  const statisticsData = {
    activeCourses: { current: 5, total: 15 },
    tasks: { completed: 2, total: 11 },
    certificates: { earned: 6, left: 11 },
  };

  const coursesData = [
    {
      id: 1,
      title: "Introduction To React Hooks",
      description: "Description text will be here...",
      progress: 72,
    },
    {
      id: 2,
      title: "Advanced Node.js",
      description: "Description text will be here...",
      progress: 45,
    },
  ];

  const livesData = [
    {
      id: 1,
      title: "System Design Basics",
      instructor: "Ahmad Ahmad",
      date: "Apr 04, 2026",
      duration: "48 min",
    },
    {
      id: 2,
      title: "Frontend Architecture",
      instructor: "Sara Omar",
      date: "Apr 05, 2026",
      duration: "60 min",
    },
  ];

  return (
    <div className={styles.contentArea}>
      <div className={styles["hero-section"]}>
        <div className={styles["hero-content"]}>
          <WelcomeSection
            companyName={departmentData.departmentName}
            userName={departmentData.userName}
          />
          <LeaderboardSection leaders={leaderboardData} />
        </div>
        <StatsSection stats={statisticsData} />
      </div>

      <div className={styles["content-section"]}>
        <CoursesSection courses={coursesData} />

        <hr className={styles["section-divider"]} />

        <LivesSection lives={livesData} />
      </div>
    </div>
  );
};

export default DepartmentContent;
