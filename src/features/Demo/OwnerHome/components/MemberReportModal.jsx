import { useEffect, useId, useRef } from "react";
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

const getMetric = (value) => {
  const metric = Number(value);
  return Number.isFinite(metric) ? metric : 0;
};

const getPercentage = (value) => Math.min(100, Math.max(0, getMetric(value)));

const getJobTitle = (jobTitle, fallback) => {
  if (Array.isArray(jobTitle)) return jobTitle.find(Boolean) || fallback;
  return jobTitle || fallback;
};

const getRoleKey = (role) =>
  String(role || "member")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replaceAll("_", "-")
    .replaceAll(" ", "-");

const MemberReportModal = ({
  member,
  onClose,
  numberFormatter,
  percentFormatter,
}) => {
  const { t, i18n } = useTranslation();
  const titleId = useId();
  const closeButtonRef = useRef(null);
  const locale = i18n.resolvedLanguage || i18n.language || "en";

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedElement?.focus?.();
    };
  }, [onClose]);

  if (!member) return null;

  const memberName = member.fullName || t("member");
  const joinedAt = new Date(member.joinedAt);
  const hasJoinedDate = !Number.isNaN(joinedAt.getTime());
  const joinedDate = hasJoinedDate
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(joinedAt)
    : null;
  const examAttempts = getMetric(member.examAttempts);
  const examsPassed = getMetric(member.examsPassed);
  const examsFailed = getMetric(member.examsFailed);
  const passRate =
    examAttempts > 0 ? Math.min(1, Math.max(0, examsPassed / examAttempts)) : 0;
  const departments = Array.isArray(member.departments)
    ? member.departments
    : [];
  const roleLabel = t(getRoleKey(member.demoRole), {
    defaultValue: t("member"),
  });

  return (
    <div
      className={styles.modalOverlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={styles.modalContent}
        dir={i18n.dir()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={t("analytics-close-member-report")}
        >
          <IoClose aria-hidden="true" />
        </button>

        <div className={styles.memberProfileHeader}>
          <img
            src={
              member.imagePath || member.avatar || "/images/default-avatar.png"
            }
            alt={t("member-avatar-alt", { name: memberName })}
            className={styles.modalAvatar}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/images/default-avatar.png";
            }}
          />
          <div className={styles.modalUserInfo}>
            <h2 id={titleId}>{memberName}</h2>
            <div className={styles.modalUserTags}>
              <span className={styles.primaryTag}>
                {getJobTitle(member.jobTitle, t("member"))}
              </span>
              <span className={styles.secondaryTag}>{roleLabel}</span>
            </div>
            <div className={styles.modalUserMeta}>
              {member.email && (
                <span>
                  <IoMailOutline aria-hidden="true" />
                  <bdi>{member.email}</bdi>
                </span>
              )}
              <span>
                <IoCalendarOutline aria-hidden="true" />
                {joinedDate
                  ? t("analytics-member-joined-on", { date: joinedDate })
                  : t("analytics-member-join-date-unavailable")}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.modalDepartments}>
          <strong>
            <IoBusinessOutline aria-hidden="true" />
            {t("analytics-member-departments")}
          </strong>
          <div className={styles.deptTagsList}>
            {departments.length > 0 ? (
              departments.map((department, index) => (
                <span
                  key={department.departmentId || `department-${index}`}
                  className={styles.deptTag}
                >
                  {department.departmentName ||
                    t("analytics-unnamed-department")}
                </span>
              ))
            ) : (
              <span className={styles.mutedText}>
                {t("analytics-member-no-departments")}
              </span>
            )}
          </div>
        </div>

        <hr className={styles.modalDivider} />

        <h3 className={styles.sectionTitle}>
          <IoSchoolOutline aria-hidden="true" />
          {t("analytics-academic-performance")}
        </h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              {t("analytics-assigned-courses")}
            </span>
            <span className={styles.metricValue}>
              {numberFormatter.format(getMetric(member.assignedCourses))}
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              {t("analytics-average-score")}
            </span>
            <span className={`${styles.metricValue} ${styles.textLink}`}>
              {percentFormatter.format(
                getPercentage(member.averageScore) / 100,
              )}
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              {t("analytics-highest-score")}
            </span>
            <span className={styles.metricValue}>
              {percentFormatter.format(
                getPercentage(member.highestScore) / 100,
              )}
            </span>
          </div>
          <div className={`${styles.metricCard} ${styles.highlightCardGold}`}>
            <IoRibbonOutline
              className={styles.cardBgIcon}
              aria-hidden="true"
            />
            <span className={styles.metricLabel}>
              {t("analytics-certifications")}
            </span>
            <span className={styles.metricValue}>
              {numberFormatter.format(
                getMetric(member.certificationsEarned),
              )}
            </span>
          </div>
        </div>

        <div className={styles.examStatsWrapper}>
          <div className={styles.examStatItem}>
            <div className={`${styles.examStatIcon} ${styles.mutedIcon}`}>
              <IoBarChartOutline aria-hidden="true" />
            </div>
            <div>
              <p>{t("analytics-total-attempts")}</p>
              <strong>{numberFormatter.format(examAttempts)}</strong>
            </div>
          </div>
          <div className={styles.examStatItem}>
            <div className={`${styles.examStatIcon} ${styles.successIcon}`}>
              <IoCheckmarkCircleOutline aria-hidden="true" />
            </div>
            <div>
              <p>{t("analytics-exams-passed")}</p>
              <strong>{numberFormatter.format(examsPassed)}</strong>
            </div>
          </div>
          <div className={styles.examStatItem}>
            <div className={`${styles.examStatIcon} ${styles.dangerIcon}`}>
              <IoCloseCircleOutline aria-hidden="true" />
            </div>
            <div>
              <p>{t("analytics-exams-failed")}</p>
              <strong>{numberFormatter.format(examsFailed)}</strong>
            </div>
          </div>
          <div className={styles.examStatItem}>
            <div className={styles.examProgressRing} aria-hidden="true">
              <span>{percentFormatter.format(passRate)}</span>
            </div>
            <div>
              <p>{t("analytics-pass-rate")}</p>
              <strong className={styles.srOnly}>
                {percentFormatter.format(passRate)}
              </strong>
            </div>
          </div>
        </div>

        <hr className={styles.modalDivider} />

        <h3 className={styles.sectionTitle}>
          <IoChatbubblesOutline aria-hidden="true" />
          {t("analytics-engagement-activity")}
        </h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <IoHelpCircleOutline
              className={styles.smallIcon}
              aria-hidden="true"
            />
            <span className={styles.metricLabel}>
              {t("analytics-questions-asked")}
            </span>
            <span className={styles.metricValue}>
              {numberFormatter.format(
                getMetric(member.discussionQuestionsCount),
              )}
            </span>
          </div>
          <div className={styles.metricCard}>
            <IoChatbubblesOutline
              className={styles.smallIcon}
              aria-hidden="true"
            />
            <span className={styles.metricLabel}>
              {t("analytics-answers-provided")}
            </span>
            <span className={styles.metricValue}>
              {numberFormatter.format(
                getMetric(member.discussionAnswersCount),
              )}
            </span>
          </div>
          <div className={styles.metricCard}>
            <IoMailOutline className={styles.smallIcon} aria-hidden="true" />
            <span className={styles.metricLabel}>
              {t("analytics-messages-sent")}
            </span>
            <span className={styles.metricValue}>
              {numberFormatter.format(getMetric(member.messagesCount))}
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              {t("analytics-inquiries")}
            </span>
            <span className={styles.metricValue}>
              {numberFormatter.format(getMetric(member.inquiriesCount))}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemberReportModal;
