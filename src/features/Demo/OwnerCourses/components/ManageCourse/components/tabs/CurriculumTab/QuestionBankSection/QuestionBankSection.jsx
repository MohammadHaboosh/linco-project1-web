import {
  IoLibraryOutline,
  IoAddCircleOutline,
  IoReorderTwoOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";
import styles from "./QuestionBankSection.module.css";
import { useTranslation } from "react-i18next";

const QuestionBankSection = ({
  questions = [],
  onAddQuestion,
  onDeleteQuestion,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.questionBankBox}>
      <div className={styles.header}>
        <h5 className={styles.title}>
          <IoLibraryOutline className={styles.titleIcon} /> {t("question-bank")}
        </h5>
      </div>

      {questions.length > 0 && (
        <div className={styles.questionsList}>
          {questions.map((q, qIdx) => (
            <div key={q.id} className={styles.questionItem}>
              <div className={styles.questionInfo}>
                <IoReorderTwoOutline className={styles.dragHandle} />
                <span className={styles.qNumber}>Q{qIdx + 1}:</span>
                <span className={styles.qText}>{q.question}</span>
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.iconBtn}>
                  <IoPencilOutline />
                </button>
                <button
                  type="button"
                  className={styles.iconBtnDanger}
                  onClick={() => onDeleteQuestion && onDeleteQuestion(q.id)}
                >
                  <IoTrashOutline />
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
