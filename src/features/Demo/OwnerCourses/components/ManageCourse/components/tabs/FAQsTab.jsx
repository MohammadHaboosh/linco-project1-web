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
  const [expandedFaqs, setExpandedFaqs] = useState([]); // تتبع الأسئلة المفتوحة

  const handleAddFaq = () => {
    if (!question.trim() || !answer.trim()) return;
    const newId = Date.now().toString();
    setFaqs([...faqs, { id: newId, question, answer }]);
    setExpandedFaqs([...expandedFaqs, newId]); // فتح السؤال الجديد تلقائياً
    setQuestion("");
    setAnswer("");
  };

  const deleteFaq = (e, id) => {
    e.stopPropagation();
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const toggleFaq = (id) => {
    if (expandedFaqs.includes(id)) {
      setExpandedFaqs(expandedFaqs.filter((fId) => fId !== id));
    } else {
      setExpandedFaqs([...expandedFaqs, id]);
    }
  };

  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeaderFlex}>
        <div>
          <h3 className={styles.tabTitle}>{t("course-faqs", "Course FAQs")}</h3>
          <p className={styles.tabSubtitle}>
            Anticipate trainees' questions and provide clear answers.
          </p>
        </div>
      </div>

      <div className={styles.splitLayout}>
        {/* النصف الأيسر: نموذج الإضافة */}
        <div className={styles.splitLeft}>
          <div className={styles.faqFormCard}>
            <h4 className={styles.formSectionTitle}>Add New FAQ</h4>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Question</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Do I need prior experience?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Answer</label>
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

        {/* النصف الأيمن: قائمة الأسئلة بشكل Accordion */}
        <div className={styles.splitRight}>
          <h4 className={styles.formSectionTitle}>
            Created FAQs ({faqs.length})
          </h4>

          {faqs.length === 0 ? (
            <div className={styles.emptyFaqBox}>
              <p>No FAQs added yet. Start by creating one on the left.</p>
            </div>
          ) : (
            <div className={styles.faqAccordionList}>
              {faqs.map((faq) => {
                const isExp = expandedFaqs.includes(faq.id);
                return (
                  <div key={faq.id} className={styles.faqAccordionItem}>
                    <div
                      className={`${styles.faqAccHeader} ${isExp ? styles.faqAccHeaderActive : ""}`}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <div className={styles.faqQuestion}>
                        {isExp ? (
                          <IoChevronUp className={styles.faqChevron} />
                        ) : (
                          <IoChevronDown className={styles.faqChevron} />
                        )}
                        <h4>{faq.question}</h4>
                      </div>
                      <button
                        className={styles.ghostDangerBtn}
                        onClick={(e) => deleteFaq(e, faq.id)}
                        title="Delete FAQ"
                      >
                        <IoTrashOutline />
                      </button>
                    </div>

                    {isExp && (
                      <div className={styles.faqAccBody}>
                        <p>{faq.answer}</p>
                      </div>
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
