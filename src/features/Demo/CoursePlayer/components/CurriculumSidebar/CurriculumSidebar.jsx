import React, { useState } from "react";
import styles from "./CurriculumSidebar.module.css";
import {
  IoChevronUpOutline,
  IoChevronDownOutline,
  IoPlayCircle,
  IoTrashOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import { BsGripVertical } from "react-icons/bs";

const sections = [
  {
    id: 1,
    title: "Section 1",
    lessons: [
      { id: 101, title: "1. fewq fe", duration: "4 mins", attachments: 0 },
      { id: 102, title: "2. efwqf", duration: "4 mins", attachments: 0 },
      {
        id: 103,
        title: "3. dsqgfewqg eqgg",
        duration: "4 mins",
        attachments: 0,
      },
    ],
  },
  { id: 2, title: "Section 2", lessons: [] },
];

const CurriculumSidebar = () => {
  const [expanded, setExpanded] = useState([1]);

  const toggleSection = (id) => {
    setExpanded((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
    );
  };

  return (
    <div className={styles.curriculumBuilder}>
      <div className={styles.headerInfo}>
        <h2>Curriculum Builder</h2>
        <p>
          Organize your course into structured sections, lessons, and
          assessments.
        </p>
      </div>

      <div className={styles.sectionsList}>
        {sections.map((section, index) => {
          const isExpanded = expanded.includes(section.id);
          return (
            <div className={styles.sectionCard} key={section.id}>
              <div
                className={styles.sectionHeader}
                onClick={() => toggleSection(section.id)}
              >
                <div className={styles.headerLeft}>
                  <span className={styles.toggleIcon}>
                    {isExpanded ? (
                      <IoChevronUpOutline />
                    ) : (
                      <IoChevronDownOutline />
                    )}
                  </span>
                  <span className={styles.sectionPill}>
                    Section {index + 1}
                  </span>
                  <span className={styles.sectionTitle}>{section.title}</span>
                </div>
                <button className={styles.deleteBtn}>
                  <IoTrashOutline />
                </button>
              </div>

              {isExpanded && (
                <div className={styles.sectionBody}>
                  <div className={styles.lessonsListHeader}>
                    <strong>Lessons List</strong>
                    <button className={styles.addLessonBtn}>
                      + Add Lesson
                    </button>
                  </div>

                  <div className={styles.lessonsList}>
                    {section.lessons.map((lesson) => (
                      <div className={styles.lessonRow} key={lesson.id}>
                        <div className={styles.lessonLeft}>
                          <BsGripVertical className={styles.dragIcon} />
                          <IoChevronDownOutline
                            className={styles.collapseIcon}
                          />
                          <IoPlayCircle className={styles.playIcon} />
                          <div className={styles.lessonInfo}>
                            <span className={styles.lessonName}>
                              {lesson.title}
                            </span>
                            <span className={styles.lessonTime}>
                              🕐 {lesson.duration}
                            </span>
                          </div>
                        </div>
                        <div className={styles.lessonRight}>
                          <span className={styles.attachmentPill}>
                            📎 {lesson.attachments} Attachments
                          </span>
                          <button className={styles.deleteBtn}>
                            <IoTrashOutline />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.assessmentTools}>
                    <button className={styles.btnQuestionBank}>
                      <IoAddCircleOutline /> Add Question
                    </button>
                    <button className={styles.btnSectionQuiz}>
                      <IoAddCircleOutline /> Add Section Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <button className={styles.addNewSectionBtn}>
          <IoAddCircleOutline /> Add New Section
        </button>
      </div>
    </div>
  );
};

export default CurriculumSidebar;
