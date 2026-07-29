import { useState } from "react";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoTrashOutline,
  IoPencilOutline,
  IoReorderTwoOutline,
  IoVideocamOutline,
  IoTimeOutline,
  IoAddCircleOutline,
  IoShieldCheckmarkOutline,
  IoLibraryOutline,
} from "react-icons/io5";
import styles from "../CourseManager.module.css";
import { useTranslation } from "react-i18next";

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
                  className={styles.iconBtnDanger}
                  onClick={(e) => deleteSection(e, section.id)}
                >
                  <IoTrashOutline />
                </button>
              </div>

              {isExpanded && (
                <div className={styles.accordionBody}>
                  {section.lessons.map((lesson, lIdx) => (
                    <div key={lesson.id} className={styles.lessonItem}>
                      <div className={styles.lessonInfo}>
                        <IoReorderTwoOutline className={styles.dragHandle} />
                        <span className={styles.lessonNumber}>
                          Lesson {lIdx + 1}:
                        </span>
                        <IoVideocamOutline className={styles.lessonTypeIcon} />
                        <span className={styles.lessonTitle}>
                          {lesson.title}
                        </span>
                      </div>
                      <div className={styles.lessonMeta}>
                        <span className={styles.lessonDuration}>
                          <IoTimeOutline /> {lesson.duration || "0:00"}
                        </span>
                        <button className={styles.iconBtn}>
                          <IoPencilOutline />
                        </button>
                        <button className={styles.iconBtnDanger}>
                          <IoTrashOutline />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className={styles.addLessonBtn}
                    onClick={() => addLesson(section.id)}
                  >
                    <IoAddCircleOutline /> Add Lesson
                  </button>

                  <hr className={styles.groupDivider} />

                  <div className={styles.groupHeader}>
                    <h5>
                      <IoLibraryOutline /> Question Bank
                    </h5>
                  </div>
                  {section.questions.map((q, qIdx) => (
                    <div key={q.id} className={styles.lessonItem}>
                      <div className={styles.lessonInfo}>
                        <IoReorderTwoOutline className={styles.dragHandle} />
                        <span className={styles.lessonNumber}>
                          Question {qIdx + 1}:
                        </span>
                        <span className={styles.lessonTitle}>{q.text}</span>
                      </div>
                      <div className={styles.lessonMeta}>
                        <button className={styles.iconBtn}>
                          <IoPencilOutline />
                        </button>
                        <button className={styles.iconBtnDanger}>
                          <IoTrashOutline />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className={styles.addLessonBtn}
                    onClick={() => addQuestion(section.id)}
                  >
                    <IoAddCircleOutline /> Add Question
                  </button>

                  <hr className={styles.groupDivider} />

                  <div className={styles.groupHeader}>
                    <h5>
                      <IoShieldCheckmarkOutline /> Section Assessment
                    </h5>
                  </div>
                  {section.quiz ? (
                    <div className={styles.lessonItem}>
                      <div className={styles.lessonInfo}>
                        <IoShieldCheckmarkOutline
                          className={styles.lessonTypeIcon}
                          style={{ color: "#1a56db" }}
                        />
                        <span className={styles.lessonNumber}>Quiz:</span>
                        <span className={styles.lessonTitle}>
                          {section.quiz.title}
                        </span>
                      </div>
                      <div className={styles.lessonMeta}>
                        <span className={styles.lessonDuration}>
                          <IoTimeOutline /> {section.quiz.duration} Mins
                        </span>
                        <button className={styles.iconBtn}>
                          <IoPencilOutline />
                        </button>
                        <button
                          className={styles.iconBtnDanger}
                          onClick={() =>
                            setSections(
                              sections.map((s) =>
                                s.id === section.id ? { ...s, quiz: null } : s,
                              ),
                            )
                          }
                        >
                          <IoTrashOutline />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className={styles.addLessonBtn}
                      onClick={() => addQuiz(section.id)}
                    >
                      <IoAddCircleOutline /> Add Section Quiz
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className={styles.addSectionBtnRoot} onClick={handleAddSection}>
        <IoAddCircleOutline /> Add New Section
      </button>
    </div>
  );
};

export default CurriculumTab;
