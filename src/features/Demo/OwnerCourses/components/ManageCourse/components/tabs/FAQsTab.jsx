import { useState } from "react";
import {
  IoAddOutline,
  IoTrashOutline,
  IoChevronDown,
  IoChevronUp,
} from "react-icons/io5";
import styles from "../CourseManager.module.css";
import { useTranslation } from "react-i18next";

const FAQsTab = ({ faqs, setFaqs }) => {
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const handleAddFaq = () => {
    if (!question.trim() || !answer.trim()) return;
    const newFaq = { id: Date.now().toString(), question, answer };
    setFaqs([...faqs, newFaq]);
    setExpandedId(newFaq.id); // فتح الجواب تلقائياً بعد الإضافة
    setQuestion("");
    setAnswer("");
  };

  const deleteFaq = (e, id) => {
    e.stopPropagation();
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeader}>
        <div>
          <h3 className={styles.tabTitle}>{t("course-faqs", "Course FAQs")}</h3>
          <p className={styles.tabSubtitle}>
            Add and manage frequently asked questions for your trainees.
          </p>
        </div>
      </div>

      <div className={styles.splitLayout}>
        {/* النصف الأيسر: إضافة سؤال جديد */}
        <div className={styles.leftPane}>
          <div className={styles.faqForm}>
            <h4 className={styles.formSectionTitle}>Create New FAQ</h4>
            <div className={styles.formGroup}>
              <label>Question</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Do I need prior experience?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Answer</label>
              <textarea
                className={styles.textarea}
                placeholder="e.g. No, this course starts from the absolute basics."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <button className={styles.primaryBtn} onClick={handleAddFaq}>
              <IoAddOutline /> Add FAQ
            </button>
          </div>
        </div>

        {/* النصف الأيمن: قائمة الأسئلة بشكل طيات (Accordion) */}
        <div className={styles.rightPane}>
          <h4 className={styles.formSectionTitle}>
            Created FAQs ({faqs.length})
          </h4>

          {faqs.length === 0 ? (
            <div className={styles.emptyFaq}>
              No FAQs added yet. Start by creating one on the left.
            </div>
          ) : (
            <div className={styles.faqAccordionList}>
              {faqs.map((faq) => {
                const isOpen = expandedId === faq.id;
                return (
                  <div key={faq.id} className={styles.faqItem}>
                    <div
                      className={`${styles.faqItemHeader} ${isOpen ? styles.faqItemHeaderActive : ""}`}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <div className={styles.faqTitleBox}>
                        <IoChevronDown
                          className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ""}`}
                        />
                        <h5>{faq.question}</h5>
                      </div>
                      <button
                        className={styles.ghostDangerBtn}
                        onClick={(e) => deleteFaq(e, faq.id)}
                        title="Delete FAQ"
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                    {isOpen && (
                      <div className={styles.faqBody}>{faq.answer}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQsTab;
