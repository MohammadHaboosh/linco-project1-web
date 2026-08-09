import React, { useState } from "react";
import styles from "./CurriculumSidebar.module.css";
import {
  IoPlayCircleOutline,
  IoCheckmarkCircle,
  IoHelpCircleOutline,
  IoChevronDown,
  IoTrophyOutline,
  IoRibbonOutline,
} from "react-icons/io5";

const CurriculumSidebar = ({ activeLesson, setActiveLesson }) => {
  const [expandedSection, setExpandedSection] = useState(1);

  const sections = [
    {
      id: 1,
      title: "الوحدة الأولى: الأساسيات والتقدم",
      progress: 65,
      items: [
        {
          id: 101,
          type: "video",
          title: "مقدمة في React وعمارة التطبيقات",
          duration: "12:30",
          completed: true,
        },
        {
          id: 102,
          type: "video",
          title: "فهم الـ Virtual DOM ودورة الحياة",
          duration: "18:45",
          completed: false,
        },
        {
          id: 103,
          type: "quiz",
          title: "اختبار تقييمي للوحدة الأولى",
          duration: "10 أسئلة",
        },
      ],
    },
  ];

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarHeader}>
        <h3>محتوى الكورس</h3>
        {sections.map((sec) => (
          <div key={sec.id} className={styles.courseProgress}>
            <div className={styles.progressInfoBar}>
              <span>التقدم العام للوحدة</span>
              <span>{sec.progress}%</span>
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
              className={styles.sectionTitle}
              onClick={() =>
                setExpandedSection(
                  expandedSection === section.id ? null : section.id,
                )
              }
            >
              <h4>{section.title}</h4>
              <IoChevronDown
                className={`${styles.chevron} ${
                  expandedSection === section.id ? styles.rotated : ""
                }`}
              />
            </div>

            {expandedSection === section.id && (
              <div className={styles.sectionItems}>
                {section.items.map((item) => (
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
                        <IoPlayCircleOutline />
                      ) : null}
                      {item.type === "quiz" ? (
                        <IoHelpCircleOutline className={styles.iconQuiz} />
                      ) : null}
                    </div>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemTitle}>{item.title}</span>
                      <span className={styles.itemDuration}>
                        {item.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* منطقة النهاية والشهادات */}
      <div className={styles.courseEndings}>
        <div className={styles.endingCard}>
          <div
            className={styles.endingIconWrapper}
            style={{ background: "#fef3c7", color: "#d97706" }}
          >
            <IoTrophyOutline />
          </div>
          <div className={styles.endingMeta}>
            <strong>الاختبار النهائي للكورس</strong>
            <span>مطلوب لاجتياز الدورة بنجاح</span>
          </div>
        </div>

        <div className={`${styles.endingCard} ${styles.locked}`}>
          <div
            className={styles.endingIconWrapper}
            style={{ background: "#e0e7ff", color: "#4338ca" }}
          >
            <IoRibbonOutline />
          </div>
          <div className={styles.endingMeta}>
            <strong>شهادة الإتمام الرسمية</strong>
            <span>تتاح مباشرة بعد اجتياز الاختبار</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumSidebar;
