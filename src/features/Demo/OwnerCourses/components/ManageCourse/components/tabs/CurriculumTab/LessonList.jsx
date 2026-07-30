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
      {lessons.length > 0 && (
        <div className={styles.lessonsList}>
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
                  <IoTimeOutline /> {lesson.duration || "00:00"}
                </span>
                <button
                  className={styles.iconBtn}
                  type="button"
                  title="Edit Lesson"
                >
                  <IoPencilOutline />
                </button>
                <button
                  className={styles.iconBtnDanger}
                  type="button"
                  title="Delete Lesson"
                  onClick={() => onDeleteLesson && onDeleteLesson(lesson.id)}
                >
                  <IoTrashOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* مستطيل إضافة الدرس المحدث - بنفس طراز مستطيلي الكويز والبنك ولكن باللون الأزرق */}
      <button
        type="button"
        className={styles.addLessonBox}
        onClick={onAddLesson}
      >
        <IoAddCircleOutline className={styles.addIcon} />
        <span>Add Lesson</span>
      </button>
    </div>
  );
};

export default LessonList;
