import { useState } from "react";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoHelpCircleOutline,
  IoCreateOutline,
  IoTrashOutline,
} from "react-icons/io5";
import styles from "./FAQsTab.module.css";
import { useTranslation } from "react-i18next";

const FAQItem = ({ faq, onDelete }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.faqCard}>
      <div
        className={styles.faqHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.faqHeaderLeft}>
          <IoHelpCircleOutline className={styles.faqIcon} size={20} />
          <span className={styles.faqQuestionText}>{faq.question}</span>
        </div>

        <div className={styles.faqActions} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => onDelete(faq.id)}
          >
            <IoTrashOutline size={15} />
            <span>{t("delete")}</span>
          </button>

          <button
            type="button"
            className={styles.iconOnlyBtn}
            onClick={() => setIsExpanded(!isExpanded)}
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
        <div className={styles.faqBody}>
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
