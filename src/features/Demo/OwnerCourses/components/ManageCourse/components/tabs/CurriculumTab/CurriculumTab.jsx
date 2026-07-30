import { useState } from "react";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoTrashOutline,
  IoAddCircleOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";
import styles from "./CurriculumTab.module.css";
import { useTranslation } from "react-i18next";

import LessonList from "./LessonList";
import QuestionBankSection from "./QuestionBankSection";
import SectionQuizSection from "./SectionQuizSection";

import AddLessonModal from "./AddLessonModal";
import AddQuizModal from "./AddQuizModal";
import AddQuestionModal from "./AddQuestionModal";

const CurriculumTab = ({ sections, setSections }) => {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState(
    sections.map((s) => s.id),
  );

  const [activeModal, setActiveModal] = useState(null); // 'lesson' | 'quiz' | 'question' | null
  const [activeSectionId, setActiveSectionId] = useState(null);

  const toggleSection = (id) => {
    if (expandedSections.includes(id)) {
      setExpandedSections(expandedSections.filter((secId) => secId !== id));
    } else {
      setExpandedSections([...expandedSections, id]);
    }
  };

  const handleAddSection = () => {
    const newId = Date.now().toString();
    setSections([
      ...sections,
      {
        id: newId,
        title: "New Section",
        lessons: [],
        questions: [],
        quiz: null,
      },
    ]);
    setExpandedSections([...expandedSections, newId]);
  };

  const deleteSection = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this section?")) {
      setSections(sections.filter((s) => s.id !== id));
    }
  };

  const updateSectionTitle = (id, title) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, title } : s)));
  };

  const openLessonModal = (secId) => {
    setActiveSectionId(secId);
    setActiveModal("lesson");
  };

  const openQuizModal = (secId) => {
    setActiveSectionId(secId);
    setActiveModal("quiz");
  };

  const openQuestionModal = (secId) => {
    setActiveSectionId(secId);
    setActiveModal("question");
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setActiveSectionId(null);
  };

  const handleSaveLesson = (lessonData) => {
    if (!activeSectionId) return;
    setSections(
      sections.map((s) =>
        s.id === activeSectionId
          ? {
              ...s,
              lessons: [
                ...s.lessons,
                {
                  id: Date.now().toString(),
                  ...lessonData,
                },
              ],
            }
          : s,
      ),
    );
  };

  const handleSaveQuiz = (quizData) => {
    if (!activeSectionId) return;
    setSections(
      sections.map((s) =>
        s.id === activeSectionId
          ? {
              ...s,
              quiz: {
                id: Date.now().toString(),
                ...quizData,
              },
            }
          : s,
      ),
    );
  };

  const handleSaveQuestion = (questionData) => {
    if (!activeSectionId) return;
    setSections(
      sections.map((s) =>
        s.id === activeSectionId
          ? {
              ...s,
              questions: [
                ...s.questions,
                {
                  id: Date.now().toString(),
                  ...questionData,
                },
              ],
            }
          : s,
      ),
    );
  };

  const deleteLesson = (secId, lessonId) => {
    setSections(
      sections.map((s) =>
        s.id === secId
          ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
          : s,
      ),
    );
  };

  const deleteQuestion = (secId, qId) => {
    setSections(
      sections.map((s) =>
        s.id === secId
          ? { ...s, questions: s.questions.filter((q) => q.id !== qId) }
          : s,
      ),
    );
  };

  const deleteQuiz = (secId) => {
    setSections(
      sections.map((s) => (s.id === secId ? { ...s, quiz: null } : s)),
    );
  };

  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeader}>
        <div>
          <h3 className={styles.tabTitle}>
            {t("curriculum-builder", "Curriculum Builder")}
          </h3>
          <p className={styles.tabSubtitle}>
            Organize your course into structured sections, lessons, and
            assessments.
          </p>
        </div>
      </div>

      <div className={styles.curriculumList}>
        {sections.map((section, idx) => {
          const isExpanded = expandedSections.includes(section.id);

          return (
            <div key={section.id} className={styles.sectionCard}>
              <div
                className={styles.sectionHeader}
                onClick={() => toggleSection(section.id)}
              >
                <div className={styles.sectionHeaderLeft}>
                  <button
                    type="button"
                    className={styles.collapseBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(section.id);
                    }}
                  >
                    {isExpanded ? (
                      <IoChevronUpOutline />
                    ) : (
                      <IoChevronDownOutline />
                    )}
                  </button>
                  <div className={styles.sectionBadge}>
                    <IoFolderOpenOutline />
                    <span>Section {idx + 1}</span>
                  </div>
                  <input
                    type="text"
                    className={styles.sectionTitleInput}
                    value={section.title}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      updateSectionTitle(section.id, e.target.value)
                    }
                  />
                </div>
                <div className={styles.sectionHeaderRight}>
                  <button
                    type="button"
                    className={styles.deleteSectionBtn}
                    onClick={(e) => deleteSection(e, section.id)}
                    title="Delete Section"
                  >
                    <IoTrashOutline />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className={styles.sectionBody}>
                  <LessonList
                    lessons={section.lessons}
                    onAddLesson={() => openLessonModal(section.id)}
                    onDeleteLesson={(lessonId) =>
                      deleteLesson(section.id, lessonId)
                    }
                  />

                  <div className={styles.bottomAssessmentRow}>
                    <QuestionBankSection
                      questions={section.questions}
                      onAddQuestion={() => openQuestionModal(section.id)}
                      onDeleteQuestion={(qId) =>
                        deleteQuestion(section.id, qId)
                      }
                    />

                    <SectionQuizSection
                      quiz={section.quiz}
                      onAddQuiz={() => openQuizModal(section.id)}
                      onDeleteQuiz={() => deleteQuiz(section.id)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.addSectionBtnRoot}
        onClick={handleAddSection}
      >
        <IoAddCircleOutline className={styles.rootAddIcon} />
        <span>Add New Section</span>
      </button>

      <AddLessonModal
        isOpen={activeModal === "lesson"}
        onClose={handleCloseModal}
        onSubmit={handleSaveLesson}
      />

      <AddQuizModal
        isOpen={activeModal === "quiz"}
        onClose={handleCloseModal}
        onSubmit={handleSaveQuiz}
      />

      <AddQuestionModal
        isOpen={activeModal === "question"}
        onClose={handleCloseModal}
        onSubmit={handleSaveQuestion}
      />
    </div>
  );
};

export default CurriculumTab;
