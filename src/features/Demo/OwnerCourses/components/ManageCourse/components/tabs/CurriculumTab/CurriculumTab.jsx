import { IoAddCircleOutline } from "react-icons/io5";
import styles from "./CurriculumTab.module.css";
import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard/SectionCard";
import { useCurriculumLogic } from "../../../../../hooks/useCurriculumLogic";
import AddLessonModal from "./AddModals/AddLessonModal";
import AddQuizModal from "./AddModals/AddQuizModal";
import AddQuestionModal from "./AddModals/AddQuestionModal";

const CurriculumTab = ({
  sections,
  setSections,
  onDeleteSection,
  onDeleteQuiz,
  onDeleteQuestion,
}) => {
  const { t } = useTranslation();
  const logic = useCurriculumLogic(
    sections,
    setSections,
    onDeleteSection,
    onDeleteQuiz,
    onDeleteQuestion,
  );

  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeader}>
        <div>
          <h3 className={styles.tabTitle}>{t("curriculum-builder")}</h3>
          <p className={styles.tabSubtitle}>
            {t(
              "organize-your-course-into-structured-sections-lessons-and-assessments",
            )}
          </p>
        </div>
      </div>

      <div className={styles.curriculumList}>
        {sections.map((section, idx) => (
          <SectionCard
            key={section.id}
            section={section}
            index={idx}
            isExpanded={logic.expandedSections.includes(section.id)}
            logic={logic}
          />
        ))}
      </div>

      <button
        type="button"
        className={styles.addSectionBtnRoot}
        onClick={logic.handleAddSection}
      >
        <IoAddCircleOutline className={styles.rootAddIcon} />
        <span>{t("add-new-section")}</span>
      </button>

      <AddLessonModal
        isOpen={logic.activeModal === "lesson"}
        onClose={logic.closeModal}
        onSubmit={logic.handleSaveLesson}
      />
      <AddQuizModal
        isOpen={logic.activeModal === "quiz"}
        onClose={logic.closeModal}
        onSubmit={logic.handleSaveQuiz}
        initialData={
          logic.activeModal === "quiz" && logic.activeSectionId
            ? sections.find((s) => s.id === logic.activeSectionId)?.quiz
            : null
        }
      />
      <AddQuestionModal
        isOpen={logic.activeModal === "question"}
        onClose={logic.closeModal}
        onSubmit={logic.handleSaveQuestion}
      />
    </div>
  );
};
export default CurriculumTab;
