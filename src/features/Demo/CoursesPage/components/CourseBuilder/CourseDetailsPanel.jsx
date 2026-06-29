import { useTranslation } from "react-i18next";
import styles from "./CourseBuilder.module.css";

const CourseDetailsPanel = ({ details, setDetails, onSave, isLoading }) => {
  const { t } = useTranslation();

  const handleChange = (field, value) =>
    setDetails({ ...details, [field]: value });

  return (
    <div className={styles.stickyPanel}>
      <div className={styles.panelCard}>
        <h2 className={styles.panelTitle}>{t("course-details")}</h2>

        <div className={styles.formGroup}>
          <label>{t("course-title")}</label>
          <input
            type="text"
            className={styles.input}
            value={details.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t("course-desc")}</label>
          <textarea
            className={styles.textarea}
            value={details.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <button
          className={styles.saveBtn}
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? t("saving") : t("save-changes")}
        </button>
      </div>
    </div>
  );
};
export default CourseDetailsPanel;
