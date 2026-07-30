import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import LessonBuilderModal from "./LessonBuilderModal";
import QuizBuilderModal from "./QuizBuilderModal";
import SectionCard from "./SectionCard";
import CurriculumFooter from "./CurriculumFooter";
import styles from "./StepTwoCurriculum.module.css";
import { useTranslation } from "react-i18next";

const StepTwoCurriculum = ({
  courseData,
  updateCourseData,
  onPublish,
  isPublishing,
  onBack,
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
        title: `New Section ${courseData.sections.length + 1}`,
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
      if (!section) return;

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
          <SectionCard
            key={section.id}
            section={section}
            sIndex={sIndex}
            courseData={courseData}
            updateCourseData={updateCourseData}
            toggleSection={toggleSection}
            deleteSection={deleteSection}
            deleteLesson={deleteLesson}
            deleteQuiz={deleteQuiz}
            setModalState={setModalState}
            draggedLessonIdx={draggedLessonIdx}
            draggedSectionId={draggedSectionId}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            styles={styles}
          />
        ))}

        {courseData.sections.length === 0 && (
          <div className={styles.emptyCurriculum}>
            <IoAddOutline style={{ fontSize: "3rem", color: "#94a3b8" }} />
            <h4>{t("no-sections-yet")}</h4>
            <p>
              {t("start-by-adding-a-section-to-build-your-course-structure")}
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <CurriculumFooter
        onBack={onBack}
        onPublish={onPublish}
        canPublish={canPublish}
        isPublishing={isPublishing}
        styles={styles}
        t={t}
      />

      {/* Modals */}
      {modalState.isOpen && modalState.type === "video" && (
        <LessonBuilderModal
          initialData={modalState.editData}
          onClose={() =>
            setModalState({
              isOpen: false,
              type: null,
              sectionId: null,
              editData: null,
            })
          }
          onSave={handleSaveItem}
        />
      )}
      {modalState.isOpen && modalState.type === "quiz" && (
        <QuizBuilderModal
          initialData={modalState.editData}
          onClose={() =>
            setModalState({
              isOpen: false,
              type: null,
              sectionId: null,
              editData: null,
            })
          }
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
};

export default StepTwoCurriculum;
