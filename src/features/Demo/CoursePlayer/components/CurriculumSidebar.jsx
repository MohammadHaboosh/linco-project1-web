import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoCheckmarkCircle,
  IoLockClosed,
  IoPlayCircle,
  IoChevronDown,
  IoShieldCheckmarkOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import styles from "./CoursePlayer.module.css"; // تأكد أن هذا هو الملف المستدعى لديك

const CurriculumSidebar = ({ sections }) => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState([2]); // فتح السيكشن الثاني افتراضياً

  const toggleSection = (id) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  return (
    <div className={styles.playlistContainer}>
      <div className={styles.playlistHeader}>
        <h3>Course Content</h3>
      </div>

      <div className={styles.playlistScrollArea}>
        {sections?.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          return (
            <div key={section.id} className={styles.moduleWrapper}>
              {/* رأس السيكشن */}
              <div
                className={`${styles.moduleHeader} ${isExpanded ? styles.moduleHeaderActive : ""}`}
                onClick={() => toggleSection(section.id)}
              >
                <div className={styles.moduleTitleBox}>
                  <h4>{section.title}</h4>
                  <span>{section.lessons?.length || 0} lessons</span>
                </div>
                <IoChevronDown
                  className={`${styles.chevron} ${isExpanded ? styles.rotated : ""}`}
                />
              </div>

              {/* قائمة الدروس والكويز */}
              {isExpanded && (
                <div className={styles.moduleLessons}>
                  {/* عرض الدروس أولاً */}
                  {section.lessons?.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`${styles.lessonRow} ${lesson.status === "playing" ? styles.lessonRowActive : ""}`}
                      onClick={() => navigate(`lesson/${lesson.id}`)} // 👈 توجيه نسبي آمن
                    >
                      <div className={styles.lessonMeta}>
                        <span className={styles.lessonName}>
                          {lesson.title}
                        </span>
                        <span className={styles.lessonDuration}>
                          {lesson.duration}
                        </span>
                      </div>
                      <div className={styles.lessonStatus}>
                        {lesson.status === "completed" && (
                          <IoCheckmarkCircle
                            className={styles.statusCompleted}
                          />
                        )}
                        {lesson.status === "playing" && (
                          <IoPlayCircle className={styles.statusPlaying} />
                        )}
                        {lesson.status === "locked" && (
                          <IoLockClosed className={styles.statusLocked} />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* 💡 كويز نهاية السيكشن الفخم بالتوجيه النسبي الآمن */}
                  <div
                    className={styles.sidebarQuizItem}
                    onClick={() => navigate(`quiz/${section.id}`)} // 👈 سيفتح الكويز فوراً بدون undefined
                  >
                    <div className={styles.quizLeftContent}>
                      <div className={styles.quizIconCircle}>
                        <IoShieldCheckmarkOutline />
                      </div>
                      <div className={styles.quizMetaText}>
                        <span className={styles.quizTitle}>
                          Final Assessment
                        </span>
                        <span className={styles.quizSub}>
                          Requires {section.passingScore || 80}% to pass
                        </span>
                      </div>
                    </div>
                    <IoChevronForwardOutline className={styles.quizArrow} />
                  </div>
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
