import { useEffect, useState } from "react";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoTrashOutline,
  IoAddCircleOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";
import styles from "./CurriculumTab.module.css";
import { useTranslation } from "react-i18next";

import LessonList from "./LessonList/LessonList";
import QuestionBankSection from "./QuestionBankSection/QuestionBankSection";
import SectionQuizSection from "./SectionQuizSection/SectionQuizSection";

import AddLessonModal from "./AddModals/AddLessonModal";
import AddQuizModal from "./AddModals/AddQuizModal";
import AddQuestionModal from "./AddModals/AddQuestionModal";
import { attachmentApi } from "../../../../../api/attachmentApi";
import { quizApi } from "../../../../../api/quizApi";

const CurriculumTab = ({
  courseId,
  sections,
  setSections,
  onDeleteSection,
}) => {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState(
    sections.length > 0 ? [sections[0].id] : [],
  );

  const [activeModal, setActiveModal] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [isCreatingSection, setIsCreatingSection] = useState(false);

  const isTempId = (id) => {
    if (!id) return true;
    const strId = String(id);
    return strId.startsWith("temp-") || strId.startsWith("temp_");
  };

  const toggleSection = (id) => {
    const isExpanding = !expandedSections.includes(id);

    if (isExpanding) {
      setExpandedSections([...expandedSections, id]);

      const targetSec = sections.find((s) => s.id === id);
      if (targetSec && !isTempId(id) && targetSec.quiz === undefined) {
        handleFetchQuizForSection(id);
      }
    } else {
      setExpandedSections(expandedSections.filter((secId) => secId !== id));
    }
  };

  const handleAddSection = (titleInput) => {
    const sectionTitle =
      typeof titleInput === "string" && titleInput.trim()
        ? titleInput
        : `Section ${sections.length + 1}`;

    const nextOrder = sections.length + 1;

    const newSection = {
      id: `temp_section_${Date.now()}`,
      title: sectionTitle,
      order: nextOrder,
      lessons: [],
      questions: [],
      quiz: null,
      isNew: true,
    };

    setSections((prev) => [...prev, newSection]);
    setExpandedSections((prev) => [...prev, newSection.id]);
  };

  const deleteSection = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this section?")) {
      if (onDeleteSection) {
        onDeleteSection(id);
      } else {
        setSections(sections.filter((s) => s.id !== id));
      }
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

    setSections((prevSections) =>
      prevSections.map((s) => {
        if (s.id === activeSectionId) {
          const currentLessons = s.lessons || [];
          const newLesson = {
            ...lessonData,
            id: `temp_lesson_${Date.now()}`,
            order: currentLessons.length + 1,
            isNew: true,
          };
          return {
            ...s,
            lessons: [...currentLessons, newLesson],
          };
        }
        return s;
      }),
    );
  };

  const handleReorderLessons = (secId, reorderedLessons) => {
    const updatedLessonsWithOrder = reorderedLessons.map((lesson, index) => ({
      ...lesson,
      order: index + 1,
    }));

    setSections((prev) =>
      prev.map((s) =>
        s.id === secId ? { ...s, lessons: updatedLessonsWithOrder } : s,
      ),
    );
  };

  const handleSaveQuiz = (quizData) => {
    if (!activeSectionId) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === activeSectionId
          ? {
              ...s,
              quiz: quizData,
            }
          : s,
      ),
    );
  };

  const handleSaveQuestion = (questionData) => {
    if (!activeSectionId) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === activeSectionId
          ? {
              ...s,
              questions: [
                ...(s.questions || []),
                {
                  id: `temp_q_${Date.now()}`,
                  ...questionData,
                  isNew: true,
                },
              ],
            }
          : s,
      ),
    );
  };

  const deleteLesson = (secId, lessonId) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === secId) {
          const filtered = (s.lessons || []).filter((l) => l.id !== lessonId);
          const reordered = filtered.map((item, idx) => ({
            ...item,
            order: idx + 1,
          }));
          return { ...s, lessons: reordered };
        }
        return s;
      }),
    );
  };

  const deleteQuestion = (secId, qId) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === secId
          ? { ...s, questions: (s.questions || []).filter((q) => q.id !== qId) }
          : s,
      ),
    );
  };

  const handleFetchQuizForSection = async (sectionId) => {
    if (isTempId(sectionId)) return;

    try {
      const fetchedQuiz = await quizApi.getQuizBySectionId(sectionId);
      if (fetchedQuiz) {
        setSections((prev) =>
          prev.map((sec) =>
            sec.id === sectionId ? { ...sec, quiz: fetchedQuiz } : sec,
          ),
        );
      }
    } catch (error) {
      console.error(`Failed to fetch quiz for section ${sectionId}:`, error);
    }
  };
  useEffect(() => {
    if (sections.length > 0) {
      const firstSection = sections[0];
      if (!isTempId(firstSection.id) && firstSection.quiz === null) {
        handleFetchQuizForSection(firstSection.id);
      }
    }
  }, [sections.length]);

  const deleteQuiz = (secId) => {
    setSections((prev) =>
      prev.map((s) => (s.id === secId ? { ...s, quiz: null } : s)),
    );
  };

  const handleFetchAttachments = async (lessonId) => {
    if (!lessonId || String(lessonId).startsWith("temp_")) return;

    try {
      const fetchedAtts = await attachmentApi.getAttachments(lessonId);

      const formatted = (fetchedAtts || []).map((att) => ({
        id: att.id,
        title: att.name || "Resource",
        fileName: att.name || "",
        path: att.path,
        isExisting: true,
        isNew: false,
      }));

      setSections((prevSections) =>
        prevSections.map((sec) => ({
          ...sec,
          lessons: (sec.lessons || []).map((l) => {
            if (l.id === lessonId) {
              const localNewAttachments = (l.attachments || []).filter(
                (att) => att.isNew,
              );
              return {
                ...l,
                attachments: [...formatted, ...localNewAttachments],
              };
            }
            return l;
          }),
        })),
      );
    } catch (error) {
      console.error("Error fetching attachments for lesson:", lessonId, error);
    }
  };

  const handleAddAttachment = (arg1, arg2, arg3) => {
    let targetSecId = null;
    let targetLessonId = arg1;
    let attachmentData = arg2;

    if (typeof arg2 === "string" || typeof arg3 === "object") {
      targetSecId = arg1;
      targetLessonId = arg2;
      attachmentData = arg3;
    }

    console.log("Adding attachment to lesson:", targetLessonId, attachmentData);

    if (!targetLessonId || !attachmentData) return;

    setSections((prev) =>
      prev.map((s) => {
        if (targetSecId && String(s.id) !== String(targetSecId)) {
          return s;
        }

        return {
          ...s,
          lessons: (s.lessons || []).map((l) => {
            if (String(l.id) === String(targetLessonId)) {
              const rawFile =
                attachmentData.file ||
                attachmentData.selectedFile ||
                (attachmentData instanceof File ? attachmentData : null);

              const newAttachment = {
                id: attachmentData.id || `temp_att_${Date.now()}`,
                title:
                  attachmentData.title ||
                  attachmentData.name ||
                  rawFile?.name ||
                  "New Attachment",
                fileName:
                  attachmentData.fileName ||
                  rawFile?.name ||
                  attachmentData.name ||
                  "",
                file: rawFile,
                isNew: true,
                isExisting: false,
              };

              return {
                ...l,
                attachments: [...(l.attachments || []), newAttachment],
              };
            }
            return l;
          }),
        };
      }),
    );
  };

  const handleDeleteAttachment = (arg1, arg2, arg3) => {
    let targetLessonId = arg1;
    let targetAttId = arg2;

    if (arg3 !== undefined) {
      targetLessonId = arg2;
      targetAttId = arg3;
    }

    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        lessons: (s.lessons || []).map((l) => {
          if (String(l.id) === String(targetLessonId)) {
            return {
              ...l,
              attachments: (l.attachments || []).filter(
                (att) => String(att.id) !== String(targetAttId),
              ),
            };
          }
          return l;
        }),
      })),
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
                    value={section.title || ""}
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
                    lessons={section.lessons || []}
                    onAddLesson={() => openLessonModal(section.id)}
                    onDeleteLesson={(lessonId) =>
                      deleteLesson(section.id, lessonId)
                    }
                    onReorderLessons={(reordered) =>
                      handleReorderLessons(section.id, reordered)
                    }
                    onAddAttachment={(lessonId, attData) =>
                      handleAddAttachment(section.id, lessonId, attData)
                    }
                    onDeleteAttachment={(lessonId, attId) =>
                      handleDeleteAttachment(section.id, lessonId, attId)
                    }
                    onFetchAttachments={(lessonId) =>
                      handleFetchAttachments(lessonId)
                    }
                  />

                  <div className={styles.bottomAssessmentRow}>
                    <QuestionBankSection
                      questions={section.questions || []}
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
        onClick={() => handleAddSection()}
        disabled={isCreatingSection}
      >
        <IoAddCircleOutline className={styles.rootAddIcon} />
        <span>
          {isCreatingSection ? "Creating Section..." : "Add New Section"}
        </span>
      </button>

      <AddLessonModal
        isOpen={activeModal === "lesson"}
        onClose={handleCloseModal}
        onSubmit={handleSaveLesson}
      />

      <AddQuizModal
        isOpen={activeModal === "quiz"}
        sectionId={activeSectionId}
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
