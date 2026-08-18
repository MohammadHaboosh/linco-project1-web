import {
  IoPeopleOutline,
  IoBookOutline,
  IoRibbonOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { StatsOverviewSkeleton } from "./OwnerHomeSkeletons";
import styles from "../OwnerHomeContent.module.css";

const getMetric = (value) => {
  const metric = Number(value);
  return Number.isFinite(metric) ? metric : 0;
};

const StatCard = ({ title, value, icon, summary }) => (
  <article className={styles.statCard}>
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
      <p className={styles.trendText}>{summary}</p>
    </div>
  </article>
);

const StatsOverview = ({
  overview,
  numberFormatter,
  percentFormatter,
  isLoading,
}) => {
  const { t } = useTranslation();
  if (isLoading) return <StatsOverviewSkeleton />;

  const safeOverview = overview || {};
  const totalMembers = getMetric(safeOverview.totalMembers);
  const newMembers = getMetric(safeOverview.newMembers);
  const publishedCourses = getMetric(safeOverview.publishedCourses);
  const totalCourses = getMetric(safeOverview.totalCourses);
  const totalCertifications = getMetric(safeOverview.totalCertifications);
  const certificationRate = getMetric(safeOverview.certificationRate);
  const examPassRate = getMetric(safeOverview.examPassRate);
  const averageExamScore = getMetric(safeOverview.averageExamScore);

  return (
    <div className={styles.statsGrid}>
      <StatCard
        title={t("analytics-total-members")}
        value={numberFormatter.format(totalMembers)}
        icon={<IoPeopleOutline />}
        summary={t("analytics-new-members-summary", {
          count: newMembers,
          formattedCount: numberFormatter.format(newMembers),
        })}
      />
      <StatCard
        title={t("analytics-published-courses")}
        value={numberFormatter.format(publishedCourses)}
        icon={<IoBookOutline />}
        summary={t("analytics-total-courses-summary", {
          count: totalCourses,
          formattedCount: numberFormatter.format(totalCourses),
        })}
      />
      <StatCard
        title={t("analytics-certifications-issued")}
        value={numberFormatter.format(totalCertifications)}
        icon={<IoRibbonOutline />}
        summary={t("analytics-certification-rate-summary", {
          formattedRate: percentFormatter.format(certificationRate / 100),
        })}
      />
      <StatCard
        title={t("analytics-exam-pass-rate")}
        value={percentFormatter.format(examPassRate / 100)}
        icon={<IoCheckmarkDoneOutline />}
        summary={t("analytics-average-exam-score-summary", {
          formattedScore: percentFormatter.format(averageExamScore / 100),
        })}
      />
    </div>
  );
};

export default StatsOverview;
