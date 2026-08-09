import React, { useMemo, useState } from "react";
import styles from "./CurriculumSidebar.module.css";
import {
  IoAddOutline,
  IoChevronDownOutline,
  IoCheckmarkCircle,
  IoPlayCircleOutline,
  IoTimeOutline,
  IoAttachOutline,
  IoDocumentTextOutline,
  IoTrashOutline,
  IoLibraryOutline,
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
  IoArrowBackOutline,
} from "react-icons/io5";

const sections = [
  {
    id: 1,
    title: "React Fundamentals",
    lessons: 6,
    duration: "1h 24m",
    progress: 100,
    items: [
      {
        id: 101,
        title: "Introduction to React & Architecture",
        duration: "12:30",
        attachments: 2,
        completed: true,
      },
      {
        id: 102,
        title: "Understanding Virtual DOM & Lifecycle",
        duration: "18:45",
        attachments: 0,
        completed: true,
      },
      {
        id: 103,
        title: "Components, Props & Composition",
        duration: "16:20",
        attachments: 1,
        completed: true,
      },
      {
        id: 104,
        title: "State & Event Handling",
        duration: "14:10",
        attachments: 0,
        completed: true,
      },
    ],
  },
  {
    id: 2,
    title: "Hooks & Application Architecture",
    lessons: 8,
    duration: "2h 08m",
    progress: 48,
    items: [
      {
        id: 201,
        title: "Component Lifecycle & Hooks",
        duration: "12:40",
        attachments: 3,
        completed: false,
      },
      {
        id: 202,
        title: "useEffect Patterns & Cleanup",
        duration: "19:15",
        attachments: 1,
        completed: false,
      },
      {
        id: 203,
        title: "Custom Hooks in Production",
        duration: "17:40",
        attachments: 0,
        completed: false,
      },
      {
        id: 204,
        title: "State Management Strategy",
        duration: "22:05",
        attachments: 0,
        completed: false,
      },
    ],
  },
  {
    id: 3,
    title: "Next.js Production Patterns",
    lessons: 7,
    duration: "2h 32m",
    progress: 0,
    items: [
      {
        id: 301,
        title: "App Router Architecture",
        duration: "21:10",
        attachments: 2,
        completed: false,
      },
      {
        id: 302,
        title: "Server & Client Components",
        duration: "18:30",
        attachments: 1,
        completed: false,
      },
    ],
  },
];

const CurriculumSidebar = ({ activeLesson, setActiveLesson }) => {
  const [expanded, setExpanded] = useState([1, 2]);
  const [activeTab, setActiveTab] = useState("curriculum");

  const totalLessons = useMemo(
    () => sections.reduce((sum, section) => sum + section.lessons, 0),
    [],
  );

  const toggleSection = (id) => {
    setExpanded((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <div className={styles.curriculum}>
      <div className={styles.topSummary}>
        <div className={styles.summaryStat}>
          <strong>68%</strong>
          <span>منجز</span>
        </div>
        <div className={styles.summaryProgress}>
          <div className={styles.progressLabels}>
            <span>تقدم الكورس</span>
            <strong>12 / {totalLessons}</strong>
          </div>
          <div className={styles.progressTrack}>
            <i style={{ width: "68%" }} />
          </div>
        </div>
        <div className={styles.summaryBadge}>On track</div>
      </div>

      <div className={styles.curriculumTabs}>
        <button
          type="button"
          className={activeTab === "curriculum" ? styles.activeTab : ""}
          onClick={() => setActiveTab("curriculum")}
        >
          المنهج
        </button>
        <button
          type="button"
          className={activeTab === "resources" ? styles.activeTab : ""}
          onClick={() => setActiveTab("resources")}
        >
          مواردي
        </button>
      </div>

      {activeTab === "curriculum" ? (
        <div className={styles.sectionList}>
          {sections.map((section, sectionIndex) => {
            const isExpanded = expanded.includes(section.id);
            return (
              <article className={styles.sectionCard} key={section.id}>
                <button
                  type="button"
                  className={styles.sectionHeader}
                  onClick={() => toggleSection(section.id)}
                >
                  <div className={styles.sectionNumber}>
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </div>
                  <div className={styles.sectionHeading}>
                    <div className={styles.sectionTitleLine}>
                      <h3>{section.title}</h3>
                      {section.progress === 100 && (
                        <span className={styles.completedPill}>
                          <IoCheckmarkCircle /> مكتمل
                        </span>
                      )}
                    </div>
                    <div className={styles.sectionMeta}>
                      <span>{section.lessons} دروس</span>
                      <span>•</span>
                      <span>{section.duration}</span>
                      <span>•</span>
                      <span>{section.progress}%</span>
                    </div>
                    <div className={styles.miniTrack}>
                      <i style={{ width: `${section.progress}%` }} />
                    </div>
                  </div>
                  <span
                    className={`${styles.chevron} ${isExpanded ? styles.rotated : ""}`}
                  >
                    <IoChevronDownOutline />
                  </span>
                </button>

                {isExpanded && (
                  <div className={styles.lessonList}>
                    {section.items.map((item, index) => {
                      const active = activeLesson === item.id;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          className={`${styles.lessonRow} ${active ? styles.activeLesson : ""}`}
                          onClick={() => setActiveLesson(item.id)}
                        >
                          <span className={styles.lessonIndex}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className={styles.lessonState}>
                            {item.completed ? (
                              <IoCheckmarkCircle />
                            ) : (
                              <IoPlayCircleOutline />
                            )}
                          </span>
                          <span className={styles.lessonInfo}>
                            <strong>{item.title}</strong>
                            <small>
                              <IoTimeOutline /> {item.duration}
                            </small>
                          </span>
                          <span className={styles.attachmentPill}>
                            <IoAttachOutline />
                            {item.attachments}
                          </span>
                          {active && (
                            <span className={styles.activeArrow}>
                              <IoArrowBackOutline />
                            </span>
                          )}
                        </button>
                      );
                    })}

                    <div className={styles.sectionTools}>
                      <button type="button">
                        <IoLibraryOutline />
                        Question Bank
                        <span>12</span>
                      </button>
                      <button type="button">
                        <IoShieldCheckmarkOutline />
                        Section Assessment
                        <span>10 Q</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.resourceState}>
          <div className={styles.resourceIcon}>
            <IoDocumentTextOutline />
          </div>
          <h3>مواردك المحفوظة</h3>
          <p>
            الملفات، الملاحظات، والموارد التي أضفتها أثناء التعلم ستظهر هنا.
          </p>
          <button type="button">
            <IoAddOutline /> إضافة مورد
          </button>
        </div>
      )}

      <div className={styles.footerCards}>
        <button type="button" className={styles.assessmentCard}>
          <span className={styles.footerIcon}>
            <IoShieldCheckmarkOutline />
          </span>
          <span>
            <strong>Final Course Assessment</strong>
            <small>40 سؤال • مطلوب للحصول على الشهادة</small>
          </span>
          <IoArrowBackOutline />
        </button>
        <button
          type="button"
          className={`${styles.assessmentCard} ${styles.lockedCard}`}
        >
          <span className={styles.footerIcon}>
            <IoLockClosedOutline />
          </span>
          <span>
            <strong>Official Certificate</strong>
            <small>يفتح بعد اجتياز التقييم النهائي</small>
          </span>
          <IoLockClosedOutline />
        </button>
      </div>
    </div>
  );
};

export default CurriculumSidebar;
