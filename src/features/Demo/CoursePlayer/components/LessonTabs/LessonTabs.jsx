import React, { useState } from "react";
import styles from "./LessonTabs.module.css";
import {
  IoInformationCircleOutline,
  IoChatbubblesOutline,
  IoDocumentTextOutline,
  IoHelpCircleOutline,
  IoDownloadOutline,
  IoAttachOutline,
  IoSearchOutline,
  IoChevronDown,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

const LessonTabs = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [openFaq, setOpenFaq] = useState(0);
  const tabs = [
    ["Overview", <IoInformationCircleOutline />],
    ["Resources", <IoAttachOutline />],
    ["Q&A", <IoChatbubblesOutline />],
    ["FAQs", <IoHelpCircleOutline />],
    ["My Notes", <IoDocumentTextOutline />],
  ];

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders} role="tablist">
        {tabs.map(([id, icon]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={`${styles.tabBtn} ${activeTab === id ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(id)}
          >
            {icon}
            <span>{id}</span>
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === "Overview" && (
          <div className={styles.overviewPanel}>
            <div className={styles.sectionHeading}>
              <div>
                <span>ABOUT THIS LESSON</span>
                <h3>Build a stronger mental model of the DOM</h3>
              </div>
              <IoCheckmarkCircleOutline />
            </div>
            <p>
              In this lesson, we dive into the Document Object Model, how
              browsers represent HTML as a tree, and how React coordinates UI
              updates. The goal is to help you understand what actually happens
              between your component and the screen.
            </p>
            <div className={styles.objectives}>
              <div>
                <b>01</b>
                <span>Understand DOM nodes and tree traversal</span>
              </div>
              <div>
                <b>02</b>
                <span>Recognize expensive rendering patterns</span>
              </div>
              <div>
                <b>03</b>
                <span>Connect React updates to browser rendering</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Resources" && (
          <div className={styles.resourcePanel}>
            <div className={styles.sectionHeading}>
              <div>
                <span>LESSON MATERIALS</span>
                <h3>Resources & attachments</h3>
              </div>
              <button type="button" className={styles.downloadAll}>
                <IoDownloadOutline /> Download all
              </button>
            </div>
            <div className={styles.resourceGrid}>
              {[
                "DOM Cheat Sheet.pdf",
                "Lesson source code.zip",
                "Architecture notes.pdf",
              ].map((name, index) => (
                <button
                  type="button"
                  className={styles.resourceCard}
                  key={name}
                >
                  <span className={styles.fileIcon}>
                    <IoDocumentTextOutline />
                  </span>
                  <span>
                    <strong>{name}</strong>
                    <small>
                      {index === 1 ? "ZIP · 1.2 MB" : "PDF · 640 KB"}
                    </small>
                  </span>
                  <IoDownloadOutline />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Q&A" && (
          <div className={styles.qaPanel}>
            <div className={styles.sectionHeading}>
              <div>
                <span>COMMUNITY</span>
                <h3>Questions about this lesson</h3>
              </div>
              <button type="button" className={styles.primarySmall}>
                Ask a question
              </button>
            </div>
            <div className={styles.questionCard}>
              <div className={styles.avatar}>AA</div>
              <div>
                <strong>Why does React need a virtual DOM?</strong>
                <p>Asked 12 min ago · 4 replies</p>
              </div>
              <span className={styles.replyCount}>4</span>
            </div>
            <div className={styles.questionCard}>
              <div className={styles.avatar}>MK</div>
              <div>
                <strong>When should I avoid direct DOM manipulation?</strong>
                <p>Asked yesterday · 7 replies</p>
              </div>
              <span className={styles.replyCount}>7</span>
            </div>
          </div>
        )}

        {activeTab === "FAQs" && (
          <div className={styles.faqPanel}>
            <div className={styles.sectionHeading}>
              <div>
                <span>QUICK ANSWERS</span>
                <h3>Frequently asked questions</h3>
              </div>
              <IoHelpCircleOutline />
            </div>
            {[
              "Do I need to know vanilla JavaScript first?",
              "Can I use the techniques in Next.js?",
              "Will this lesson affect my course progress?",
            ].map((question, index) => (
              <div
                className={`${styles.faqItem} ${openFaq === index ? styles.faqOpen : ""}`}
                key={question}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <span>{question}</span>
                  <IoChevronDown />
                </button>
                {openFaq === index && (
                  <p>
                    {index === 0
                      ? "Basic JavaScript and React fundamentals are enough. The lesson introduces the browser concepts as we go."
                      : index === 1
                        ? "Yes. The concepts are framework-agnostic and become especially useful when building React and Next.js applications."
                        : "Yes. Completing the lesson and its assessment contributes to your overall course progress."}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "My Notes" && (
          <div className={styles.notesPanel}>
            <div className={styles.sectionHeading}>
              <div>
                <span>PERSONAL SPACE</span>
                <h3>Your notes</h3>
              </div>
              <IoDocumentTextOutline />
            </div>
            <textarea placeholder="Write a note for this lesson…" />
            <div className={styles.noteHint}>
              Notes are saved locally in this demo.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonTabs;
