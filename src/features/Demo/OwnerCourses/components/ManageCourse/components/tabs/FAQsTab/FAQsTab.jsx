import { useState } from "react";
import { IoAddCircleOutline, IoHelpCircleOutline } from "react-icons/io5";
import styles from "./FAQsTab.module.css";
import FAQItem from "./FAQItem";
import AddEditFAQModal from "./AddEditFAQModal";
import { useFAQs } from "./useFAQs"; // استدعي الـ Hook هنا
import { useTranslation } from "react-i18next";

const FAQsTab = ({ courseId }) => {
  const { t } = useTranslation();
  const { faqs, loading, addFaq, removeFaq } = useFAQs(courseId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveFAQ = async (faqData) => {
    const result = await addFaq(faqData);
    if (result.success) {
      setIsModalOpen(false);
    } else {
      alert("Failed to create FAQ");
    }
  };

  const handleDeleteFAQ = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      const result = await removeFaq(id);
      if (!result.success) {
        alert("Failed to delete FAQ");
      }
    }
  };

  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeader}>
        <div>
          <h3 className={styles.tabTitle}>{t("course-faqs")}</h3>
          <p className={styles.tabSubtitle}>
            {t("manage-questions-and-answers-for-your-students")}
          </p>
        </div>
      </div>

      {loading ? (
        <div className={styles.emptyState}>
          <p>{t("loading-faqs")}</p>
        </div>
      ) : faqs.length === 0 ? (
        <div className={styles.emptyState}>
          <IoHelpCircleOutline className={styles.emptyIcon} size={36} />
          <p>{t("no-faqs-added-yet-click-below-to-create-one")}</p>
        </div>
      ) : (
        <div className={styles.faqsList}>
          {faqs.map((faq) => (
            <FAQItem key={faq.id} faq={faq} onDelete={handleDeleteFAQ} />
          ))}
        </div>
      )}

      <button
        type="button"
        className={styles.addBtnRoot}
        onClick={() => setIsModalOpen(true)}
      >
        <IoAddCircleOutline size={18} />
        <span>{t("add-new-faq")}</span>
      </button>

      <AddEditFAQModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveFAQ}
      />
    </div>
  );
};

export default FAQsTab;
