import { useState } from "react";
import {
  IoHelpCircleOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
} from "react-icons/io5";
import styles from "./CourseFaqItem.module.css";
import { useTranslation } from "react-i18next";

const CourseFaqItem = ({ faq }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const answerId = `course-faq-answer-${faq.id}`;

  return (
    <div className={styles.faqItem}>
      <button
        type="button"
        className={styles.faqHeader}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={answerId}
        aria-label={t(isOpen ? "collapse-course-faq" : "expand-course-faq", {
          question: faq.question,
        })}
      >
        <div className={styles.questionWrapper}>
          <IoHelpCircleOutline size={22} className={styles.icon} />
          <h4 className={styles.question}>{faq.question}</h4>
        </div>
        <div className={styles.chevron}>
          {isOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
        </div>
      </button>

      {isOpen && (
        <div id={answerId} className={styles.faqAnswer}>
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

export default CourseFaqItem;
