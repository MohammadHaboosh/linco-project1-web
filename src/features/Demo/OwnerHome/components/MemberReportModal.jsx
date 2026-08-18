import { useTranslation } from "react-i18next";
import {
  IoClose,
  IoMailOutline,
  IoCalendarOutline,
  IoRibbonOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoBarChartOutline,
  IoChatbubblesOutline,
  IoHelpCircleOutline,
  IoSchoolOutline,
  IoBusinessOutline,
} from "react-icons/io5";
import styles from "../OwnerHomeContent.module.css";

const MemberReportModal = ({ member, onClose, numberFormatter }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || i18n.language || "en";

  if (!member) return null;

  const joinedDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(member.joinedAt));

  const passRate =
    member.examAttempts > 0
      ? Math.round((member.examsPassed / member.examAttempts) * 100)
      : 0;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        dir={i18n.dir()}
      >
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose />
        </button>

        <div className={styles.memberProfileHeader}>
          <img
            src={
              member.imagePath || member.avatar || "/images/default-avatar.png"
            }
            alt={member.fullName}
            className={styles.modalAvatar}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-avatar.png";
            }}
          />
          <div className={styles.modalUserInfo}>
            <h2>{member.fullName}</h2>
            <div className={styles.modalUserTags}>
              <span className={styles.primaryTag}>
                {member.jobTitle?.[0] || t("member")}
              </span>
              <span className={styles.secondaryTag}>{member.demoRole}</span>
            </div>
            <div className={styles.modalUserMeta}>
              <span>
                <IoMailOutline /> {member.email}
              </span>
              <span>
                <IoCalendarOutline /> {t("joined")} {joinedDate}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.modalDepartments}>
          <strong>
            <IoBusinessOutline /> {t("departments")}:
          </strong>
          <div className={styles.deptTagsList}>
            {member.departments?.length > 0 ? (
              member.departments.map((dept) => (
                <span key={dept.departmentId} className={styles.deptTag}>
                  {dept.departmentName}
                </span>
              ))
            ) : (
              <span className={styles.mutedText}>
                {t("no-departments-yet")}
              </span>
            )}
          </div>
        </div>

        <hr className={styles.modalDivider} />

        <h3 className={styles.sectionTitle}>
          <IoSchoolOutline /> {t("academic-performance")}
        </h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{t("assigned-courses")}</span>
            <span className={styles.metricValue}>
              {numberFormatter.format(member.assignedCourses)}
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{t("average-score")}</span>
            <span className={`${styles.metricValue} ${styles.textLink}`}>
              {member.averageScore}%
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{t("highest-score")}</span>
            <span className={styles.metricValue}>{member.highestScore}%</span>
          </div>
          <div className={`${styles.metricCard} ${styles.highlightCardGold}`}>
            <IoRibbonOutline className={styles.cardBgIcon} />
            <span className={styles.metricLabel}>{t("certifications")}</span>
            <span className={styles.metricValue}>
              {numberFormatter.format(member.certificationsEarned)}
            </span>
          </div>
        </div>

        <div className={styles.examStatsWrapper}>
          <div className={styles.examStatItem}>
            <div
              className={styles.examStatIcon}
              style={{ color: "var(--app-muted)" }}
            >
              <IoBarChartOutline />
            </div>
            <div>
              <p>{t("total-attempts")}</p>
              <strong>{numberFormatter.format(member.examAttempts)}</strong>
            </div>
          </div>
          <div className={styles.examStatItem}>
            <div
              className={styles.examStatIcon}
              style={{ color: "var(--app-success-indicator)" }}
            >
              <IoCheckmarkCircleOutline />
            </div>
            <div>
              <p>{t("exams-passed")}</p>
              <strong>{numberFormatter.format(member.examsPassed)}</strong>
            </div>
          </div>
          <div className={styles.examStatItem}>
            <div
              className={styles.examStatIcon}
              style={{ color: "var(--app-danger-text)" }}
            >
              <IoCloseCircleOutline />
            </div>
            <div>
              <p>{t("exams-failed")}</p>
              <strong>{numberFormatter.format(member.examsFailed)}</strong>
            </div>
          </div>
          <div className={styles.examStatItem}>
            <div className={styles.examProgressRing}>
              <span>{passRate}%</span>
            </div>
            <div>
              <p>{t("pass-rate")}</p>
            </div>
          </div>
        </div>

        <hr className={styles.modalDivider} />

        <h3 className={styles.sectionTitle}>
          <IoChatbubblesOutline /> {t("engagement-activity")}
        </h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <IoHelpCircleOutline className={styles.smallIcon} />
            <span className={styles.metricLabel}>{t("questions-asked")}</span>
            <span className={styles.metricValue}>
              {numberFormatter.format(member.discussionQuestionsCount)}
            </span>
          </div>
          <div className={styles.metricCard}>
            <IoChatbubblesOutline className={styles.smallIcon} />
            <span className={styles.metricLabel}>{t("answers-provided")}</span>
            <span className={styles.metricValue}>
              {numberFormatter.format(member.discussionAnswersCount)}
            </span>
          </div>
          <div className={styles.metricCard}>
            <IoMailOutline className={styles.smallIcon} />
            <span className={styles.metricLabel}>{t("messages-sent")}</span>
            <span className={styles.metricValue}>
              {numberFormatter.format(member.messagesCount)}
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{t("inquiries")}</span>
            <span className={styles.metricValue}>
              {numberFormatter.format(member.inquiriesCount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberReportModal;
