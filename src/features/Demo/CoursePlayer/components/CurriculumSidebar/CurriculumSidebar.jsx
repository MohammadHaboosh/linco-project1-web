import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import styles from "./CurriculumSidebar.module.css";
import {
  IoAlertCircleOutline,
  IoChevronDown,
  IoPlay,
  IoRibbonOutline,
  IoTimeOutline,
  IoTrophyOutline,
  IoClose,
} from "react-icons/io5";
import { useCourseSections } from "../../hooks/useCourseSections";
import { useSectionLessons } from "../../hooks/useSectionLessons";
import { useTranslation } from "react-i18next";
import { useCertificates } from "../../../Certificates/hooks/useCertificates";
import CertificateCard from "../../../Certificates/components/CertificateCard";
import { useAppAlert } from "../../../../../components/common/AppAlerts/useAppAlert";

const formatVideoDuration = (totalSeconds) => {
  if (!totalSeconds || isNaN(totalSeconds)) return "00:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const SectionItem = ({ section, index, activeLesson, onSelectLesson }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { lessons, isLoading, error } = useSectionLessons(
    section.id,
    isExpanded,
  );
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);
  const sectionNumberFormatter = new Intl.NumberFormat(locale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const lessonListId = `course-section-${section.id}-lessons`;

  return (
    <section
      className={`${styles.chapterCard} ${isExpanded ? styles.expanded : ""}`}
    >
      <button
        type="button"
        className={styles.chapterHeader}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        aria-expanded={isExpanded}
        aria-controls={lessonListId}
      >
        <span className={styles.chapterNumber} aria-hidden="true">
          {sectionNumberFormatter.format(index + 1)}
        </span>
        <span className={styles.chapterInfo}>
          <strong>{section.title}</strong>
        </span>
        <IoChevronDown className={styles.chevron} aria-hidden="true" />
      </button>

      {isExpanded && (
        <div className={styles.lessonList} id={lessonListId}>
          {isLoading ? (
            <div
              className={styles.statusContainer}
              role="status"
              aria-live="polite"
            >
              <div className={styles.loader} aria-hidden="true" />
              <p>{t("loading-lessons")}</p>
            </div>
          ) : error ? (
            <div className={styles.statusContainer} role="alert">
              <IoAlertCircleOutline
                className={styles.statusErrorIcon}
                aria-hidden="true"
              />
              <p className={styles.errorText}>
                {error || t("course-player-section-content-load-failed")}
              </p>
            </div>
          ) : lessons.length === 0 ? (
            <div className={styles.statusContainer} role="status">
              <p>{t("no-lessons-available")}</p>
            </div>
          ) : (
            lessons.map((lesson, lessonIndex) => {
              const isActive = activeLesson?.id === lesson.id;

              const timeDisplay = lesson.isQuiz
                ? t("quiz-duration-minutes", {
                    count: Number(lesson.durationMinutes) || 0,
                    formattedCount: numberFormatter.format(
                      Number(lesson.durationMinutes) || 0,
                    ),
                  })
                : formatVideoDuration(Number(lesson.duration) || 0);

              return (
                <button
                  type="button"
                  key={lesson.id}
                  className={`${styles.lessonItem} ${isActive ? styles.selected : ""}`}
                  onClick={() => onSelectLesson(lesson, lessons)}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className={styles.lessonStatus} aria-hidden="true">
                    {lesson.isQuiz ? <IoTrophyOutline /> : <IoPlay />}
                  </span>
                  <span className={styles.lessonBody}>
                    <span className={styles.lessonTitle}>
                      {lesson.isQuiz
                        ? lesson.title
                        : t("lesson-list-item-title", {
                            number: numberFormatter.format(lessonIndex + 1),
                            title: lesson.title,
                          })}
                    </span>
                    <span className={styles.lessonMeta}>
                      <span>
                        <IoTimeOutline aria-hidden="true" />

                        <span
                          style={{
                            fontWeight: "600",
                            letterSpacing: "0.5px",
                            margin: "0 4px",
                          }}
                        >
                          {timeDisplay}
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </section>
  );
};

const CurriculumSidebar = ({ activeLesson, onSelectLesson }) => {
  const { courseId } = useParams();
  const {
    sections,
    isLoading: isSectionsLoading,
    error: sectionsError,
  } = useCourseSections(courseId);
  const { t } = useTranslation();
  const { notify } = useAppAlert();

  const { certificates, isLoading: isCertLoading } = useCertificates();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const userCertificate = useMemo(() => {
    if (!certificates || certificates.length === 0) return null;
    return certificates.find((cert) => cert.courseId === courseId);
  }, [certificates, courseId]);

  const handleCertificateClick = () => {
    if (userCertificate) {
      setIsModalOpen(true);
    } else {
      notify({
        type: "info",
        message: t(
          "certificate-not-earned-yet",
          "You have not yet received the certificate for this course.",
        ),
      });
    }
  };

  if (isSectionsLoading) {
    return (
      <div className={styles.statusContainer} role="status" aria-live="polite">
        <div className={styles.loader} aria-hidden="true" />
        <p>{t("course-player-loading-curriculum")}</p>
      </div>
    );
  }

  if (sectionsError) {
    return (
      <div className={styles.statusContainer} role="alert">
        <IoAlertCircleOutline
          className={styles.statusErrorIcon}
          aria-hidden="true"
        />
        <p className={styles.errorText}>
          {sectionsError || t("course-player-curriculum-load-failed")}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.curriculum}>
        <div className={styles.chapterList}>
          {sections.length === 0 ? (
            <div className={styles.statusContainer} role="status">
              <p>{t("no-sections-available-yet")}</p>
            </div>
          ) : (
            sections.map((section, index) => (
              <SectionItem
                key={section.id}
                section={section}
                index={index}
                activeLesson={activeLesson}
                onSelectLesson={onSelectLesson}
              />
            ))
          )}
        </div>

        <div
          className={`${styles.certificate} ${userCertificate ? styles.certificateEarned : styles.certificateLocked}`}
          onClick={handleCertificateClick}
          role="button"
          tabIndex={0}
          style={{
            cursor: userCertificate ? "pointer" : "default",
            opacity: userCertificate ? 1 : 0.6,
          }}
        >
          <span className={styles.certificateIcon} aria-hidden="true">
            <IoRibbonOutline color={userCertificate ? "gold" : "inherit"} />
          </span>
          <span className={styles.certificateText}>
            <strong>{t("course-player-certificate")}</strong>
            <small>
              {isCertLoading
                ? t("checking-certificate", "جاري التحقق...")
                : userCertificate
                  ? t("view-certificate", "انقر لعرض شهادتك")
                  : t("course-player-certificate-description")}
            </small>
          </span>
        </div>
      </div>

      {isModalOpen && userCertificate && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "1000px",
              background: "transparent",
              boxShadow: "none",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "12px",
              }}
            >
              <button
                className={styles.closeModalButton}
                onClick={() => setIsModalOpen(false)}
                style={{
                  backgroundColor: "#ffffff",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                <IoClose size={26} color="#1e293b" />
              </button>
            </div>

            <CertificateCard certificate={userCertificate} />
          </div>
        </div>
      )}
    </>
  );
};

export default CurriculumSidebar;
