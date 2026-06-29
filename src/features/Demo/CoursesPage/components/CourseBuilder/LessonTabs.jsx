import styles from "./LessonModal.module.css";
import { useTranslation } from "react-i18next";

export const GeneralTab = ({ data, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tabContent}>
      <div className={styles.formGroup}>
        <label>{t("lesson-title")}</label>
        <input
          type="text"
          className={styles.input}
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label>{t("lesson-desc")}</label>
        <textarea
          className={styles.textarea}
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label>{t("duration")}</label>
        <input
          type="text"
          className={styles.input}
          value={data.duration}
          onChange={(e) => onChange("duration", e.target.value)}
          placeholder="00:00"
        />
      </div>
    </div>
  );
};

export const VideoTab = ({ data, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tabContent}>
      <div className={styles.formGroup}>
        <label>{t("video-url")}</label>
        <input
          type="text"
          className={styles.input}
          value={data.videoUrl}
          onChange={(e) => onChange("videoUrl", e.target.value)}
        />
      </div>
    </div>
  );
};

export const AITab = ({ data, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tabContent}>
      <div className={styles.formGroup}>
        <label>{t("ai-endpoint")}</label>
        <input
          type="text"
          className={styles.input}
          value={data.aiEndpoint}
          onChange={(e) => onChange("aiEndpoint", e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label>{t("system-prompt")}</label>
        <textarea
          className={styles.textarea}
          value={data.aiPrompt}
          onChange={(e) => onChange("aiPrompt", e.target.value)}
        />
      </div>
    </div>
  );
};
