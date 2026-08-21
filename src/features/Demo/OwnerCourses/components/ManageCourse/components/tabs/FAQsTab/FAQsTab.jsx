import { useState } from "react";
import { IoAddCircleOutline, IoHelpCircleOutline } from "react-icons/io5";
import styles from "./FAQsTab.module.css";
import FAQItem from "./FAQItem";
import AddEditFAQModal from "./AddEditFAQModal";
import { useFAQs } from "../../../../../hooks/useFAQs";
import { useTranslation } from "react-i18next";
import { useAppAlert } from "../../../../../../../../components/common/AppAlerts/useAppAlert";

const FAQsTab = ({ courseId, readOnly = false }) => {
  const { t } = useTranslation();
  const { confirmAction } = useAppAlert();
  const { faqs, loading, error, addFaq, removeFaq, refetch } =
    useFAQs(courseId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const [deletingFaqId, setDeletingFaqId] = useState(null);

  const handleSaveFAQ = async (faqData) => {
    setActionError("");
    const result = await addFaq(faqData);
    return result.success;
  };

  const handleDeleteFAQ = async (id) => {
    const shouldDelete = await confirmAction({
      message: t("delete-faq-confirmation"),
      confirmLabel: t("delete"),
      tone: "danger",
    });

    if (!shouldDelete) return;

    setActionError("");
    setDeletingFaqId(id);
    const result = await removeFaq(id);
    if (!result.success) {
      setActionError(t("faq-delete-failed"));
    }
    setDeletingFaqId(null);
  };

  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeader}>
        <div>
          <h3 className={styles.tabTitle}>{t("course-faqs")}</h3>
          <p className={styles.tabSubtitle}>
            {t(
              readOnly
                ? "course-faqs-read-only-description"
                : "manage-questions-and-answers-for-your-students",
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className={styles.emptyState} role="status" aria-live="polite">
          <span className={styles.faqLoader} aria-hidden="true" />
          <p>{t("loading-faqs")}</p>
        </div>
      ) : error ? (
        <div className={styles.errorState} role="alert">
          <h4>{t("course-faqs-load-failed-title")}</h4>
          <p>{t("course-faqs-load-failed")}</p>
          <button type="button" onClick={refetch}>
            {t("retry")}
          </button>
        </div>
      ) : faqs.length === 0 ? (
        <div className={styles.emptyState} role="status">
          <IoHelpCircleOutline
            className={styles.emptyIcon}
            size={36}
            aria-hidden="true"
          />
          <p>
            {t(
              readOnly
                ? "no-faqs-available-in-this-course"
                : "no-faqs-added-yet-click-below-to-create-one",
            )}
          </p>
        </div>
      ) : (
        <div className={styles.faqsList}>
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              onDelete={handleDeleteFAQ}
              isDeleting={deletingFaqId === faq.id}
              canDelete={!readOnly}
            />
          ))}
        </div>
      )}

      {!readOnly && actionError && (
        <div className={styles.actionError} role="alert">
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError("")}
            aria-label={t("dismiss-error-message")}
          >
            ×
          </button>
        </div>
      )}

      {!readOnly && (
        <>
          <button
            type="button"
            className={styles.addBtnRoot}
            onClick={() => {
              setActionError("");
              setIsModalOpen(true);
            }}
            disabled={loading || error}
          >
            <IoAddCircleOutline size={18} aria-hidden="true" />
            <span>{t("add-new-faq")}</span>
          </button>

          <AddEditFAQModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSaveFAQ}
          />
        </>
      )}
    </div>
  );
};

export default FAQsTab;
