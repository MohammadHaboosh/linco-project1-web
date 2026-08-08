import { useState } from "react";
import {
  IoHelpCircleOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
} from "react-icons/io5";
import styles from "./CourseFaqItem.module.css";

const CourseFaqItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.faqItem}>
      <div className={styles.faqHeader} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.questionWrapper}>
          <IoHelpCircleOutline size={22} className={styles.icon} />
          <h4 className={styles.question}>{faq.question}</h4>
        </div>
        <div className={styles.chevron}>
          {isOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
        </div>
      </div>

      {isOpen && (
        <div className={styles.faqAnswer}>
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

export default CourseFaqItem;
