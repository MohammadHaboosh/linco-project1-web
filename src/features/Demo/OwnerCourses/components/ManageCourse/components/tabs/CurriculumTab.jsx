import { useState } from "react";
import {
  IoAddOutline,
  IoTrashOutline,
  IoVideocamOutline,
  IoLibraryOutline,
  IoShieldCheckmarkOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";
import styles from "../CourseManager.module.css";

const CurriculumTab = ({ sections, setSections }) => {
  const [newSectionName, setNewSectionName] = useState("");

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    setSections([
      ...sections,
      {
        id: Date.now().toString(),
        title: newSectionName,
        lessons: [],
        questions: [],
        quiz: null,
      },
    ]);
    setNewSectionName("");
  };

  const deleteSection = (id) =>
    setSections(sections.filter((s) => s.id !== id));

  const addLesson = (secId) => {
    const title = prompt("Lesson Title:");
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
                title: "Section Quiz",
                duration: 15,
                questionsCount: 10,
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
      <div className={styles.tabHeaderFlex}>
        <div>
          <h3 className={styles.tabTitle}>Curriculum & Assessments</h3>
          <p className={styles.tabSubtitle}>
            Build your sections, upload lessons, manage question banks, and
            setup quizzes.
          </p>
        </div>
      </div>

      {/* Add New Section */}
      <div className={styles.addSectionBlock}>
        <input
          type="text"
          placeholder="New section name (e.g. Chapter 1: Basics)..."
          className={styles.input}
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
        />
        <button className={styles.primaryBtn} onClick={handleAddSection}>
          <IoAddOutline /> Add Section
        </button>
      </div>

      <div className={styles.sectionsContainer}>
        {sections.map((section, idx) => (
          <div key={section.id} className={styles.sectionCard}>
            {/* Section Header */}
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleBlock}>
                <span className={styles.sectionCounter}>Section {idx + 1}</span>
                <h4>{section.title}</h4>
              </div>
              <button
                className={styles.ghostDangerBtn}
                onClick={() => deleteSection(section.id)}
              >
                <IoTrashOutline />
              </button>
            </div>

            <div className={styles.sectionBody}>
              {/* 1. Lessons Area */}
              <div className={styles.subBlock}>
                <div className={styles.subBlockHeader}>
                  <h5>
                    <IoVideocamOutline /> Lessons
                  </h5>
                  <button
                    className={styles.outlineBtnSmall}
                    onClick={() => addLesson(section.id)}
                  >
                    <IoAddOutline /> Add Lesson
                  </button>
                </div>
                {section.lessons.length === 0 ? (
                  <p className={styles.emptyText}>No lessons yet.</p>
                ) : (
                  <div className={styles.itemsList}>
                    {section.lessons.map((lesson) => (
                      <div key={lesson.id} className={styles.innerItem}>
                        <span>{lesson.title}</span>
                        <span className={styles.pillGray}>
                          {lesson.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Question Bank Area */}
              <div className={styles.subBlock}>
                <div className={styles.subBlockHeader}>
                  <h5>
                    <IoLibraryOutline /> Question Bank
                  </h5>
                  <button className={styles.outlineBtnSmall}>
                    <IoAddOutline /> Add Question
                  </button>
                </div>
                {section.questions.length === 0 ? (
                  <p className={styles.emptyText}>Bank is empty.</p>
                ) : (
                  <div className={styles.itemsList}>
                    {section.questions.map((q) => (
                      <div key={q.id} className={styles.innerItem}>
                        <span>{q.text}</span>
                        <span className={styles.pillGreen}>
                          Correct: {q.options[q.correctIndex]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Quiz Area */}
              <div className={styles.subBlock}>
                <div className={styles.subBlockHeader}>
                  <h5>
                    <IoShieldCheckmarkOutline /> Section Quiz
                  </h5>
                  {!section.quiz && (
                    <button
                      className={styles.primaryOutlineBtnSmall}
                      onClick={() => addQuiz(section.id)}
                    >
                      <IoAddOutline /> Setup Quiz
                    </button>
                  )}
                </div>
                {section.quiz ? (
                  <div className={styles.quizCard}>
                    <div>
                      <strong>{section.quiz.title}</strong>
                      <div className={styles.quizMeta}>
                        <span>{section.quiz.duration} Mins</span> •{" "}
                        <span>{section.quiz.questionsCount} Questions</span>
                      </div>
                    </div>
                    <div className={styles.quizActions}>
                      <button className={styles.outlineBtnSmall}>Edit</button>
                      <button
                        className={styles.ghostDangerBtn}
                        onClick={() => deleteQuiz(section.id)}
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyQuizBox}>
                    <IoFolderOpenOutline className={styles.emptyIcon} />
                    <p>No quiz assigned for this section.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurriculumTab;
