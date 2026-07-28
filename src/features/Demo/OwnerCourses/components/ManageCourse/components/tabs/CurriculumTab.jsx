import { useState } from "react";
import {
  IoAddOutline,
  IoTrashOutline,
  IoVideocamOutline,
  IoChevronDown,
  IoShieldCheckmarkOutline,
  IoLibraryOutline,
  IoReorderTwoOutline,
  IoTimeOutline,
  IoPencilOutline,
} from "react-icons/io5";
import styles from "../CourseManager.module.css";
import { useTranslation } from "react-i18next";

const CurriculumTab = ({ sections, setSections }) => {
  const { t } = useTranslation();
  const [newSectionName, setNewSectionName] = useState("");
  const [expandedSections, setExpandedSections] = useState([]);

  const toggleSection = (id) => {
    if (expandedSections.includes(id)) {
      setExpandedSections(expandedSections.filter((secId) => secId !== id));
    } else {
      setExpandedSections([...expandedSections, id]);
    }
  };

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    const newId = Date.now().toString();
    setSections([
      ...sections,
      {
        id: newId,
        title: newSectionName,
        lessons: [],
        questions: [],
        quiz: null,
      },
    ]);
    setExpandedSections([...expandedSections, newId]);
    setNewSectionName("");
  };

  const deleteSection = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this section?")) {
      setSections(sections.filter((s) => s.id !== id));
    }
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
              quiz: {
                id: Date.now(),
                title: "Section Assessment",
                duration: 15,
                questionsCount: 10,
              },
            }
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

      <div className={styles.addSectionBlock}>
        <input
          type="text"
          placeholder="Enter new section title (e.g. Chapter 1: Fundamentals)..."
          className={styles.input}
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
        />
        <button className={styles.primaryBtn} onClick={handleAddSection}>
          <IoAddOutline /> Add Section
        </button>
      </div>

      <div className={styles.curriculumList}>
        {sections.map((section, idx) => {
          const isExpanded = expandedSections.includes(section.id);

          return (
            <div key={section.id} className={styles.accordionCard}>
              {/* ترويسة القسم */}
              <div
                className={`${styles.accordionHeader} ${isExpanded ? styles.accordionHeaderActive : ""}`}
                onClick={() => toggleSection(section.id)}
              >
                <div className={styles.sectionTitleArea}>
                  <IoChevronDown
                    className={`${styles.chevronIcon} ${isExpanded ? styles.chevronOpen : ""}`}
                  />
                  <span className={styles.sectionIndex}>
                    Section {idx + 1}:
                  </span>
                  <h4 className={styles.sectionTitleText}>{section.title}</h4>
                </div>
                <div className={styles.sectionActions}>
                  <button className={styles.iconBtn} title="Edit Section">
                    <IoPencilOutline />
                  </button>
                  <button
                    className={styles.iconBtnDanger}
                    onClick={(e) => deleteSection(e, section.id)}
                    title="Delete Section"
                  >
                    <IoTrashOutline />
                  </button>
                </div>
              </div>

              {/* محتوى القسم */}
              {isExpanded && (
                <div className={styles.accordionBody}>
                  {/* قائمة الدروس */}
                  <div className={styles.subGroup}>
                    <div className={styles.subGroupHeader}>
                      <h5>
                        <IoVideocamOutline /> Lessons
                      </h5>
                    </div>

                    <div className={styles.itemsWrapper}>
                      {section.lessons.length === 0 ? (
                        <p className={styles.emptyText}>
                          No lessons added yet.
                        </p>
                      ) : (
                        section.lessons.map((lesson, lIdx) => (
                          <div key={lesson.id} className={styles.lessonItemRow}>
                            <div className={styles.lessonItemLeft}>
                              <IoReorderTwoOutline
                                className={styles.dragIcon}
                              />
                              <span className={styles.lessonIndex}>
                                {lIdx + 1}.
                              </span>
                              <span className={styles.lessonName}>
                                {lesson.title}
                              </span>
                            </div>
                            <div className={styles.lessonItemRight}>
                              <span className={styles.lessonDuration}>
                                <IoTimeOutline /> {lesson.duration}
                              </span>
                              <button className={styles.iconBtn}>
                                <IoPencilOutline />
                              </button>
                              <button className={styles.iconBtnDanger}>
                                <IoTrashOutline />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                      <button
                        className={styles.dashedAddBtn}
                        onClick={() => addLesson(section.id)}
                      >
                        <IoAddOutline /> Add Lesson
                      </button>
                    </div>
                  </div>

                  {/* الكويز */}
                  <div className={styles.subGroup}>
                    <div className={styles.subGroupHeader}>
                      <h5>
                        <IoShieldCheckmarkOutline /> Section Assessment
                      </h5>
                    </div>

                    <div className={styles.itemsWrapper}>
                      {!section.quiz ? (
                        <button
                          className={styles.dashedAddBtn}
                          onClick={() => addQuiz(section.id)}
                        >
                          <IoAddOutline /> Add Section Quiz
                        </button>
                      ) : (
                        <div className={styles.quizCard}>
                          <div className={styles.quizInfo}>
                            <div className={styles.quizIconBox}>
                              <IoShieldCheckmarkOutline />
                            </div>
                            <div>
                              <strong>{section.quiz.title}</strong>
                              <div className={styles.quizMeta}>
                                <span>{section.quiz.duration} Mins</span> •{" "}
                                <span>
                                  {section.quiz.questionsCount} Questions
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={styles.quizActions}>
                            <button className={styles.outlineBtn}>
                              <IoLibraryOutline /> Question Bank
                            </button>
                            <button className={styles.iconBtn}>
                              <IoPencilOutline />
                            </button>
                            <button
                              className={styles.iconBtnDanger}
                              onClick={() =>
                                setSections(
                                  sections.map((s) =>
                                    s.id === section.id
                                      ? { ...s, quiz: null }
                                      : s,
                                  ),
                                )
                              }
                            >
                              <IoTrashOutline />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurriculumTab;
