import { useState } from "react";
import {
  IoAddOutline,
  IoTrashOutline,
  IoVideocamOutline,
  IoShieldCheckmarkOutline,
  IoChevronDown,
  IoLibraryOutline,
} from "react-icons/io5";
import styles from "../CourseManager.module.css";

const CurriculumTab = ({ sections, setSections }) => {
  const [newSectionName, setNewSectionName] = useState("");
  const [openSectionId, setOpenSectionId] = useState(null);

  const toggleSection = (id) => {
    setOpenSectionId(openSectionId === id ? null : id);
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
    setOpenSectionId(newId);
    setNewSectionName("");
  };

  const deleteSection = (e, id) => {
    e.stopPropagation();
    setSections(sections.filter((s) => s.id !== id));
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

  const addQuestion = (secId) => {
    const text = prompt("Enter question text:");
    if (!text) return;
    setSections(
      sections.map((s) =>
        s.id === secId
          ? {
              ...s,
              questions: [
                ...s.questions,
                {
                  id: Date.now(),
                  text,
                  options: ["A", "B", "C"],
                  correctIndex: 0,
                },
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
                title: "Section Quiz",
                duration: 15,
                questionsCount: 5,
              },
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
          <h3 className={styles.tabTitle}>Curriculum & Assessments</h3>
          <p className={styles.tabSubtitle}>
            Organize sections, add lessons, and manage quizzes.
          </p>
        </div>
      </div>

      <div className={styles.addSectionBlock}>
        <input
          type="text"
          placeholder="Enter new section title (e.g. Chapter 1: Basics)..."
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
          const isOpen = openSectionId === section.id;

          return (
            <div key={section.id} className={styles.sectionCard}>
              <div
                className={`${styles.sectionHeader} ${isOpen ? styles.sectionHeaderActive : ""}`}
                onClick={() => toggleSection(section.id)}
              >
                <div className={styles.sectionTitleArea}>
                  <IoChevronDown
                    className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ""}`}
                  />
                  <span className={styles.sectionIndex}>
                    Section {idx + 1}:
                  </span>
                  <h4>{section.title}</h4>
                </div>
                <button
                  className={styles.ghostDangerBtn}
                  onClick={(e) => deleteSection(e, section.id)}
                >
                  <IoTrashOutline />
                </button>
              </div>

              {isOpen && (
                <div className={styles.sectionBody}>
                  {/* Lessons */}
                  <div className={styles.contentGroup}>
                    <div className={styles.groupHeader}>
                      <h5>
                        <IoVideocamOutline /> Lessons
                      </h5>
                      <button
                        className={styles.outlineBtnSmall}
                        onClick={() => addLesson(section.id)}
                      >
                        + Add Lesson
                      </button>
                    </div>
                    {section.lessons.length === 0 ? (
                      <p className={styles.emptyHint}>No lessons added.</p>
                    ) : (
                      <div className={styles.itemsList}>
                        {section.lessons.map((lesson) => (
                          <div key={lesson.id} className={styles.innerItem}>
                            <span>{lesson.title}</span>
                            <span className={styles.badgeGray}>
                              {lesson.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <hr className={styles.groupDivider} />

                  {/* Question Bank */}
                  <div className={styles.contentGroup}>
                    <div className={styles.groupHeader}>
                      <h5>
                        <IoLibraryOutline /> Question Bank
                      </h5>
                      <button
                        className={styles.outlineBtnSmall}
                        onClick={() => addQuestion(section.id)}
                      >
                        + Add Question
                      </button>
                    </div>
                    {section.questions.length === 0 ? (
                      <p className={styles.emptyHint}>Bank is empty.</p>
                    ) : (
                      <div className={styles.itemsList}>
                        {section.questions.map((q) => (
                          <div key={q.id} className={styles.innerItem}>
                            <span>{q.text}</span>
                            <span className={styles.badgeGreen}>
                              Correct: {q.options[q.correctIndex]}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <hr className={styles.groupDivider} />

                  {/* Section Quiz */}
                  <div className={styles.contentGroup}>
                    <div className={styles.groupHeader}>
                      <h5>
                        <IoShieldCheckmarkOutline /> Section Quiz
                      </h5>
                      {!section.quiz && (
                        <button
                          className={styles.outlineBtnSmall}
                          onClick={() => addQuiz(section.id)}
                        >
                          + Setup Quiz
                        </button>
                      )}
                    </div>
                    {section.quiz ? (
                      <div className={styles.quizBox}>
                        <div>
                          <strong>{section.quiz.title}</strong>
                          <div className={styles.quizMeta}>
                            <span>{section.quiz.duration} Mins</span> •{" "}
                            <span>{section.quiz.questionsCount} Questions</span>
                          </div>
                        </div>
                        <button
                          className={styles.ghostDangerBtn}
                          onClick={() => deleteQuiz(section.id)}
                        >
                          <IoTrashOutline />
                        </button>
                      </div>
                    ) : (
                      <p className={styles.emptyHint}>
                        No quiz assigned to this section.
                      </p>
                    )}
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
