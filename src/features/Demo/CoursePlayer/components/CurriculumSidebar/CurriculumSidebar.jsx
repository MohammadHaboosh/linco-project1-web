import React, { useState } from "react";
import styles from "./CurriculumSidebar.module.css";
import {
  IoChevronDown,
  IoPlayCircle,
  IoLockClosed,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoDocumentTextOutline,
  IoTrophyOutline,
  IoRibbonOutline,
  IoAttachOutline,
} from "react-icons/io5";

const chapters = [
  {
    id: 1,
    title: "Introduction",
    subtitle: "Foundations & workflow",
    progress: 100,
    lessonsCount: 2,
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
    lessonsCount: 2,
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
    lessonsCount: 3,
    lessons: [
      {
        id: 301,
        title: "Component boundaries",
        duration: "18:30",
        status: "locked",
        attachments: 1,
      },
      {
        id: 302,
        title: "Data flow patterns",
        duration: "16:45",
        status: "locked",
        attachments: 0,
      },
      {
        id: 303,
        title: "Performance checklist",
        duration: "11:25",
        status: "locked",
        attachments: 2,
      },
    ],
  },
];

const CurriculumSidebar = () => {
  const [expanded, setExpanded] = useState([2]);
  const toggleChapter = (id) =>
    setExpanded((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  const totalLessons = chapters.reduce((sum, c) => sum + c.lessonsCount, 0);
  const completedLessons = chapters.reduce(
    (sum, c) => sum + c.lessons.filter((l) => l.status === "completed").length,
    0,
  );

  return (
    <div className={styles.curriculum}>
      <div className={styles.overview}>
        <div className={styles.overviewTop}>
          <div>
            <span className={styles.eyebrow}>YOUR LEARNING PATH</span>
            <h3>Course progress</h3>
          </div>
          <strong>35%</strong>
        </div>
        <div className={styles.progressTrack}>
          <span style={{ width: "35%" }} />
        </div>
        <div className={styles.overviewBottom}>
          <span>
            {completedLessons} of {totalLessons} lessons
          </span>
          <span>~ 2h 10m left</span>
        </div>
      </div>

      <div className={styles.chapterList}>
        {chapters.map((chapter) => {
          const isExpanded = expanded.includes(chapter.id);
          return (
            <section
              className={`${styles.chapter} ${isExpanded ? styles.expanded : ""}`}
              key={chapter.id}
            >
              <button
                type="button"
                className={styles.chapterHeader}
                onClick={() => toggleChapter(chapter.id)}
              >
                <span className={styles.chapterNumber}>
                  {String(chapter.id).padStart(2, "0")}
                </span>
                <span className={styles.chapterInfo}>
                  <strong>{chapter.title}</strong>
                  <small>{chapter.subtitle}</small>
                </span>
                <span className={styles.chapterMeta}>
                  <b>{chapter.progress}%</b>
                  <IoChevronDown />
                </span>
              </button>
              <div className={styles.chapterProgress}>
                <span style={{ width: `${chapter.progress}%` }} />
              </div>

              {isExpanded && (
                <div className={styles.lessons}>
                  {chapter.lessons.map((lesson, index) => (
                    <button
                      type="button"
                      key={lesson.id}
                      className={`${styles.lesson} ${styles[lesson.status]}`}
                    >
                      <span className={styles.lessonRail}>
                        <i />
                      </span>
                      <span className={styles.lessonIcon}>
                        {lesson.status === "completed" ? (
                          <IoCheckmarkCircle />
                        ) : lesson.status === "locked" ? (
                          <IoLockClosed />
                        ) : (
                          <IoPlayCircle />
                        )}
                      </span>
                      <span className={styles.lessonCopy}>
                        <strong>
                          {index + 1}. {lesson.title}
                        </strong>
                        <span>
                          <IoTimeOutline /> {lesson.duration}
                          {lesson.attachments ? (
                            <>
                              {" "}
                              <em>·</em> <IoAttachOutline />{" "}
                              {lesson.attachments}
                            </>
                          ) : null}
                        </span>
                      </span>
                      {lesson.status === "active" && (
                        <span className={styles.nowBadge}>NOW</span>
                      )}
                    </button>
                  ))}
                  {chapter.hasAssessment && (
                    <button type="button" className={styles.assessment}>
                      <span className={styles.assessmentIcon}>
                        <IoTrophyOutline />
                      </span>
                      <span>
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

      <div className={styles.courseEndings}>
        <div className={styles.endingCard}>
          <IoTrophyOutline />
          <span>
            <strong>Final Assessment</strong>
            <small>Unlock after completing all lessons</small>
          </span>
        </div>
        <div className={`${styles.endingCard} ${styles.lockedEnding}`}>
          <IoRibbonOutline />
          <span>
            <strong>Certificate</strong>
            <small>Issued when you pass the final assessment</small>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurriculumSidebar;
