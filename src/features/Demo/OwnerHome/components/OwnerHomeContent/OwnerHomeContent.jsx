import { useTranslation } from "react-i18next";
import {
  IoTrendingUp,
  IoPeopleOutline,
  IoBusinessOutline,
  IoBookOutline,
  IoPulseOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { useDemo } from "../../../../../hooks/useDemo";
import styles from "./OwnerHomeContent.module.css";

const StatCard = ({ title, value, icon, trend, trendText, isPositive }) => (
  <div className={styles.statCard}>
    <div className={styles.statHeader}>
      <div className={styles.statInfo}>
        <span className={styles.statTitle}>{title}</span>
        <h3 className={styles.statValue}>{value}</h3>
      </div>
      <div className={styles.statIconBox}>{icon}</div>
    </div>
    <div className={styles.statFooter}>
      <span
        className={`${styles.trendBadge} ${isPositive ? styles.positive : styles.negative}`}
      >
        <IoTrendingUp className={!isPositive ? styles.iconDown : ""} /> {trend}
      </span>
      <span className={styles.trendText}>{trendText}</span>
    </div>
  </div>
);

const OwnerHomeContent = () => {
  const { t } = useTranslation();
  const { demoData } = useDemo();

  const workspaceName = demoData?.name || "Your Workspace";

  const chartData = [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 65 },
    { day: "Wed", value: 85 },
    { day: "Thu", value: 50 },
    { day: "Fri", value: 90 },
    { day: "Sat", value: 30 },
    { day: "Sun", value: 45 },
  ];

  const topDepartments = [
    { id: 1, name: "Front-End", score: 92, members: 15 },
    { id: 2, name: "UI/UX Design", score: 85, members: 8 },
    { id: 3, name: "Back-End", score: 78, members: 12 },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Ahmad Sami",
      action: "published a new course",
      target: "Advanced React",
      time: "2 hours ago",
      type: "course",
    },
    {
      id: 2,
      user: "Sara Majed",
      action: "joined department",
      target: "UI/UX Design",
      time: "5 hours ago",
      type: "user",
    },
    {
      id: 3,
      user: "Omar Nabil",
      action: "completed weekly task in",
      target: "Front-End",
      time: "1 day ago",
      type: "task",
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.welcomeBanner}>
        <div className={styles.bannerContent}>
          <h1 className={styles.greeting}>
            {t("overview-for")}
            <span className={styles.highlight}>{workspaceName}</span>
          </h1>
          <p className={styles.bannerDesc}>
            {t("heres-what-happening-in-your-workspace-today")}
          </p>
        </div>
        <div className={styles.bannerDecoration}>
          <IoPulseOutline className={styles.bgIcon} />
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          title="Total Members"
          value="1,248"
          icon={<IoPeopleOutline />}
          trend="+12%"
          trendText="from last month"
          isPositive={true}
        />
        <StatCard
          title="Active Departments"
          value="8"
          icon={<IoBusinessOutline />}
          trend="+2"
          trendText="new this week"
          isPositive={true}
        />
        <StatCard
          title="Published Courses"
          value="45"
          icon={<IoBookOutline />}
          trend="+5%"
          trendText="from last month"
          isPositive={true}
        />
        <StatCard
          title="Avg. Completion Rate"
          value="68%"
          icon={<IoPulseOutline />}
          trend="-2%"
          trendText="from last week"
          isPositive={false}
        />
      </div>

      <div className={styles.mainLayout}>
        <div className={styles.leftColumn}>
          <div className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <h3>{t("platform-activity")}</h3>
              <select className={styles.dateSelect}>
                <option>{t("this-week")}</option>
                <option>{t("last-week")}</option>
              </select>
            </div>
            <div className={styles.chartArea}>
              {chartData.map((data, index) => (
                <div key={index} className={styles.barWrapper}>
                  <div className={styles.barTooltip}>
                    {data.value} {t("active")}
                  </div>
                  <div className={styles.barBg}>
                    <div
                      className={styles.barFill}
                      style={{ height: `${data.value}%` }}
                    ></div>
                  </div>
                  <span className={styles.barLabel}>{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.departmentsCard}>
            <div className={styles.cardHeader}>
              <h3>{t("top-performing-departments")}</h3>
              <button className={styles.viewAllBtn}>{t("view-all")}</button>
            </div>
            <div className={styles.departmentsList}>
              {topDepartments.map((dept) => (
                <div key={dept.id} className={styles.deptItem}>
                  <div className={styles.deptInfo}>
                    <h4>{dept.name}</h4>
                    <span>
                      {dept.members} {t("members")}
                    </span>
                  </div>
                  <div className={styles.deptProgress}>
                    <div className={styles.progressHeader}>
                      <span>{t("performance-score")}</span>
                      <span className={styles.scoreText}>{dept.score}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${dept.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.activityCard}>
            <div className={styles.cardHeader}>
              <h3>{t("recent-activity")}</h3>
            </div>
            <div className={styles.activityList}>
              {recentActivities.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div
                    className={`${styles.activityIcon} ${styles[activity.type]}`}
                  >
                    {activity.type === "course" ? (
                      <IoBookOutline />
                    ) : activity.type === "user" ? (
                      <IoPeopleOutline />
                    ) : (
                      <IoPulseOutline />
                    )}
                  </div>
                  <div className={styles.activityDetails}>
                    <p className={styles.activityText}>
                      <strong>{activity.user}</strong> {activity.action}{" "}
                      <span className={styles.targetText}>
                        {activity.target}
                      </span>
                    </p>
                    <span className={styles.activityTime}>
                      <IoTimeOutline /> {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.loadMoreBtn}>{t("load-more")}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerHomeContent;
