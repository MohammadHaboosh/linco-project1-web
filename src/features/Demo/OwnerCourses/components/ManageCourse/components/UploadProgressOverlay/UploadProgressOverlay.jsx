import { IoCloudUploadOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const UploadProgressOverlay = ({ progress, styles }) => {
  const { t } = useTranslation();
  if (!progress) return null;

  return (
    <div className={styles.progressOverlay}>
      <div className={styles.progressCard}>
        <div className={styles.progressIcon}>
          <IoCloudUploadOutline />
        </div>
        <h3>{t("uploading-your-files-to-storage")}</h3>
        <p className={styles.lessonName}>{progress.title}</p>
        <div className={styles.progressBarWrapper}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <div className={styles.progressStats}>
          <span>{t("progress")}</span>
          <span className={styles.percentText}>{progress.percent}%</span>
        </div>
      </div>
    </div>
  );
};
export default UploadProgressOverlay;
