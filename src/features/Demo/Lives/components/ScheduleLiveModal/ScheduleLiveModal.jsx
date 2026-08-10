import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoCalendarOutline,
  IoCloseOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import styles from "./ScheduleLiveModal.module.css";

const toDateTimeLocalValue = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const ScheduleLiveModal = ({ onClose, onCreate }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const minimumSchedule = useMemo(
    () => toDateTimeLocalValue(new Date()),
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const scheduleDate = new Date(scheduledAt);
    if (Number.isNaN(scheduleDate.getTime())) {
      setError(t("live-valid-schedule-required"));
      return;
    }

    if (scheduleDate.getTime() < Date.now()) {
      setError(t("live-schedule-must-be-future"));
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreate({
        title: title.trim(),
        description: description.trim(),
        scheduledAt: scheduleDate.toISOString(),
      });
      onClose();
    } catch (requestError) {
      setError(requestError.message || t("live-create-failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete =
    title.trim() && description.trim() && scheduledAt && !isSubmitting;

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-live-title"
        aria-describedby="schedule-live-description"
      >
        <div className={styles.header}>
          <div className={styles.heading}>
            <span className={styles.headingIcon}>
              <IoVideocamOutline />
            </span>
            <div>
              <h2 id="schedule-live-title">{t("schedule-live")}</h2>
              <p id="schedule-live-description">
                {t("schedule-live-description")}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={t("close")}
          >
            <IoCloseOutline />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.errorAlert} role="alert">
              {error}
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label htmlFor="live-stream-title">{t("live-title")}</label>
            <input
              id="live-stream-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("live-title-placeholder")}
              disabled={isSubmitting}
              maxLength={150}
              autoFocus
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="live-stream-description">
              {t("live-description")}
            </label>
            <textarea
              id="live-stream-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t("live-description-placeholder")}
              disabled={isSubmitting}
              rows={4}
              maxLength={1000}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="live-stream-schedule">
              {t("scheduled-date-and-time")}
            </label>
            <div className={styles.dateInput}>
              <IoCalendarOutline />
              <input
                id="live-stream-schedule"
                type="datetime-local"
                value={scheduledAt}
                min={minimumSchedule}
                onChange={(event) => setScheduledAt(event.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <span className={styles.helperText}>
              {t("live-timezone-help")}
            </span>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isFormComplete}
            >
              <IoVideocamOutline />
              {isSubmitting ? t("scheduling-live") : t("schedule-live")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleLiveModal;
