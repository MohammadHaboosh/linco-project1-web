import {
  IoShieldCheckmarkOutline,
  IoTimeOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import styles from "./SectionQuizSection.module.css";
import { useTranslation } from "react-i18next";

const SectionQuizSection = ({
  quiz,
  onAddQuiz,
  onDeleteQuiz,
  isLoading,
  hasError,
  onRetry,
  readOnly = false,
}) => {
  const { t, i18n } = useTranslation();
  const quizDuration = quiz?.durationMinutes ?? quiz?.duration;

  return (
    <div className={styles.quizBox}>
      <div className={styles.header}>
        <h5 className={styles.title}>
          <IoShieldCheckmarkOutline
            className={styles.titleIcon}
            aria-hidden="true"
          />
          {t("section-assessment")}
        </h5>
      </div>

      {isLoading ? (
        <p className={styles.statusMessage} role="status">
          {t("loading-quiz")}
        </p>
      ) : hasError ? (
        <div className={styles.errorMessage} role="alert">
          <span>
            {typeof hasError === "string"
              ? hasError
              : t("quiz-load-failed")}
          </span>
          <button type="button" onClick={onRetry}>
            {t("retry")}
          </button>
        </div>
      ) : quiz ? (
        <div className={styles.quizCard}>
          <div className={styles.quizInfo}>
            <span className={styles.quizBadge}>{t("quiz-label")}</span>
            <span className={styles.quizTitle}>{quiz.title}</span>
          </div>
          <div className={styles.quizMeta}>
            <span className={styles.duration}>
              <IoTimeOutline aria-hidden="true" />
              {t("quiz-duration-minutes", {
                count: Number(quizDuration || 0),
                formattedCount: new Intl.NumberFormat(
                  i18n.resolvedLanguage || i18n.language,
                ).format(quizDuration || 0),
              })}
            </span>
            {!readOnly && (
              <>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={onAddQuiz}
                  aria-label={t("edit-quiz-label", { title: quiz.title })}
                >
                  <IoPencilOutline aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.iconBtnDanger}
                  onClick={onDeleteQuiz}
                  aria-label={t("delete-quiz-label", { title: quiz.title })}
                >
                  <IoTrashOutline aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : readOnly ? (
        <p className={styles.statusMessage}>{t("no-quiz-added-yet")}</p>
      ) : (
        <button type="button" className={styles.addQuizBtn} onClick={onAddQuiz}>
          <IoAddCircleOutline aria-hidden="true" /> {t("add-section-quiz")}
        </button>
      )}
    </div>
  );
};

export default SectionQuizSection;
