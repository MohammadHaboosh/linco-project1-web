import {
  IoLibraryOutline,
  IoAddCircleOutline,
  IoReorderTwoOutline,
  IoTrashOutline,
} from "react-icons/io5";
import styles from "./QuestionBankSection.module.css";
import { useTranslation } from "react-i18next";

const QuestionBankSection = ({
  questions = [],
  onAddQuestion,
  onDeleteQuestion,
  isLoading,
  hasError,
  onRetry,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={styles.questionBankBox}>
      <div className={styles.header}>
        <h5 className={styles.title}>
          <IoLibraryOutline className={styles.titleIcon} /> {t("question-bank")}
        </h5>
      </div>

      {isLoading && (
        <p className={styles.statusMessage} role="status">
          {t("loading-questions")}
        </p>
      )}

      {hasError && (
        <div className={styles.errorMessage} role="alert">
          <span>{t("questions-load-failed")}</span>
          <button type="button" onClick={onRetry}>
            {t("retry")}
          </button>
        </div>
      )}

      {!isLoading && !hasError && questions.length === 0 && (
        <p className={styles.statusMessage}>{t("no-questions-added-yet")}</p>
      )}

      {!isLoading && !hasError && questions.length > 0 && (
        <div className={styles.questionsList}>
          {questions.map((q, qIdx) => (
            <div key={q.id} className={styles.questionItem}>
              <div className={styles.questionInfo}>
                <IoReorderTwoOutline
                  className={styles.dragHandle}
                  aria-hidden="true"
                />
                <span className={styles.qNumber}>
                  {t("question-number", {
                    number: new Intl.NumberFormat(
                      i18n.resolvedLanguage || i18n.language,
                    ).format(qIdx + 1),
                  })}
                </span>
                <span className={styles.qText}>{q.question}</span>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.iconBtnDanger}
                  onClick={() => onDeleteQuestion && onDeleteQuestion(q.id)}
                  aria-label={t("delete-question-label", {
                    number: new Intl.NumberFormat(
                      i18n.resolvedLanguage || i18n.language,
                    ).format(qIdx + 1),
                  })}
                >
                  <IoTrashOutline aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className={styles.addQuestionBtn}
        onClick={onAddQuestion}
      >
        <IoAddCircleOutline /> {t("add-question")}
      </button>
    </div>
  );
};

export default QuestionBankSection;
