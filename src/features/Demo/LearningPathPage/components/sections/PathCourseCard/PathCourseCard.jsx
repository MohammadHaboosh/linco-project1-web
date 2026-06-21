import { useState } from "react";
import {
  IoChevronDown,
  IoChevronUp,
  IoLockClosedOutline,
  IoPlayOutline,
} from "react-icons/io5";
import styles from "./PathCourseCard.module.css";

const PathCourseCard = ({ course }) => {
  // الكرت يكون مفتوحاً افتراضياً إذا كانت حالته 'active' ومطلوب فتحه
  const [isExpanded, setIsExpanded] = useState(course.defaultExpanded || false);

  const toggleExpand = () => {
    if (course.status !== "locked") {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`${styles.card} ${styles[course.status]}`}>
      {/* رأس الكرت */}
      <div className={styles["card-header"]} onClick={toggleExpand}>
        <div className={styles["header-left"]}>
          <span className={styles["course-title"]}>
            {course.id}- {course.title}
          </span>
          {/* إظهار التاجز في الرأس إذا كان مغلقاً أو مقفلاً */}
          {(!isExpanded || course.status === "locked") && (
            <div className={styles.topics}>
              {course.topics.map((topic, i) => (
                <span key={i} className={styles["topic-tag"]}>
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles["header-right"]}>
          <div className={styles["progress-mini"]}>
            <div className={styles["progress-labels"]}>
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className={styles["progress-bar"]}>
              <div
                className={styles["progress-fill"]}
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
          {/* الأيقونة تتغير حسب الحالة */}
          {course.status === "locked" ? (
            <IoLockClosedOutline
              className={styles["action-icon"]}
              style={{ color: "#94a3b8" }}
            />
          ) : isExpanded ? (
            <IoChevronUp className={styles["action-icon"]} />
          ) : (
            <IoChevronDown className={styles["action-icon"]} />
          )}
        </div>
      </div>

      {/* جسم الكرت (يظهر فقط إذا كان مفتوحاً) */}
      {isExpanded && course.status !== "locked" && (
        <div className={styles["card-body"]}>
          <div className={styles["image-container"]}>image</div>
          <div className={styles.details}>
            <p className={styles.description}>{course.description}</p>

            <div className={styles["bottom-row"]}>
              <div className={styles.topics}>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    color: "var(--color-linco-navy)",
                  }}
                >
                  Topics
                </span>
                {course.topics.map((topic, i) => (
                  <span key={i} className={styles["topic-tag"]}>
                    {topic}
                  </span>
                ))}
              </div>
              <button className={styles["btn-continue"]}>
                <IoPlayOutline style={{ fontSize: "1.2rem" }} /> Continue Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathCourseCard;
