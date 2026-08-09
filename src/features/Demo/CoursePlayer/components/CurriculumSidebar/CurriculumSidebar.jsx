import React, { useState } from "react";
import styles from "./CurriculumSidebar.module.css";
import {
  IoChevronUpOutline,
  IoChevronDownOutline,
  IoPlayCircle,
  IoCheckmarkCircle,
  IoLockClosed,
} from "react-icons/io5";

const sections = [
  {
    id: 1,
    title: "مقدمة في React",
    progress: 100,
    lessons: [
      {
        id: 101,
        title: "ما هو React ولماذا نستخدمه؟",
        duration: "05:20",
        status: "completed",
      },
      {
        id: 102,
        title: "إعداد بيئة العمل",
        duration: "08:15",
        status: "completed",
      },
      {
        id: 103,
        title: "أول تطبيق لك",
        duration: "12:00",
        status: "completed",
      },
    ],
  },
  {
    id: 2,
    title: "مكونات React (Components)",
    progress: 33,
    lessons: [
      {
        id: 201,
        title: "دورة حياة المكون (Lifecycle)",
        duration: "14:40",
        status: "active",
      },
      {
        id: 202,
        title: "الخصائص (Props)",
        duration: "10:15",
        status: "locked",
      },
      { id: 203, title: "الحالة (State)", duration: "18:20", status: "locked" },
    ],
  },
];

const CurriculumSidebar = () => {
  const [expanded, setExpanded] = useState([1, 2]);

  const toggleSection = (id) => {
    setExpanded((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
    );
  };

  return (
    <div className={styles.curriculumViewer}>
      <div className={styles.courseProgressCard}>
        <div className={styles.progressHeader}>
          <h3>تقدمك في الكورس</h3>
          <span>38%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: "38%" }}></div>
        </div>
        <p>لقد أنهيت 4 من أصل 12 درساً. استمر!</p>
      </div>

      <div className={styles.sectionsList}>
        {sections.map((section, index) => {
          const isExpanded = expanded.includes(section.id);
          return (
            <div className={styles.sectionCard} key={section.id}>
              <div
                className={styles.sectionHeader}
                onClick={() => toggleSection(section.id)}
              >
                <div className={styles.sectionHeaderInfo}>
                  <h4>
                    القسم {index + 1}: {section.title}
                  </h4>
                  <span className={styles.sectionMeta}>
                    {section.lessons.length} دروس
                  </span>
                </div>
                <div className={styles.headerRight}>
                  {section.progress === 100 && (
                    <IoCheckmarkCircle
                      className={styles.sectionCompletedIcon}
                    />
                  )}
                  <span className={styles.toggleIcon}>
                    {isExpanded ? (
                      <IoChevronUpOutline />
                    ) : (
                      <IoChevronDownOutline />
                    )}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className={styles.lessonsList}>
                  {section.lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className={`${styles.lessonRow} ${styles[lesson.status]}`}
                    >
                      <div className={styles.lessonIcon}>
                        {lesson.status === "completed" && (
                          <IoCheckmarkCircle className={styles.iconSuccess} />
                        )}
                        {lesson.status === "active" && (
                          <IoPlayCircle className={styles.iconActive} />
                        )}
                        {lesson.status === "locked" && (
                          <IoLockClosed className={styles.iconLocked} />
                        )}
                      </div>
                      <div className={styles.lessonDetails}>
                        <span className={styles.lessonTitle}>
                          {idx + 1}. {lesson.title}
                        </span>
                        <span className={styles.lessonDuration}>
                          {lesson.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurriculumSidebar;
