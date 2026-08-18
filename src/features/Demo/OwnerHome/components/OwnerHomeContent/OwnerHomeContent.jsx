import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  IoTrendingUp,
  IoPeopleOutline,
  IoBusinessOutline,
  IoBookOutline,
  IoPulseOutline,
  IoTimeOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { useDemo } from "../../../../../hooks/useDemo";
import PlanUpgradeCard from "../../../Subscription/components/PlanUpgradeCard/PlanUpgradeCard";
import styles from "./OwnerHomeContent.module.css";

const FREE_PLAN_DURATION_DAYS = 14;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const getFreePlanTimeline = (createdAt) => {
  const createdAtTimestamp = Date.parse(createdAt);

  if (Number.isNaN(createdAtTimestamp)) return null;

  const now = Date.now();
  const expiresAtTimestamp =
    createdAtTimestamp + FREE_PLAN_DURATION_DAYS * MILLISECONDS_PER_DAY;

  return {
    daysElapsed: Math.min(
      FREE_PLAN_DURATION_DAYS,
      Math.max(0, Math.floor((now - createdAtTimestamp) / MILLISECONDS_PER_DAY)),
    ),
    daysRemaining: Math.max(
      0,
      Math.ceil((expiresAtTimestamp - now) / MILLISECONDS_PER_DAY),
    ),
    isExpired: now >= expiresAtTimestamp,
  };
};

const StatCard = ({ title, value, icon, trend, trendText, isPositive }) => (
  <article className={styles.statCard} aria-label={`${title}: ${value}`}>
    <div className={styles.statHeader}>
      <div className={styles.statInfo}>
        <span className={styles.statTitle}>{title}</span>
        <h3 className={styles.statValue}>{value}</h3>
      </div>
      <div className={styles.statIconBox} aria-hidden="true">
        {icon}
      </div>
    </div>
    <div className={styles.statFooter}>
      <span
        className={`${styles.trendBadge} ${isPositive ? styles.positive : styles.negative}`}
      >
        <IoTrendingUp
          className={!isPositive ? styles.iconDown : ""}
          aria-hidden="true"
        />{" "}
        {trend}
      </span>
      <span className={styles.trendText}>{trendText}</span>
    </div>
  </article>
);

