import { useState } from "react";
import {
  IoAddOutline,
  IoTrashOutline,
  IoVideocamOutline,
  IoHelpCircleOutline,
  IoShieldCheckmarkOutline,
  IoChevronDownOutline,
  IoPencilOutline,
  IoCheckmarkCircleOutline,
  IoDocumentAttachOutline,
} from "react-icons/io5";
import LessonBuilderModal from "./LessonBuilderModal";
import QuizBuilderModal from "./QuizBuilderModal";
import styles from "./CourseStudio.module.css";
import { useTranslation } from "react-i18next";

const StepTwoCurriculum = ({
  courseData,
  updateCourseData,
  onPublish,
  isPublishing,
}) => {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    sectionId: null,
    editData: null,
  });
  const [draggedLessonIdx, setDraggedLessonIdx] = useState(null);
  const [draggedSectionId, setDraggedSectionId] = useState(null);

  const addSection = () => {
    const newSections = [
      ...courseData.sections,
      {
        id: Date.now(),
        title: "New Section",
        isExpanded: true,
        lessons: [],
        quiz: null,
      },
    ];
    updateCourseData("sections", newSections);
  };

  const toggleSection = (id) => {
    updateCourseData(
      "sections",
      courseData.sections.map((sec) =>
        sec.id === id ? { ...sec, isExpanded: !sec.isExpanded } : sec,
      ),
    );
  };

  const handleSaveItem = (itemData) => {
    const newSections = courseData.sections.map((sec) => {
      if (sec.id === modalState.sectionId) {
        if (modalState.type === "video") {
          if (modalState.editData) {
            return {
              ...sec,
              lessons: sec.lessons.map((l) =>
                l.id === itemData.id ? itemData : l,
              ),
            };
          }
          return {
            ...sec,
            lessons: [...sec.lessons, { id: Date.now(), ...itemData }],
          };
        } else if (modalState.type === "quiz") {
          return { ...sec, quiz: { id: Date.now(), ...itemData } };
        }
      }
      return sec;
    });
    updateCourseData("sections", newSections);
    setModalState({
      isOpen: false,
      type: null,
      sectionId: null,
      editData: null,
    });
  };

  const handleDragStart = (e, sectionId, index) => {
    setDraggedLessonIdx(index);
    setDraggedSectionId(sectionId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, sectionId, targetIndex) => {
    e.preventDefault();
    if (draggedSectionId === sectionId && draggedLessonIdx !== targetIndex) {
      const section = courseData.sections.find((s) => s.id === sectionId);
      const newLessons = [...section.lessons];
      const [draggedItem] = newLessons.splice(draggedLessonIdx, 1);
      newLessons.splice(targetIndex, 0, draggedItem);
      updateCourseData(
        "sections",
        courseData.sections.map((sec) =>
          sec.id === sectionId ? { ...sec, lessons: newLessons } : sec,
        ),
      );
    }
    setDraggedLessonIdx(null);
    setDraggedSectionId(null);
  };

  const deleteSection = (sectionId) => {
    updateCourseData(
      "sections",
      courseData.sections.filter((s) => s.id !== sectionId),
    );
  };

  const deleteLesson = (sectionId, lessonId) => {
    updateCourseData(
      "sections",
      courseData.sections.map((s) =>
        s.id === sectionId
          ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
          : s,
      ),
    );
  };

  const deleteQuiz = (sectionId) => {
    updateCourseData(
      "sections",
      courseData.sections.map((s) =>
        s.id === sectionId ? { ...s, quiz: null } : s,
      ),
    );
  };

  const canPublish =
    courseData.sections.length > 0 &&
    courseData.sections.some(
      (sec) => sec.lessons.length > 0 || sec.quiz !== null,
    );

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeaderRow}>
        <div className={styles.stepHeader}>
          <h2>{t("curriculum-builder")}</h2>
          <p>
            {t("add-sections-interactive-video-lessons-and-final-assessments")}
          </p>
        </div>
        <button className={styles.addSectionBtnPrimary} onClick={addSection}>
          <IoAddOutline /> {t("add-section")}
        </button>
      </div>

      <div className={styles.sectionsList}>
        {courseData.sections.map((section, sIndex) => (
          <div key={section.id} className={styles.sectionCard}>
            {/* رأس القسم (الأكورديون) */}
            <div className={styles.sectionHeader}>
              <div
                className={styles.sectionHeaderLeft}
                onClick={() => toggleSection(section.id)}
              >
                <IoChevronDownOutline
                  className={`${styles.chevronIcon} ${section.isExpanded ? styles.rotated : ""}`}
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
              />
              <button
                className={styles.deleteIcon}
                onClick={() => deleteSection(section.id)}
                title="Delete Section"
              >
                <IoTrashOutline />
              </button>
            </div>

            {/* محتوى القسم */}
            {section.isExpanded && (
              <div className={styles.lessonsList}>
                {/* 1. الدروس */}
                {section.lessons.map((lesson, lIndex) => (
                  <div
                    key={lesson.id}
                    className={`${styles.lessonItem} ${draggedLessonIdx === lIndex && draggedSectionId === section.id ? styles.dragging : ""}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, section.id, lIndex)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, section.id, lIndex)}
                  >
                    <div className={styles.lessonLeft}>
                      <span
                        className={styles.dragHandle}
                        title="Drag to reorder"
                      >
                        ⋮⋮
                      </span>
                      <div className={styles.typeIconWrapper}>
                        <IoVideocamOutline />
                      </div>
                      <div className={styles.itemDetails}>
                        <span className={styles.itemTitle}>{lesson.title}</span>
                        {lesson.pdfs?.length > 0 && (
                          <span className={styles.attachmentBadge}>
                            <IoDocumentAttachOutline /> {lesson.pdfs.length}{" "}
                            files
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.lessonRight}>
                      <button
                        className={styles.iconBtn}
                        onClick={() =>
                          setModalState({
                            isOpen: true,
                            type: "video",
                            sectionId: section.id,
                            editData: lesson,
                          })
                        }
                      >
                        <IoPencilOutline />
                      </button>
                      <button
                        className={styles.iconBtnDanger}
                        onClick={() => deleteLesson(section.id, lesson.id)}
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  </div>
                ))}

                {/* 2. الاختبار النهائي */}
                {section.quiz && (
                  <div className={styles.finalQuizItem}>
                    <div className={styles.lessonLeft}>
                      <div className={styles.quizIconWrapper}>
                        <IoShieldCheckmarkOutline />
                      </div>
                      <div className={styles.itemDetails}>
                        <span className={styles.itemTitle}>
                          {section.quiz.title}{" "}
                          <span className={styles.finalTag}>Section Final</span>
                        </span>
                        <span className={styles.quizMeta}>
                          {section.quiz.questionsCount} Questions • Random
                          Generation
                        </span>
                      </div>
                    </div>
                    <div className={styles.lessonRight}>
                      <button
                        className={styles.iconBtn}
                        onClick={() =>
                          setModalState({
                            isOpen: true,
                            type: "quiz",
                            sectionId: section.id,
                            editData: section.quiz,
                          })
                        }
                      >
                        <IoPencilOutline />
                      </button>
                      <button
                        className={styles.iconBtnDanger}
                        onClick={() => deleteQuiz(section.id)}
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. أزرار الإضافة */}
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
        ))}

        {courseData.sections.length === 0 && (
          <div className={styles.emptyCurriculum}>
            <IoAddOutline className={styles.emptyIcon} />
            <h4>{t("no-sections-yet")}</h4>
            <p>
              {t("start-by-adding-a-section-to-build-your-course-structure")}
            </p>
          </div>
        )}
      </div>

      <div className={styles.publishActionArea}>
        <span></span>
        <button
          className={styles.finalPublishBtn}
          onClick={onPublish}
          disabled={!canPublish || isPublishing}
        >
          {isPublishing ? (
            "Publishing..."
          ) : (
            <>
              <IoCheckmarkCircleOutline /> {t("publish-course")}
            </>
          )}
        </button>
      </div>

      {modalState.isOpen && modalState.type === "video" && (
        <LessonBuilderModal
          initialData={modalState.editData}
          onClose={() => setModalState({ isOpen: false })}
          onSave={handleSaveItem}
        />
      )}
      {modalState.isOpen && modalState.type === "quiz" && (
        <QuizBuilderModal
          initialData={modalState.editData}
          onClose={() => setModalState({ isOpen: false })}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
};

export default StepTwoCurriculum;
