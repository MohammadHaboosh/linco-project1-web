import React from "react";
import {
  IoReorderTwoOutline,
  IoVideocamOutline,
  IoTimeOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import styles from "./LessonList.module.css";

const LessonList = ({ lessons = [], onAddLesson, onDeleteLesson }) => {
  return (
    <div className={styles.lessonsContainer}>
      {lessons.map((lesson, lIdx) => (
        <div key={lesson.id} className={styles.lessonItem}>
          <div className={styles.lessonInfo}>
            <IoReorderTwoOutline className={styles.dragHandle} />
            <span className={styles.lessonNumber}>Lesson {lIdx + 1}:</span>
            <IoVideocamOutline className={styles.lessonTypeIcon} />
            <span className={styles.lessonTitle}>{lesson.title}</span>
          </div>
          <div className={styles.lessonMeta}>
            <span className={styles.lessonDuration}>
              <IoTimeOutline /> {lesson.duration || "0:00"}
            </span>
            <button className={styles.iconBtn} type="button">
              <IoPencilOutline />
            </button>
            <button
              className={styles.iconBtnDanger}
              type="button"
              onClick={() => onDeleteLesson && onDeleteLesson(lesson.id)}
            >
              <IoTrashOutline />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className={styles.addLessonBtn}
        onClick={onAddLesson}
      >
        <IoAddCircleOutline /> Add Lesson
      </button>
    </div>
  );
};

export default LessonList;
