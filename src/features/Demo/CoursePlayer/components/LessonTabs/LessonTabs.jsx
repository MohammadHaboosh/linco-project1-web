import React, { useState } from "react";
import styles from "./LessonTabs.module.css";
import {
  IoInformationCircleOutline,
  IoChatbubblesOutline,
  IoDocumentTextOutline,
  IoAttachOutline,
  IoHelpCircleOutline,
  IoChevronDown,
  IoCloudDownloadOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useLessonAttachments } from "../../hooks/useLessonAttachments";

const tabs = [
  { id: "Overview", icon: <IoInformationCircleOutline /> },
  { id: "Attachments", icon: <IoAttachOutline /> },
  { id: "Q&A", icon: <IoChatbubblesOutline /> },
  { id: "FAQs", icon: <IoHelpCircleOutline /> },
];

const LessonTabs = ({ activeLesson }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Overview");
  const [openFaq, setOpenFaq] = useState(0);
  const { attachments, isLoading, error } = useLessonAttachments(
    activeLesson?.id,
  );
  const faqs = [
    "Do I need to know vanilla JavaScript first?",
    "Can I use these techniques in Next.js?",
    "Will this lesson affect my course progress?",
  ];
  const handleDownload = (path) => {
    if (!path) return;
    const cleanPath = path.replace(/^\//, "");
    const fullUrl = path.startsWith("http")
      ? path
      : `https://lincostorage.blob.core.windows.net/uploads/${cleanPath}`;
    window.open(fullUrl, "_blank");
  };
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeadersWrapper}>
        <div
          className={styles.tabHeaders}
          role="tablist"
          aria-label="Lesson information"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabText}>{tab.id}</span>

              {tab.id === "Attachments" && attachments.length > 0 && (
                <b className={styles.countBadge}>{attachments.length}</b>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "Overview" && (
          <div className={styles.overviewGrid}>
            <section className={styles.mainPanel}>
              <span className={styles.kicker}>{t("about-this-lesson")}</span>

              <h3>{activeLesson?.title || t("select-a-lesson")}</h3>

              <div className={styles.lessonDescription}>
                {activeLesson?.description ? (
                  <p>{activeLesson.description}</p>
                ) : (
                  <p>
                    {t(
                      "please-select-a-lesson-from-the-curriculum-sidebar-to-see-its-details-once-selected-the-description-and-materials-will-appear-here",
                    )}
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === "Attachments" && (
          <div className={styles.resourcePanel}>
            <div className={styles.panelHeading}>
              <div>
                <span className={styles.kicker}>LESSON MATERIALS</span>
                <h3>Resources & Attachments</h3>
              </div>
            </div>

            <div className={styles.resourceGrid}>
              {isLoading && (
                <p className={styles.loadingText}>Loading attachments...</p>
              )}

              {error && <p className={styles.errorText}>{error}</p>}

              {!isLoading && !error && attachments.length === 0 && (
                <div className={styles.emptyStateContainer}>
                  <p>{t("no-attachments-available-for-this-lesson")}</p>
                </div>
              )}

              {!isLoading &&
                !error &&
                attachments.map((att) => (
                  <div key={att.id} className={styles.resourceCard}>
                    <div className={styles.resourceIconBox}>
                      <IoAttachOutline />
                    </div>
                    <div className={styles.resourceDetails}>
                      <strong>{att.name || "Untitled Attachment"}</strong>
                      <small>{t("lesson-material")}</small>
                    </div>
                    <button
                      className={styles.downloadBtn}
                      title={t("download-view-file")}
                      onClick={() => handleDownload(att.path)}
                    >
                      <IoCloudDownloadOutline />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "Q&A" && (
          <div className={styles.emptyPanel}>
            <div className={styles.emptyIconGlow}>
              <div className={styles.emptyIcon}>
                <IoChatbubblesOutline />
              </div>
            </div>
            <h3>{t("join-the-discussion")}</h3>
            <p>
              {t(
                "have-a-question-about-this-lesson-ask-your-instructor-or-discuss-with-other-learners",
              )}
            </p>
            <button className={styles.primaryAction}>
              {t("ask-a-question")}
            </button>
          </div>
        )}

        {activeTab === "FAQs" && (
          <div className={styles.faqPanel}>
            <div className={styles.panelHeading}>
              <div>
                <span className={styles.kicker}>{t("quick-answers")}</span>
                <h3>{t("frequently-asked-questions")}</h3>
              </div>
            </div>
            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <div
                  key={faq}
                  className={`${styles.faqItem} ${openFaq === index ? styles.faqOpen : ""}`}
                >
                  <button
                    className={styles.faqTrigger}
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  >
                    <span>{faq}</span>
                    <IoChevronDown className={styles.faqChevron} />
                  </button>
                  <div className={styles.faqAnswer}>
                    <p>
                      {t(
                        "this-is-a-placeholder-answer-for-the-frequently-asked-question",
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonTabs;
