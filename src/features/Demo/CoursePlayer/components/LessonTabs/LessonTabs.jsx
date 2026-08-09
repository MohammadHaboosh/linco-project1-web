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

const tabs = [
  { id: "Overview", icon: <IoInformationCircleOutline /> },
  { id: "Resources", icon: <IoAttachOutline /> },
  { id: "Q&A", icon: <IoChatbubblesOutline /> },
  { id: "FAQs", icon: <IoHelpCircleOutline /> },
];

const LessonTabs = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    "Do I need to know vanilla JavaScript first?",
    "Can I use these techniques in Next.js?",
    "Will this lesson affect my course progress?",
  ];

  return (
    <div className={styles.tabsContainer}>
      {/* Modern Segmented Control Tabs */}
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
              {tab.id === "Q&A" && <b className={styles.countBadge}>12</b>}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tabContent}>
        {/* OVERVIEW TAB */}
        {activeTab === "Overview" && (
          <div className={styles.overviewGrid}>
            <section className={styles.mainPanel}>
              <span className={styles.kicker}>ABOUT THIS LESSON</span>
              <h3>Understanding the DOM</h3>
              <p>
                In this lesson, we dive deep into the Document Object Model
                (DOM), how browsers build the DOM tree, and how modern
                frameworks like React update it efficiently behind the scenes.
              </p>
            </section>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === "Resources" && (
          <div className={styles.resourcePanel}>
            <div className={styles.panelHeading}>
              <div>
                <span className={styles.kicker}>LESSON MATERIALS</span>
                <h3>Resources & Attachments</h3>
              </div>
              <button className={styles.secondaryAction}>Download All</button>
            </div>

            <div className={styles.resourceGrid}>
              <div className={styles.resourceCard}>
                <div className={styles.resourceIconBox}>
                  <IoAttachOutline />
                </div>
                <div className={styles.resourceDetails}>
                  <strong>DOM_Cheat_Sheet.pdf</strong>
                  <small>PDF Document • 1.2 MB</small>
                </div>
                <button className={styles.downloadBtn} title="Download">
                  <IoCloudDownloadOutline />
                </button>
              </div>

              <div className={styles.resourceCard}>
                <div className={styles.resourceIconBox}>
                  <IoAttachOutline />
                </div>
                <div className={styles.resourceDetails}>
                  <strong>Code_Examples.zip</strong>
                  <small>ZIP Archive • 4.8 MB</small>
                </div>
                <button className={styles.downloadBtn} title="Download">
                  <IoCloudDownloadOutline />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Q&A TAB */}
        {activeTab === "Q&A" && (
          <div className={styles.emptyPanel}>
            <div className={styles.emptyIconGlow}>
              <div className={styles.emptyIcon}>
                <IoChatbubblesOutline />
              </div>
            </div>
            <h3>Join the Discussion</h3>
            <p>
              Have a question about this lesson? Ask your instructor or discuss
              with other learners.
            </p>
            <button className={styles.primaryAction}>Ask a Question</button>
          </div>
        )}

        {/* FAQs TAB */}
        {activeTab === "FAQs" && (
          <div className={styles.faqPanel}>
            <div className={styles.panelHeading}>
              <div>
                <span className={styles.kicker}>QUICK ANSWERS</span>
                <h3>Frequently Asked Questions</h3>
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
                      {index === 0
                        ? "Basic JavaScript knowledge is highly recommended, but the lesson focuses on high-level DOM concepts that are easy to grasp."
                        : index === 1
                          ? "Absolutely! The concepts apply to React and modern frameworks such as Next.js perfectly."
                          : "Yes, watching the video completely will automatically update your overall course progress."}
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
