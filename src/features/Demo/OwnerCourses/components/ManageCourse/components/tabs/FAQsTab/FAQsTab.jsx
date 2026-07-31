import { useState } from "react";
import { IoAddCircleOutline, IoHelpCircleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./FAQsTab.module.css";
import FAQItem from "./FAQItem";
import AddEditFAQModal from "./AddEditFAQModal";

const FAQsTab = ({ faqs = [], setFaqs }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  const handleOpenAddModal = () => {
    setSelectedFaq(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (faq) => {
    setSelectedFaq(faq);
    setIsModalOpen(true);
  };

  const handleSaveFAQ = (faqData) => {
    if (selectedFaq) {
      // تعديل سؤال موجود
      setFaqs((prev) =>
        prev.map((item) =>
          item.id === selectedFaq.id ? { ...item, ...faqData } : item,
        ),
      );
    } else {
      // إضافة سؤال جديد محلياً
      const newFaq = {
        id: `temp_faq_${Date.now()}`,
        ...faqData,
        isNew: true,
      };
      setFaqs((prev) => [...prev, newFaq]);
    }
  };

  const handleDeleteFAQ = (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeader}>
        <div>
          <h3 className={styles.tabTitle}>{t("course-faqs", "Course FAQs")}</h3>
          <p className={styles.tabSubtitle}>
            Add frequently asked questions and answers to help students
            understand your course better.
          </p>
        </div>
      </div>

      {faqs.length === 0 ? (
        <div className={styles.emptyState}>
          <IoHelpCircleOutline className={styles.emptyIcon} />
          <p>
            No FAQs added yet. Click the button below to add your first
            question.
          </p>
        </div>
      ) : (
        <div className={styles.faqsList}>
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteFAQ}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        className={styles.addBtnRoot}
        onClick={handleOpenAddModal}
      >
        <IoAddCircleOutline size={20} />
        <span>Add New FAQ</span>
      </button>

      <AddEditFAQModal
        key={selectedFaq ? selectedFaq.id : "new-faq"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveFAQ}
        initialData={selectedFaq}
      />
    </div>
  );
};

export default FAQsTab;
