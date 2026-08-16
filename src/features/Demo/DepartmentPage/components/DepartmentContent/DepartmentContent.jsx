import styles from "./DepartmentContent.module.css";
import WelcomeSection from "../sections/WelcomeSection/WelcomeSection";
import LeaderboardSection from "../sections/LeaderboardSection/LeaderboardSection";
import StatsSection from "../sections/StatsSection/StatsSection";
import CoursesSection from "../sections/CourseSection/CoursesSection";
import LivesSection from "../sections/LivesSection/LivesSection";
import { useParams } from "react-router-dom";
import { useLiveStreams } from "../../../Lives/hooks/useLiveStreams";
import { useTranslation } from "react-i18next";
import { useDepartmentNavigation } from "../../../../../hooks/useDepartmentNavigation";

const DepartmentContent = () => {
  const { t, i18n } = useTranslation();
  const { demoId, departmentId } = useParams();
  const {
    streams: liveStreams,
    isLoading: areLivesLoading,
    error: livesError,
    refetch: retryLives,
  } = useLiveStreams({ demoId, departmentId });
  const { selectedDepartmentName } = useDepartmentNavigation(
    t("department-fallback-name"),
  );
  const userName = t("sample-current-user-first-name");
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const getInitials = (name) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => Array.from(part)[0])
      .join("")
      .toLocaleUpperCase(locale);

  const leaderboardData = [
    {
      rank: 1,
      name: t("sample-leader-name-one"),
      points: 1250,
      isCurrentUser: false,
    },
    {
      rank: 2,
      name: t("sample-leader-name-two"),
      points: 1120,
      isCurrentUser: true,
    },
    {
      rank: 3,
      name: t("sample-leader-name-three"),
      points: 980,
      isCurrentUser: false,
    },
  ].map((leader) => ({ ...leader, avatar: getInitials(leader.name) }));

  const statisticsData = {
    activeCourses: { current: 5, total: 15 },
    tasks: { completed: 2, total: 11 },
    certificates: { earned: 6, left: 11 },
  };

  const coursesData = [
    {
      id: 1,
      title: t("sample-course-react-hooks-title"),
      description: t("sample-course-react-hooks-description"),
      progress: 72,
    },
    {
      id: 2,
      title: t("sample-course-node-title"),
      description: t("sample-course-node-description"),
      progress: 45,
    },
  ];

  const livesData = liveStreams
    .filter((stream) => ["LIVE", "SCHEDULED"].includes(stream.status))
    .slice(0, 2);

  return (
    <div className={styles.contentArea} dir={i18n.dir()}>
      <div className={styles["hero-section"]}>
        <div className={styles["hero-content"]}>
          <WelcomeSection
            departmentName={selectedDepartmentName}
            userName={userName}
          />
          <LeaderboardSection leaders={leaderboardData} />
        </div>
        <StatsSection stats={statisticsData} />
      </div>

      <div className={styles["content-section"]}>
        <CoursesSection courses={coursesData} />

        <hr className={styles["section-divider"]} />

        <LivesSection
          lives={livesData}
          isLoading={areLivesLoading}
          error={livesError}
          onRetry={retryLives}
        />
      </div>
    </div>
  );
};

export default DepartmentContent;
