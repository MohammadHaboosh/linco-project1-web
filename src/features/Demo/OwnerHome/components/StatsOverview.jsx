import {
  IoPeopleOutline,
  IoBookOutline,
  IoRibbonOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { StatsOverviewSkeleton } from "./OwnerHomeSkeletons";
import styles from "../OwnerHomeContent.module.css";

const StatCard = ({ title, value, icon, subText, subTextHighlight }) => (
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
      <span className={styles.trendText}>
        <strong className={styles.highlightText}>{subTextHighlight}</strong>{" "}
        {subText}
      </span>
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
  if (!overview) return null;

  return (
    <div className={styles.statsGrid}>
      <StatCard
        title={t("total-members")}
        value={numberFormatter.format(overview.totalMembers)}
        icon={<IoPeopleOutline />}
        subTextHighlight={`+${numberFormatter.format(overview.newMembers)}`}
        subText={t("new-members-recently")}
      />
      <StatCard
        title={t("published-courses")}
        value={numberFormatter.format(overview.publishedCourses)}
        icon={<IoBookOutline />}
        subTextHighlight={numberFormatter.format(overview.totalCourses)}
        subText={t("total-created-courses")}
      />
      <StatCard
        title={t("certifications-issued")}
        value={numberFormatter.format(overview.totalCertifications)}
        icon={<IoRibbonOutline />}
        subTextHighlight={percentFormatter.format(
          overview.certificationRate / 100,
        )}
        subText={t("certification-rate")}
      />
      <StatCard
        title={t("exams-performance")}
        value={percentFormatter.format(overview.examPassRate / 100)}
        icon={<IoCheckmarkDoneOutline />}
        subTextHighlight={`${overview.averageExamScore}%`}
        subText={t("average-exam-score")}
      />
    </div>
  );
};

export default StatsOverview;
