import { useTranslation } from "react-i18next";
import { IoRibbonOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import styles from "../OwnerHomeContent.module.css";

const ReportMembersList = ({ members, numberFormatter }) => {
  const { t } = useTranslation();
  if (!members || members.length === 0) return null;

  const topMembers = [...members]
    .sort(
      (a, b) =>
        b.certificationsEarned - a.certificationsEarned ||
        b.examsPassed - a.examsPassed,
    )
    .slice(0, 5);

  return (
    <div className={styles.membersCard}>
      <div className={styles.cardHeader}>
        <h3>{t("top-active-members")}</h3>
      </div>
      <div className={styles.activityList}>
        {topMembers.map((member) => (
          <div key={member.memberId} className={styles.activityItem}>
            <img
              src={
                member.imagePath ||
                member.avatar ||
                "/images/default-avatar.png"
              }
              alt={member.fullName}
              className={styles.memberAvatar}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/default-avatar.png";
              }}
            />

            <div className={styles.activityDetails}>
              <p className={styles.activityText}>
                <strong>{member.fullName}</strong> (
                {member.jobTitle?.[0] || t("member")})
              </p>
              <div className={styles.memberMetrics}>
                <span className={styles.metricBadge}>
                  <IoCheckmarkCircleOutline />{" "}
                  {numberFormatter.format(member.examsPassed)}{" "}
                  {t("exams-passed")}
                </span>
                <span className={styles.metricBadgeGold}>
                  <IoRibbonOutline />{" "}
                  {numberFormatter.format(member.certificationsEarned)}{" "}
                  {t("certifications")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportMembersList;
