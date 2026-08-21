import {
  IoLibraryOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import styles from "./QuestionBankSection.module.css";
import { useTranslation } from "react-i18next";
import QuestionBankItem from "./QuestionBankItem";

const QuestionBankSection = ({
  questions = [],
  onAddQuestion,
  onDeleteQuestion,
  isLoading,
  hasError,
  onRetry,
  readOnly = false,
}) => {
  const { t, i18n } = useTranslation();
  const numberFormatter = new Intl.NumberFormat(
    i18n.resolvedLanguage || i18n.language,
  );

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
          <span>
            {typeof hasError === "string"
              ? hasError
              : t("questions-load-failed")}
          </span>
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
          {questions.map((question, questionIndex) => {
            const formattedQuestionNumber = numberFormatter.format(
              questionIndex + 1,
            );

            return (
              <QuestionBankItem
                key={question.id ?? `question-${questionIndex}`}
                question={question}
                number={formattedQuestionNumber}
                onDelete={onDeleteQuestion}
                canDelete={!readOnly}
              />
            );
          })}
        </div>
      )}

      {!readOnly && (
        <button
          type="button"
          className={styles.addQuestionBtn}
          onClick={onAddQuestion}
        >
          <IoAddCircleOutline /> {t("add-question")}
        </button>
      )}
    </div>
  );
};

export default QuestionBankSection;