const OwnerHomeContent = () => {
  const { t, i18n } = useTranslation();
  const { demoId, demoData } = useDemo();
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale],
  );
  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 0,
      }),
    [locale],
  );
  const signedPercentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 0,
        signDisplay: "always",
      }),
    [locale],
  );
  const signedNumberFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { signDisplay: "always" }),
    [locale],
  );
  const relativeTimeFormatter = useMemo(
    () => new Intl.RelativeTimeFormat(locale, { numeric: "auto" }),
    [locale],
  );

  const workspaceName = demoData?.name || t("your-workspace");
  const currentPlan =
    demoData?.plan ||
    demoData?.subscription?.plan ||
    demoData?.subscriptionPlan ||
    demoData?.tier ||
    "FREE";
  const isFreePlan = String(currentPlan).trim().toUpperCase() === "FREE";
  const freePlanTimeline = getFreePlanTimeline(demoData?.createdAt);

  const chartData = useMemo(() => {
    const weekdayFormatter = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      timeZone: "UTC",
    });
    const values = [40, 65, 85, 50, 90, 30, 45];

    return values.map((value, index) => ({
      day: weekdayFormatter.format(new Date(Date.UTC(2024, 0, index + 1))),
      value,
    }));
  }, [locale]);

  const topDepartments = [
    {
      id: 1,
      name: t("analytics-department-frontend"),
      score: 92,
      members: 15,
    },
    {
      id: 2,
      name: t("analytics-department-ui-ux"),
      score: 85,
      members: 8,
    },
    {
      id: 3,
      name: t("analytics-department-backend"),
      score: 78,
      members: 12,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Ahmad Sami",
      target: t("analytics-course-advanced-react"),
      relativeTime: { value: -2, unit: "hour" },
      messageKey: "analytics-activity-published-course",
      type: "course",
    },
    {
      id: 2,
      user: "Sara Majed",
      target: t("analytics-department-ui-ux"),
      relativeTime: { value: -5, unit: "hour" },
      messageKey: "analytics-activity-joined-department",
      type: "user",
    },
    {
      id: 3,
      user: "Omar Nabil",
      target: t("analytics-department-frontend"),
      relativeTime: { value: -1, unit: "day" },
      messageKey: "analytics-activity-completed-task",
      type: "task",
    },
  ];

  return (
    <div className={styles.pageContainer} dir={i18n.dir()}>
      <div className={styles.welcomeBanner}>
        <div className={styles.bannerContent}>
          <h1 className={styles.greeting}>
            {t("overview-for-workspace", { workspaceName })}
          </h1>
          <p className={styles.bannerDesc}>
            {t("heres-what-happening-in-your-workspace-today")}
          </p>
        </div>
        <div className={styles.bannerDecoration}>
          <IoPulseOutline className={styles.bgIcon} />
        </div>
      </div>

      {isFreePlan && (
        <section
          className={`${styles.freePlanWarning} ${
            freePlanTimeline?.isExpired ? styles.freePlanExpired : ""
          }`}
          role={freePlanTimeline?.isExpired ? "alert" : "status"}
        >
          <div className={styles.warningIcon} aria-hidden="true">
            <IoWarningOutline />
          </div>
          <div className={styles.warningContent}>
            <h2>
              {freePlanTimeline?.isExpired
                ? t("free-plan-expired-title")
                : t("free-plan-warning-title")}
            </h2>
            <p>
              {freePlanTimeline?.isExpired
                ? t("free-plan-expired-description")
                : freePlanTimeline
                  ? t("free-plan-warning-description", {
                      count: freePlanTimeline.daysElapsed,
                      formattedCount: numberFormatter.format(
                        freePlanTimeline.daysElapsed,
                      ),
                      totalDays: numberFormatter.format(
                        FREE_PLAN_DURATION_DAYS,
                      ),
                    })
                  : t("free-plan-warning-generic-description")}
            </p>
          </div>
          <div className={styles.warningActions}>
            {freePlanTimeline && (
              <span className={styles.warningBadge}>
                <IoTimeOutline aria-hidden="true" />
                {freePlanTimeline.isExpired
                  ? t("free-plan-expired-badge")
                  : t("free-plan-days-remaining", {
                      count: freePlanTimeline.daysRemaining,
                      formattedCount: numberFormatter.format(
                        freePlanTimeline.daysRemaining,
                      ),
                    })}
              </span>
            )}
            <PlanUpgradeCard
              demoId={demoId}
              currentPlan={currentPlan}
              triggerOnly
              triggerClassName={styles.warningButton}
            />
          </div>
        </section>
      )}

      <div className={styles.statsGrid}>
        <StatCard
          title={t("analytics-total-members")}
          value={numberFormatter.format(1248)}
          icon={<IoPeopleOutline />}
          trend={signedPercentFormatter.format(0.12)}
          trendText={t("analytics-from-last-month")}
          isPositive={true}
        />
        <StatCard
          title={t("analytics-active-departments")}
          value={numberFormatter.format(8)}
          icon={<IoBusinessOutline />}
          trend={signedNumberFormatter.format(2)}
          trendText={t("analytics-new-this-week")}
          isPositive={true}
        />
        <StatCard
          title={t("analytics-published-courses")}
          value={numberFormatter.format(45)}
          icon={<IoBookOutline />}
          trend={signedPercentFormatter.format(0.05)}
          trendText={t("analytics-from-last-month")}
          isPositive={true}
        />
        <StatCard
          title={t("analytics-average-completion-rate")}
          value={percentFormatter.format(0.68)}
          icon={<IoPulseOutline />}
          trend={signedPercentFormatter.format(-0.02)}
          trendText={t("analytics-from-last-week")}
          isPositive={false}
        />
      </div>

      <div className={styles.mainLayout}>
        <div className={styles.leftColumn}>
          <div className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <h3>{t("platform-activity")}</h3>
              <select
                className={styles.dateSelect}
                aria-label={t("analytics-activity-period")}
              >
                <option>{t("this-week")}</option>
                <option>{t("last-week")}</option>
              </select>
            </div>
            <div
              className={styles.chartArea}
              role="group"
              aria-label={t("analytics-platform-activity-chart")}
            >
              {chartData.map((data, index) => (
                <div
                  key={index}
                  className={styles.barWrapper}
                  role="img"
                  aria-label={t("analytics-activity-bar-label", {
                    day: data.day,
                    value: numberFormatter.format(data.value),
                  })}
                >
                  <div className={styles.barTooltip}>
                    {t("analytics-active-count", {
                      count: data.value,
                      formattedCount: numberFormatter.format(data.value),
                    })}
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
              <button type="button" className={styles.viewAllBtn}>
                {t("view-all")}
              </button>
            </div>
            <div className={styles.departmentsList}>
              {topDepartments.map((dept) => (
                <div key={dept.id} className={styles.deptItem}>
                  <div className={styles.deptInfo}>
                    <h4>{dept.name}</h4>
                    <span>
                      {t("department-member-count", {
                        count: dept.members,
                        formattedCount: numberFormatter.format(dept.members),
                      })}
                    </span>
                  </div>
                  <div className={styles.deptProgress}>
                    <div className={styles.progressHeader}>
                      <span>{t("performance-score")}</span>
                      <span className={styles.scoreText}>
                        {percentFormatter.format(dept.score / 100)}
                      </span>
                    </div>
                    <div
                      className={styles.progressBar}
                      role="progressbar"
                      aria-label={t("department-performance-score", {
                        department: dept.name,
                      })}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={dept.score}
                    >
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
                      {t(activity.messageKey, {
                        user: activity.user,
                        target: activity.target,
                      })}
                    </p>
                    <span className={styles.activityTime}>
                      <IoTimeOutline aria-hidden="true" />{" "}
                      {relativeTimeFormatter.format(
                        activity.relativeTime.value,
                        activity.relativeTime.unit,
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className={styles.loadMoreBtn}>
              {t("load-more")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerHomeContent;
