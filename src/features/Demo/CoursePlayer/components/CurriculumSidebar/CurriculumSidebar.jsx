import React, { useState } from "react";
import styles from "./CurriculumSidebar.module.css";
import {
  IoChevronDown,
  IoPlay,
  IoLockClosed,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoDocumentTextOutline,
  IoTrophyOutline,
  IoRibbonOutline,
} from "react-icons/io5";

const chapters = [
  {
    id: 1,
    title: "Introduction",
    subtitle: "Foundations & workflow",
    progress: 100,
    completed: 2,
    lessons: [
      {
        id: 101,
        title: "Welcome to the architecture",
        duration: "08:40",
        status: "completed",
        attachments: 1,
      },
      {
        id: 102,
        title: "Project structure & conventions",
        duration: "12:10",
        status: "completed",
        attachments: 2,
      },
    ],
  },
  {
    id: 2,
    title: "Core Concepts",
    subtitle: "DOM, state & rendering",
    progress: 50,
    completed: 1,
    lessons: [
      {
        id: 201,
        title: "Understanding the DOM",
        duration: "15:20",
        status: "active",
        attachments: 3,
      },
      {
        id: 202,
        title: "State Management Basics",
        duration: "20:00",
        status: "locked",
        attachments: 0,
      },
    ],
    hasAssessment: true,
  },
  {
    id: 3,
    title: "Architecture Patterns",
    subtitle: "Build for scale",
    progress: 0,
    completed: 0,
    lessons: [],
  },
];

const CurriculumSidebar = () => {
  const [expanded, setExpanded] = useState([1, 2]);
  const [activeLesson, setActiveLesson] = useState(201);

  const toggleChapter = (id) => {
    setExpanded((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
    );
  };

  const totalLessons = chapters.reduce(
    (sum, chapter) => sum + chapter.lessons.length,
    0,
  );
  const completedLessons = chapters.reduce(
    (sum, chapter) => sum + chapter.completed,
    0,
  );

  return (
    <div className={styles.curriculum}>
      <section className={styles.progressCard}>
        <div className={styles.progressTop}>
          <div>
            <span className={styles.eyebrow}>YOUR LEARNING PATH</span>
            <strong>Course progress</strong>
          </div>
          <strong className={styles.progressValue}>35%</strong>
        </div>
        <div className={styles.progressTrack}>
          <span style={{ width: "35%" }} />
        </div>
        <div className={styles.progressMeta}>
          <span>
            {completedLessons} of {totalLessons} lessons
          </span>
          <span>~ 2h 10m left</span>
        </div>
      </section>

      <div className={styles.chapterList}>
        {chapters.map((chapter) => {
          const isExpanded = expanded.includes(chapter.id);
          return (
            <section
              key={chapter.id}
              className={`${styles.chapterCard} ${isExpanded ? styles.expanded : ""}`}
            >
              <button
                className={styles.chapterHeader}
                onClick={() => toggleChapter(chapter.id)}
                aria-expanded={isExpanded}
              >
                <span className={styles.chapterNumber}>
                  {String(chapter.id).padStart(2, "0")}
                </span>
                <span className={styles.chapterInfo}>
                  <strong>{chapter.title}</strong>
                  <small>{chapter.subtitle}</small>
                </span>
                <span className={styles.chapterProgress}>
                  {chapter.progress}%
                </span>
                <IoChevronDown className={styles.chevron} />
              </button>

              <div className={styles.chapterProgressTrack}>
                <span style={{ width: `${chapter.progress}%` }} />
              </div>

              {isExpanded && chapter.lessons.length > 0 && (
                <div className={styles.lessonList}>
                  {chapter.lessons.map((lesson, index) => {
                    const isActive = activeLesson === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        className={`${styles.lessonItem} ${styles[lesson.status]} ${isActive ? styles.selected : ""}`}
                        onClick={() =>
                          lesson.status !== "locked" &&
                          setActiveLesson(lesson.id)
                        }
                        disabled={lesson.status === "locked"}
                      >
                        <span className={styles.lessonRail} />
                        <span className={styles.lessonStatus}>
                          {lesson.status === "completed" && (
                            <IoCheckmarkCircle />
                          )}
                          {lesson.status === "active" && <IoPlay />}
                          {lesson.status === "locked" && <IoLockClosed />}
                        </span>
                        <span className={styles.lessonBody}>
                          <span className={styles.lessonTitle}>
                            {index + 1}. {lesson.title}
                          </span>
                          <span className={styles.lessonMeta}>
                            <span>
                              <IoTimeOutline /> {lesson.duration}
                            </span>
                            {lesson.attachments > 0 && (
                              <span>
                                <IoDocumentTextOutline /> {lesson.attachments}
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                    );
                  })}

                  {chapter.hasAssessment && (
                    <button className={styles.assessmentBox}>
                      <span className={styles.assessmentIcon}>
                        <IoTrophyOutline />
                      </span>
                      <span className={styles.assessmentText}>
                        <strong>Section assessment</strong>
                        <small>5 questions · 80% to pass</small>
                      </span>
                      <span className={styles.assessmentArrow}>→</span>
                    </button>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <button className={styles.finalAssessment}>
        <span className={styles.finalIcon}>
          <IoTrophyOutline />
        </span>
        <span>
          <strong>Final Assessment</strong>
          <small>Unlock after completing all lessons</small>
        </span>
      </button>

      <div className={styles.certificate}>
        <span className={styles.certificateIcon}>
          <IoRibbonOutline />
        </span>
        <span>
          <strong>Certificate</strong>
          <small>Issued when you pass the final assessment</small>
        </span>
      </div>
    </div>
  );
};

export default CurriculumSidebar;
