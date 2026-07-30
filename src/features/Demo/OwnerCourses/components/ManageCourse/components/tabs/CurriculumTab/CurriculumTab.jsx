import { useState } from "react";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoTrashOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import styles from "./CurriculumTab.module.css";
import { useTranslation } from "react-i18next";

// استدعاء المكونات الفرعية التلاتة
import LessonList from "./LessonList";
import QuestionBankSection from "./QuestionBankSection";
import SectionQuizSection from "./SectionQuizSection";

const CurriculumTab = ({ sections, setSections }) => {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState([]);

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

  const addLesson = (secId) => {
    const title = prompt("Enter lesson title:");
    if (!title) return;
    setSections(
      sections.map((s) =>
        s.id === secId
          ? {
              ...s,
              lessons: [
                ...s.lessons,
                { id: Date.now(), title, duration: "00:00" },
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

  const addQuestion = (secId) => {
    const text = prompt("Enter question text:");
    if (!text) return;
    setSections(
      sections.map((s) =>
        s.id === secId
          ? { ...s, questions: [...s.questions, { id: Date.now(), text }] }
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

  const addQuiz = (secId) => {
    setSections(
      sections.map((s) =>
        s.id === secId
          ? {
              ...s,
              quiz: { id: Date.now(), title: "Section Quiz", duration: 15 },
            }
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
            <div key={section.id} className={styles.accordionCard}>
              <div className={styles.accordionHeader}>
                <div className={styles.accordionTitleArea}>
                  <button
                    type="button"
                    className={styles.collapseBtn}
                    onClick={() => toggleSection(section.id)}
                  >
                    {isExpanded ? (
                      <IoChevronUpOutline />
                    ) : (
                      <IoChevronDownOutline />
                    )}
                  </button>
                  <span className={styles.sectionPrefix}>
                    Section {idx + 1}:
                  </span>
                  <input
                    type="text"
                    className={styles.sectionTitleInput}
                    value={section.title}
                    onChange={(e) =>
                      updateSectionTitle(section.id, e.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  className={styles.iconBtnDanger}
                  onClick={(e) => deleteSection(e, section.id)}
                >
                  <IoTrashOutline />
                </button>
              </div>

              {isExpanded && (
                <div className={styles.accordionBody}>
                  <LessonList
                    lessons={section.lessons}
                    onAddLesson={() => addLesson(section.id)}
                    onDeleteLesson={(lessonId) =>
                      deleteLesson(section.id, lessonId)
                    }
                  />

                  <div className={styles.bottomAssessmentRow}>
                    <QuestionBankSection
                      questions={section.questions}
                      onAddQuestion={() => addQuestion(section.id)}
                      onDeleteQuestion={(qId) =>
                        deleteQuestion(section.id, qId)
                      }
                    />

                    <SectionQuizSection
                      quiz={section.quiz}
                      onAddQuiz={() => addQuiz(section.id)}
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
        <IoAddCircleOutline /> Add New Section
      </button>
    </div>
  );
};

export default CurriculumTab;
