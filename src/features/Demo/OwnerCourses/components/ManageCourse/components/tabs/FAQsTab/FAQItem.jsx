import { useState } from "react";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoHelpCircleOutline,
  IoTrashOutline,
} from "react-icons/io5";
import styles from "./FAQsTab.module.css";
import { useTranslation } from "react-i18next";

const FAQItem = ({ faq, onDelete, isDeleting, canDelete = true }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.faqCard}>
      <div className={styles.faqHeader}>
        <button
          type="button"
          className={styles.faqToggle}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls={`faq-answer-${faq.id}`}
        >
          <IoHelpCircleOutline
            className={styles.faqIcon}
            size={20}
            aria-hidden="true"
          />
          <span className={styles.faqQuestionText}>{faq.question}</span>
        </button>

        <div className={styles.faqActions}>
          {canDelete && (
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={() => onDelete(faq.id)}
              disabled={isDeleting}
              aria-busy={isDeleting}
            >
              <IoTrashOutline size={15} aria-hidden="true" />
              <span>{isDeleting ? t("deleting-faq") : t("delete")}</span>
            </button>
          )}

          <button
            type="button"
            className={styles.iconOnlyBtn}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls={`faq-answer-${faq.id}`}
            aria-label={
              isExpanded
                ? t("collapse-faq-answer", { question: faq.question })
                : t("expand-faq-answer", { question: faq.question })
            }
          >
            {isExpanded ? (
              <IoChevronUpOutline size={18} />
            ) : (
              <IoChevronDownOutline size={18} />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          id={`faq-answer-${faq.id}`}
          className={styles.faqBody}
          role="region"
          aria-label={t("faq-answer-region", { question: faq.question })}
        >
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
