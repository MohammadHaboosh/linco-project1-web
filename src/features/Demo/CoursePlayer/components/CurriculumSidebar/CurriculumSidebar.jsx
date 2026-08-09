import React, { useState } from "react";
import styles from "./CurriculumSidebar.module.css";
import {
  IoChevronUp,
  IoChevronDown,
  IoPlayCircle,
  IoLockClosed,
  IoCheckmarkCircle,
} from "react-icons/io5";

const chapters = [
  {
    id: 1,
    title: "Chapter 1 - Introduction",
    lessonsCount: 2,
    lessons: [],
  },
  {
    id: 2,
    title: "Chapter 2 - Core Concepts",
    lessonsCount: 2,
    lessons: [
      {
        id: 201,
        title: "Understanding the DOM",
        duration: "15:20",
        status: "active",
      },
      {
        id: 202,
        title: "State Management Basics",
        duration: "20:00",
        status: "locked",
      },
    ],
    hasAssessment: true,
  },
  { id: 3, title: "Chapter 3 - Advanced Topics", lessonsCount: 2, lessons: [] },
  {
    id: 4,
    title: "Chapter 4 - Performance Optimization",
    lessonsCount: 2,
    lessons: [],
  },
];

const CurriculumSidebar = () => {
  const [expanded, setExpanded] = useState([2]);

  const toggleChapter = (id) => {
    setExpanded((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
    );
  };

  return (
    <div className={styles.sidebarContainer}>
      <h2 className={styles.sidebarTitle}>Course Content</h2>

      <div className={styles.chaptersList}>
        {chapters.map((chapter) => {
          const isExpanded = expanded.includes(chapter.id);
          return (
            <div className={styles.chapterCard} key={chapter.id}>
              {/* Chapter Header */}
              <div
                className={styles.chapterHeader}
                onClick={() => toggleChapter(chapter.id)}
              >
                <div className={styles.headerInfo}>
                  <h3>{chapter.title}</h3>
                  <span>{chapter.lessonsCount} lessons</span>
                </div>
                <div className={styles.chevron}>
                  {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
                </div>
              </div>

              {/* Chapter Lessons */}
              {isExpanded && chapter.lessons.length > 0 && (
                <div className={styles.lessonsContainer}>
                  {chapter.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`${styles.lessonItem} ${styles[lesson.status]}`}
                    >
                      <div className={styles.lessonDetails}>
                        <h4 className={styles.lessonTitle}>{lesson.title}</h4>
                        <span className={styles.lessonDuration}>
                          {lesson.duration}
                        </span>
                      </div>
                      <div className={styles.lessonIcon}>
                        {lesson.status === "active" && <IoPlayCircle />}
                        {lesson.status === "locked" && <IoLockClosed />}
                        {lesson.status === "completed" && <IoCheckmarkCircle />}
                      </div>
                    </div>
                  ))}

                  {chapter.hasAssessment && (
                    <div className={styles.assessmentBox}>
                      <IoCheckmarkCircle className={styles.assessmentIcon} />
                      <div className={styles.assessmentText}>
                        <strong>Final Assessment</strong>
                        <span>Requires 80% to pass</span>
                      </div>
                    </div>
                  )}
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
