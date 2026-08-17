import { useState } from "react";
import styles from "./LessonTabs.module.css";
import {
  IoInformationCircleOutline,
  IoChatbubblesOutline,
  IoAttachOutline,
  IoHelpCircleOutline,
  IoChevronDown,
  IoCloudDownloadOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useLessonAttachments } from "../../hooks/useLessonAttachments";
import { useFAQs } from "../../../OwnerCourses/hooks/useFAQs";
import { useParams } from "react-router-dom";
import QASection from "./QASection";

const tabs = [
  {
    id: "overview",
    labelKey: "course-player-overview-tab",
    icon: IoInformationCircleOutline,
  },
  {
    id: "attachments",
    labelKey: "course-player-attachments-tab",
    icon: IoAttachOutline,
  },
  {
    id: "questions",
    labelKey: "course-player-questions-tab",
    icon: IoChatbubblesOutline,
  },
  {
    id: "faqs",
    labelKey: "course-player-faqs-tab",
    icon: IoHelpCircleOutline,
  },
];

const LessonTabs = ({ activeLesson }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState(0);
  const { attachments, isLoading, error } = useLessonAttachments(
    activeLesson?.id,
  );
  const { courseId } = useParams();
  const { faqs, loading, errorf } = useFAQs(courseId);
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);

  const handleDownload = (path) => {
    if (!path) return;
    const cleanPath = path.replace(/^\//, "");
    const fullUrl = path.startsWith("http")
      ? path
      : `https://lincostorage.blob.core.windows.net/uploads/${cleanPath}`;
    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeadersWrapper}>
        <div
          className={styles.tabHeaders}
          role="tablist"
          aria-label={t("course-player-lesson-information")}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                type="button"
                id={`course-player-${tab.id}-tab`}
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`course-player-${tab.id}-panel`}
                aria-label={t(tab.labelKey)}
                tabIndex={isActive ? 0 : -1}
                className={`${styles.tabBtn} ${isActive ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon} aria-hidden="true">
                  <Icon />
                </span>
                <span className={styles.tabText}>{t(tab.labelKey)}</span>

                {tab.id === "attachments" && attachments.length > 0 && (
                  <b
                    className={styles.countBadge}
                    aria-label={t("attachment-count", {
                      count: attachments.length,
                      formattedCount: numberFormatter.format(
                        attachments.length,
                      ),
                    })}
                  >
                    {numberFormatter.format(attachments.length)}
                  </b>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={styles.tabContent}
        id={`course-player-${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`course-player-${activeTab}-tab`}
      >
        {activeTab === "overview" && (
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

        {activeTab === "attachments" && (
          <div className={styles.resourcePanel}>
            <div className={styles.panelHeading}>
              <div>
                <span className={styles.kicker}>{t("lesson-materials")}</span>
                <h3>{t("resources-and-attachments")}</h3>
              </div>
            </div>

            <div className={styles.resourceGrid}>
              {isLoading && (
                <p className={styles.loadingText} role="status">
                  {t("loading-attachments")}
                </p>
              )}

              {error && (
                <p className={styles.errorText} role="alert">
                  {t("course-player-attachments-load-failed")}
                </p>
              )}

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
                      <strong>
                        {att.name || t("course-player-untitled-attachment")}
                      </strong>
                      <small>{t("lesson-material")}</small>
                    </div>
                    <button
                      type="button"
                      className={styles.downloadBtn}
                      title={t("download-view-file")}
                      aria-label={t("course-player-download-attachment", {
                        name:
                          att.name || t("course-player-untitled-attachment"),
                      })}
                      onClick={() => handleDownload(att.path)}
                    >
                      <IoCloudDownloadOutline />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "questions" && (
          <QASection activeLesson={activeLesson} />
        )}

        {activeTab === "faqs" && (
          <div className={styles.faqPanel}>
            <div className={styles.panelHeading}>
              <div>
                <span className={styles.kicker}>{t("quick-answers")}</span>
                <h3>{t("frequently-asked-questions")}</h3>
              </div>
            </div>
            <div className={styles.faqList}>
              {loading && (
                <p className={styles.loadingText} role="status">
                  {t("loading-faqs")}
                </p>
              )}

              {errorf && (
                <p className={styles.errorText} role="alert">
                  {t("course-player-faqs-load-failed")}
                </p>
              )}

              {!loading && !errorf && faqs.length === 0 && (
                <div className={styles.emptyStateContainer}>
                  <p>{t("no-faqs-available-in-this-course")}</p>
                </div>
              )}

              {!loading &&
                !errorf &&
                faqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className={`${styles.faqItem} ${openFaq === index ? styles.faqOpen : ""}`}
                  >
                    <button
                      type="button"
                      className={styles.faqTrigger}
                      onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                      aria-expanded={openFaq === index}
                      aria-controls={`course-faq-${faq.id}-answer`}
                    >
                      <span>{faq.question}</span>
                      <IoChevronDown className={styles.faqChevron} />
                    </button>
                    <div
                      className={styles.faqAnswer}
                      id={`course-faq-${faq.id}-answer`}
                      role="region"
                      aria-hidden={openFaq !== index}
                      aria-label={t("faq-answer-region", {
                        question: faq.question,
                      })}
                    >
                      <p>
                        {faq.answer ||
                          t(
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
