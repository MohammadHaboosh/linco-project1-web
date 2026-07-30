import React from "react";
import {
  IoChevronDownOutline,
  IoTrashOutline,
  IoVideocamOutline,
  IoHelpCircleOutline,
} from "react-icons/io5";
import LessonItem from "./LessonItem";
import QuizItem from "./QuizItem";

const SectionCard = ({
  section,
  sIndex,
  courseData,
  updateCourseData,
  toggleSection,
  deleteSection,
  deleteLesson,
  deleteQuiz,
  setModalState,
  draggedLessonIdx,
  draggedSectionId,
  handleDragStart,
  handleDrop,
  styles,
}) => {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div
          className={styles.sectionHeaderLeft}
          onClick={() => toggleSection(section.id)}
        >
          <IoChevronDownOutline
            className={`${styles.chevronIcon} ${
              section.isExpanded ? styles.rotated : ""
            }`}
          />
          <span className={styles.sectionNum}>Section {sIndex + 1}:</span>
        </div>
        <input
          type="text"
          value={section.title}
          onChange={(e) =>
            updateCourseData(
              "sections",
              courseData.sections.map((s) =>
                s.id === section.id ? { ...s, title: e.target.value } : s,
              ),
            )
          }
          className={styles.sectionTitleInput}
          placeholder="Section Title"
        />
        <button
          className={styles.deleteIcon}
          onClick={() => deleteSection(section.id)}
          title="Delete Section"
        >
          <IoTrashOutline />
        </button>
      </div>

      {section.isExpanded && (
        <div className={styles.lessonsList}>
          {section.lessons.map((lesson, lIndex) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              lIndex={lIndex}
              sectionId={section.id}
              draggedLessonIdx={draggedLessonIdx}
              draggedSectionId={draggedSectionId}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
              onEdit={() =>
                setModalState({
                  isOpen: true,
                  type: "video",
                  sectionId: section.id,
                  editData: lesson,
                })
              }
              onDelete={() => deleteLesson(section.id, lesson.id)}
              styles={styles}
            />
          ))}

          {/* Final Quiz Item */}
          {section.quiz && (
            <QuizItem
              quiz={section.quiz}
              onEdit={() =>
                setModalState({
                  isOpen: true,
                  type: "quiz",
                  sectionId: section.id,
                  editData: section.quiz,
                })
              }
              onDelete={() => deleteQuiz(section.id)}
              styles={styles}
            />
          )}

          {/* Action Buttons */}
          <div className={styles.addItemsActions}>
            <button
              className={styles.addLessonBtn}
              onClick={() =>
                setModalState({
                  isOpen: true,
                  type: "video",
                  sectionId: section.id,
                  editData: null,
                })
              }
            >
              <IoVideocamOutline /> Add Video Lesson
            </button>
            {!section.quiz && (
              <button
                className={styles.addQuizBtn}
                onClick={() =>
                  setModalState({
                    isOpen: true,
                    type: "quiz",
                    sectionId: section.id,
                    editData: null,
                  })
                }
              >
                <IoHelpCircleOutline /> Add Final Assessment
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionCard;
