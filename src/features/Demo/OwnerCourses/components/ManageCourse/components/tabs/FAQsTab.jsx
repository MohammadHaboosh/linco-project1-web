import { useState } from "react";
import { IoAddOutline, IoTrashOutline } from "react-icons/io5";
import styles from "../CourseManager.module.css";

const FAQsTab = ({ faqs, setFaqs }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAddFaq = () => {
    if (!question.trim() || !answer.trim()) return;
    setFaqs([...faqs, { id: Date.now(), question, answer }]);
    setQuestion("");
    setAnswer("");
  };

  const deleteFaq = (id) => setFaqs(faqs.filter((f) => f.id !== id));

  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeaderFlex}>
        <div>
          <h3 className={styles.tabTitle}>Course FAQs</h3>
          <p className={styles.tabSubtitle}>
            Anticipate trainees' questions and provide clear answers.
          </p>
        </div>
      </div>

      <div className={styles.faqForm}>
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

      <div className={styles.faqList}>
        {faqs.length === 0 && (
          <p className={styles.emptyTextCenter}>No FAQs added yet.</p>
        )}
        {faqs.map((faq) => (
          <div key={faq.id} className={styles.faqCard}>
            <div className={styles.faqContent}>
              <h4>{faq.question}</h4>
              <p>{faq.answer}</p>
            </div>
            <button
              className={styles.ghostDangerBtn}
              onClick={() => deleteFaq(faq.id)}
            >
              <IoTrashOutline />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQsTab;
