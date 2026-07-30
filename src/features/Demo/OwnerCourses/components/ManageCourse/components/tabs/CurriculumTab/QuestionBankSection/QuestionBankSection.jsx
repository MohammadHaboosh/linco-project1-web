import React from "react";
import {
  IoLibraryOutline,
  IoAddCircleOutline,
  IoReorderTwoOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";
import styles from "./QuestionBankSection.module.css";

const QuestionBankSection = ({
  questions = [],
  onAddQuestion,
  onDeleteQuestion,
}) => {
  return (
    <div className={styles.questionBankBox}>
      <div className={styles.header}>
        <h5 className={styles.title}>
          <IoLibraryOutline className={styles.titleIcon} /> Question Bank
        </h5>
      </div>

      {questions.length > 0 && (
        <div className={styles.questionsList}>
          {questions.map((q, qIdx) => (
            <div key={q.id} className={styles.questionItem}>
              <div className={styles.questionInfo}>
                <IoReorderTwoOutline className={styles.dragHandle} />
                <span className={styles.qNumber}>Q{qIdx + 1}:</span>
                <span className={styles.qText}>{q.text}</span>
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
        <IoAddCircleOutline /> Add Question
      </button>
    </div>
  );
};

export default QuestionBankSection;
