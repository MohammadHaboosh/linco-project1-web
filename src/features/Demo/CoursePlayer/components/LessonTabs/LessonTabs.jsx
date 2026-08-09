import React, { useState } from "react";
import styles from "./LessonTabs.module.css";
import {
  IoInformationCircleOutline,
  IoChatbubblesOutline,
  IoDocumentTextOutline,
  IoAttachOutline,
  IoHelpCircleOutline,
  IoChevronDown,
} from "react-icons/io5";

const tabs = [
  { id: "Overview", icon: <IoInformationCircleOutline /> },
  { id: "Resources", icon: <IoAttachOutline /> },
  { id: "Q&A", icon: <IoChatbubblesOutline /> },
  { id: "FAQs", icon: <IoHelpCircleOutline /> },
  { id: "My Notes", icon: <IoDocumentTextOutline /> },
];

const LessonTabs = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    "Do I need to know vanilla JavaScript first?",
    "Can I use the techniques in Next.js?",
    "Will this lesson affect my course progress?",
  ];

  return (
    <div className={styles.tabsContainer}>
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
            {tab.icon}
            <span>{tab.id}</span>
            {tab.id === "Q&A" && <b className={styles.countBadge}>12</b>}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === "Overview" && (
          <div className={styles.overviewGrid}>
            <section className={styles.panel}>
              <span className={styles.kicker}>ABOUT THIS LESSON</span>
              <h3>Understanding the DOM</h3>
              <p>
                In this lesson, we dive deep into the Document Object Model
                (DOM), how browsers build the DOM tree, and how React updates it
                efficiently.
              </p>
            </section>
            <section className={styles.objectivesCard}>
              <span className={styles.kicker}>WHAT YOU'LL LEARN</span>
              <div className={styles.objectiveList}>
                <span>Understand how the DOM is structured</span>
                <span>Trace efficient DOM updates</span>
                <span>Identify unnecessary re-renders</span>
              </div>
            </section>
          </div>
        )}

        {activeTab === "Resources" && (
          <div className={styles.resourcePanel}>
            <div className={styles.panelHeading}>
              <div>
                <span className={styles.kicker}>LESSON MATERIALS</span>
                <h3>Resources & attachments</h3>
              </div>
              <button className={styles.secondaryAction}>Download all</button>
            </div>
            <div className={styles.resourceList}>
              <div className={styles.resourceRow}>
                <IoAttachOutline />
                <span>
                  <strong>DOM cheat sheet.pdf</strong>
                  <small>PDF · 1.2 MB</small>
                </span>
                <button>Download</button>
              </div>
              <div className={styles.resourceRow}>
                <IoAttachOutline />
                <span>
                  <strong>Lesson examples.zip</strong>
                  <small>ZIP · 4.8 MB</small>
                </span>
                <button>Download</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Q&A" && (
          <div className={styles.emptyPanel}>
            <span className={styles.emptyIcon}>
              <IoChatbubblesOutline />
            </span>
            <h3>Ask a question about this lesson</h3>
            <p>Join the discussion with your instructor and other learners.</p>
            <button className={styles.primaryAction}>Ask a question</button>
          </div>
        )}

        {activeTab === "FAQs" && (
          <div className={styles.faqPanel}>
            <div className={styles.panelHeading}>
              <div>
                <span className={styles.kicker}>QUICK ANSWERS</span>
                <h3>Frequently asked questions</h3>
              </div>
              <span className={styles.helpBadge}>?</span>
            </div>
            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <button
                  key={faq}
                  className={`${styles.faqItem} ${openFaq === index ? styles.faqOpen : ""}`}
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <span>{faq}</span>
                  <IoChevronDown />
                  {openFaq === index && (
                    <small>
                      {index === 0
                        ? "Basic JavaScript knowledge is recommended, but the lesson focuses on DOM concepts."
                        : index === 1
                          ? "Yes. The concepts apply to React and modern frameworks such as Next.js."
                          : "Completing the lesson updates your progress automatically."}
                    </small>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "My Notes" && (
          <div className={styles.notePanel}>
            <span className={styles.kicker}>PRIVATE NOTES</span>
            <h3>Your lesson notes</h3>
            <textarea placeholder="Write a note about this lesson..." />
            <button className={styles.primaryAction}>Save note</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonTabs;
