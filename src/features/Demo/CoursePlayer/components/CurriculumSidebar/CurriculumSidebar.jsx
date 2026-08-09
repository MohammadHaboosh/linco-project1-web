import React, { useState } from "react";
import styles from "./CurriculumSidebar.module.css";
import {
  IoPlayCircle,
  IoCheckmarkCircle,
  IoHelpCircle,
  IoChevronDown,
  IoTrophyOutline,
  IoRibbonOutline,
  IoTimeOutline,
  IoDocumentTextOutline,
  IoAttachOutline,
} from "react-icons/io5";

const CurriculumSidebar = ({ activeLesson, setActiveLesson }) => {
  const [expandedSection, setExpandedSection] = useState(1);

  const sections = [
    {
      id: 1,
      title: "Fundamentals and Workflow",
      progress: 65,
      items: [
        {
          id: 101,
          type: "video",
          title: "Introduction to React & Architecture",
          duration: "12:30 mins",
          attachments: 2,
          completed: true,
        },
        {
          id: 102,
          type: "video",
          title: "Understanding Virtual DOM & Lifecycle",
          duration: "18:45 mins",
          attachments: 0,
          completed: false,
        },
        {
          id: 103,
          type: "quiz",
          title: "Section 1 Assessment",
          duration: "10 Questions",
          attachments: 0,
        },
      ],
    },
  ];

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarHeader}>
        <h3>Course Content</h3>
        {sections.map((sec) => (
          <div key={sec.id} className={styles.courseProgress}>
            <div className={styles.progressInfoBar}>
              <span>Overall Progress</span>
              <span className={styles.progressPercentage}>{sec.progress}%</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${sec.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sectionsList}>
        {sections.map((section) => (
          <div key={section.id} className={styles.sectionWrapper}>
            <div
              className={styles.sectionTitleHeader}
              onClick={() =>
                setExpandedSection(
                  expandedSection === section.id ? null : section.id,
                )
              }
            >
              <div className={styles.titleGroup}>
                <div className={styles.toggleBtn}>
                  <IoChevronDown
                    className={`${styles.chevron} ${
                      expandedSection === section.id ? styles.rotated : ""
                    }`}
                  />
                </div>
                <div className={styles.sectionBadge}>Section {section.id}</div>
                <h4>{section.title}</h4>
              </div>
            </div>

            {expandedSection === section.id && (
              <div className={styles.sectionItems}>
                {section.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`${styles.itemRow} ${
                      activeLesson === item.id ? styles.activeItem : ""
                    }`}
                    onClick={() => setActiveLesson(item.id)}
                  >
                    <div className={styles.itemIcon}>
                      {item.type === "video" && item.completed ? (
                        <IoCheckmarkCircle className={styles.iconSuccess} />
                      ) : null}
                      {item.type === "video" && !item.completed ? (
                        <IoPlayCircle className={styles.iconVideo} />
                      ) : null}
                      {item.type === "quiz" ? (
                        <IoHelpCircle className={styles.iconQuiz} />
                      ) : null}
                    </div>

                    <div className={styles.itemMeta}>
                      <span className={styles.itemTitle}>
                        {index + 1}. {item.title}
                      </span>
                      <span className={styles.itemDuration}>
                        {item.type === "quiz" ? (
                          <IoDocumentTextOutline className={styles.timeIcon} />
                        ) : (
                          <IoTimeOutline className={styles.timeIcon} />
                        )}
                        {item.duration}
                      </span>
                    </div>

                    {item.attachments > 0 ? (
                      <div className={styles.attachmentBadge}>
                        <IoAttachOutline style={{ marginRight: "4px" }} />
                        {item.attachments} Attachments
                      </div>
                    ) : (
                      <div
                        className={`${styles.attachmentBadge} ${styles.emptyAttachment}`}
                      >
                        <IoAttachOutline style={{ marginRight: "4px" }} />0
                        Attachments
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.courseEndings}>
        <div className={`${styles.endingCard} ${styles.assessmentCard}`}>
          <div className={styles.endingIconWrapper}>
            <IoTrophyOutline />
          </div>
          <div className={styles.endingMeta}>
            <strong>Final Course Assessment</strong>
            <span>Required to pass the course</span>
          </div>
        </div>

        <div
          className={`${styles.endingCard} ${styles.certificateCard} ${styles.locked}`}
        >
          <div className={styles.endingIconWrapper}>
            <IoRibbonOutline />
          </div>
          <div className={styles.endingMeta}>
            <strong>Official Certificate</strong>
            <span>Available upon passing the exam</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumSidebar;
