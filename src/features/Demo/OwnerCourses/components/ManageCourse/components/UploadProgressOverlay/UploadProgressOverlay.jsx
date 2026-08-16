import { IoCloudUploadOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const UploadProgressOverlay = ({ progress, styles }) => {
  const { t, i18n } = useTranslation();
  if (!progress) return null;
  const normalizedProgress = Math.min(100, Math.max(0, progress.percent || 0));
  const formattedPercent = new Intl.NumberFormat(
    i18n.resolvedLanguage || i18n.language,
    { style: "percent", maximumFractionDigits: 0 },
  ).format(normalizedProgress / 100);

  return (
    <div className={styles.progressOverlay}>
      <div
        className={styles.progressCard}
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-upload-title"
        aria-describedby="course-upload-message course-upload-status"
      >
        <div className={styles.progressIcon}>
          <IoCloudUploadOutline />
        </div>
        <h3 id="course-upload-title">{t("course-studio-upload-heading")}</h3>
        <p id="course-upload-message" className={styles.lessonName}>
          {progress.title}
        </p>
        <div
          className={styles.progressBarWrapper}
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={normalizedProgress}
          aria-label={t("upload-progress-label")}
        >
          <div
            className={styles.progressBarFill}
            style={{ inlineSize: `${normalizedProgress}%` }}
          />
        </div>
        <p
          id="course-upload-status"
          className={styles.progressStats}
          aria-live="polite"
        >
          {t("upload-progress-status", { formattedPercent })}
        </p>
      </div>
    </div>
  );
};
export default UploadProgressOverlay;
