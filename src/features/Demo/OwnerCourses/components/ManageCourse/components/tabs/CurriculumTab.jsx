import { useState } from "react";
import {
  IoAddOutline,
  IoTrashOutline,
  IoVideocamOutline,
  IoShieldCheckmarkOutline,
  IoChevronDown,
  IoChevronUp,
  IoLibraryOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";
import styles from "../CourseManager.module.css";

const CurriculumTab = ({ sections, setSections }) => {
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
    // هنا تم تصحيح الكلاس ليصبح tabCard بدلاً من tabContainer
    <div className={styles.tabCard}>
      <div className={styles.tabHeaderFlex}>
        <div>
          <h3 className={styles.tabTitle}>Curriculum & Assessments</h3>
          <p className={styles.tabSubtitle}>
            Organize your course into sections, add lessons, and create quizzes.
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
          const isExpanded = expandedSections.includes(section.id);

          return (
            <div key={section.id} className={styles.accordionCard}>
              <div
                className={`${styles.accordionHeader} ${isExpanded ? styles.accordionHeaderActive : ""}`}
                onClick={() => toggleSection(section.id)}
              >
                <div className={styles.sectionTitleBlock}>
                  <div className={styles.dragHandle}>
                    {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
                  </div>
                  <span className={styles.sectionCounter}>
                    Section {idx + 1}:
                  </span>
                  <h4 className={styles.sectionTitle}>{section.title}</h4>
                </div>
                <button
                  className={styles.ghostDangerBtn}
                  onClick={(e) => deleteSection(e, section.id)}
                  title="Delete Section"
                >
                  <IoTrashOutline />
                </button>
              </div>

              {isExpanded && (
                <div className={styles.accordionBody}>
                  {/* Lessons */}
                  <div className={styles.contentGroup}>
                    <h5 className={styles.groupTitle}>Lessons</h5>
                    {section.lessons.length === 0 ? (
                      <p className={styles.emptyHint}>
                        No lessons added to this section yet.
                      </p>
                    ) : (
                      <div className={styles.itemsList}>
                        {section.lessons.map((lesson, lIdx) => (
                          <div key={lesson.id} className={styles.lessonItemRow}>
                            <div className={styles.lessonInfoLeft}>
                              <span className={styles.itemIndex}>
                                {lIdx + 1}.
                              </span>
                              <IoVideocamOutline
                                className={styles.lessonIconColor}
                              />
                              <span className={styles.itemName}>
                                {lesson.title}
                              </span>
                            </div>
                            <span className={styles.pillGray}>
                              {lesson.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      className={styles.dashedAddBtn}
                      onClick={() => addLesson(section.id)}
                    >
                      <IoAddOutline /> Add Lesson
                    </button>
                  </div>

                  <hr className={styles.groupDivider} />

                  {/* Quiz */}
                  <div className={styles.contentGroup}>
                    <h5 className={styles.groupTitle}>Assessment</h5>
                    {!section.quiz ? (
                      <button
                        className={styles.dashedAddBtn}
                        onClick={() => addQuiz(section.id)}
                      >
                        <IoAddOutline /> Setup Section Quiz
                      </button>
                    ) : (
                      <div className={styles.quizCard}>
                        <div className={styles.quizInfoBlock}>
                          <div className={styles.quizIconWrapper}>
                            <IoShieldCheckmarkOutline />
                          </div>
                          <div>
                            <strong>{section.quiz.title}</strong>
                            <div className={styles.quizMeta}>
                              <span>{section.quiz.duration} Mins</span>
                              <span className={styles.bullet}>•</span>
                              <span>
                                {section.quiz.questionsCount} Questions
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.quizActions}>
                          <button className={styles.outlineBtnSmall}>
                            <IoLibraryOutline /> Question Bank
                          </button>
                          <button className={styles.outlineBtnSmall}>
                            Settings
                          </button>
                          <button
                            className={styles.ghostDangerBtn}
                            onClick={() => deleteQuiz(section.id)}
                          >
                            <IoTrashOutline />
                          </button>
                        </div>
                      </div>
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
