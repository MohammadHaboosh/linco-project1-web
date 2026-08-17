import { useId, useState } from "react";
import {
  IoBulbOutline,
  IoCheckmarkCircleOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./QuestionBankSection.module.css";

const getChoiceText = (choice) => {
  if (typeof choice === "string") return choice;

  return choice?.choice ?? choice?.text ?? choice?.answer ?? "";
};

const isCorrectChoice = (choice) =>
  choice?.isCorrect === true ||
  choice?.correct === true ||
  choice?.is_correct === true;

const QuestionBankItem = ({ question, number, onDelete }) => {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsId = useId();
  const choices = Array.isArray(question.choices) ? question.choices : [];
  const numberFormatter = new Intl.NumberFormat(
    i18n.resolvedLanguage || i18n.language,
  );

  return (
    <article className={styles.questionCard}>
      <div className={styles.questionHeader}>
        <button
          type="button"
          className={styles.questionToggle}
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          aria-label={t(
            isExpanded
              ? "question-bank-hide-details"
              : "question-bank-show-details",
            { number },
          )}
        >
          <span className={styles.qNumber}>{number}</span>
          <span className={styles.qText}>{question.question}</span>
          {isExpanded ? (
            <IoChevronUpOutline
              className={styles.chevronIcon}
              aria-hidden="true"
            />
          ) : (
            <IoChevronDownOutline
              className={styles.chevronIcon}
              aria-hidden="true"
            />
          )}
        </button>

        <button
          type="button"
          className={styles.iconBtnDanger}
          onClick={() => onDelete?.(question.id)}
          aria-label={t("delete-question-label", { number })}
        >
          <IoTrashOutline aria-hidden="true" />
        </button>
      </div>

      {isExpanded && (
        <div id={detailsId} className={styles.questionDetails}>
          {question.note && (
            <div className={styles.noteBlock}>
              <IoBulbOutline className={styles.noteIcon} aria-hidden="true" />
              <div>
                <span className={styles.detailLabel}>
                  {t("question-bank-note")}
                </span>
                <p className={styles.noteText}>{question.note}</p>
              </div>
            </div>
          )}

          <div className={styles.choicesSection}>
            <h6 className={styles.choicesTitle}>
              {t("question-bank-answer-choices")}
            </h6>

            {choices.length > 0 ? (
              <ol className={styles.choicesList}>
                {choices.map((choice, index) => {
                  const isCorrect = isCorrectChoice(choice);

                  return (
                    <li
                      key={choice?.id ?? `${getChoiceText(choice)}-${index}`}
                      className={`${styles.choiceItem} ${
                        isCorrect ? styles.correctChoice : ""
                      }`}
                    >
                      <span className={styles.choiceMarker} aria-hidden="true">
                        {numberFormatter.format(index + 1)}
                      </span>
                      <span className={styles.choiceText}>
                        {getChoiceText(choice)}
                      </span>
                      {isCorrect && (
                        <span className={styles.correctBadge}>
                          <IoCheckmarkCircleOutline aria-hidden="true" />
                          {t("correct-answer")}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className={styles.noChoices}>
                {t("question-bank-no-choices")}
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default QuestionBankItem;
