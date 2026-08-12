import { useState, useEffect, useCallback } from "react";
import { quizApi } from "../api/quizApi";
import { questionBankApi } from "../api/questionBankApi";
import { attachmentApi } from "../api/attachmentApi";

export const useCurriculumLogic = (
  sections,
  setSections,
  onDeleteSection,
  onDeleteQuiz,
  onDeleteQuestion,
) => {
  const [expandedSections, setExpandedSections] = useState(
    sections.length > 0 ? [sections[0].id] : [],
  );
  const [activeModal, setActiveModal] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);

  const isTempId = useCallback(
    (id) =>
      !id || String(id).startsWith("temp-") || String(id).startsWith("temp_"),
    [],
  );

  const handleFetchQuestionsForSection = useCallback(
    async (sectionId) => {
      if (isTempId(sectionId)) return;
      try {
        const fetchedQuestions =
          await questionBankApi.getQuestionsBySectionId(sectionId);
        if (fetchedQuestions) {
          setSections((prev) =>
            prev.map((sec) =>
              sec.id === sectionId
                ? { ...sec, questions: fetchedQuestions }
                : sec,
            ),
          );
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    },
    [isTempId, setSections],
  );

  const handleFetchQuizForSection = useCallback(
    async (sectionId) => {
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
        console.error("Error fetching quiz:", error);
      }
    },
    [isTempId, setSections],
  );

  const toggleSection = (id) => {
    if (!expandedSections.includes(id)) {
      setExpandedSections([...expandedSections, id]);
      const targetSec = sections.find((s) => s.id === id);
      if (targetSec && !isTempId(id)) {
        if (targetSec.quiz === undefined) handleFetchQuizForSection(id);
        if (!targetSec.questions || targetSec.questions.length === 0)
          handleFetchQuestionsForSection(id);
      }
    } else {
      setExpandedSections(expandedSections.filter((secId) => secId !== id));
    }
  };

  useEffect(() => {
    if (sections.length > 0 && !isTempId(sections[0].id)) {
      if (sections[0].quiz === undefined)
        handleFetchQuizForSection(sections[0].id);
      if (!sections[0].questions || sections[0].questions.length === 0)
        handleFetchQuestionsForSection(sections[0].id);
    }
  }, [
    sections,
    handleFetchQuestionsForSection,
    handleFetchQuizForSection,
    isTempId,
  ]);

  const handleAddSection = () => {
    const newSection = {
      id: `temp_section_${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      order: sections.length + 1,
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
    if (window.confirm("Are you sure you want to delete this section?"))
      onDeleteSection && onDeleteSection(id);
  };

  const updateSectionTitle = (id, title) =>
    setSections(sections.map((s) => (s.id === id ? { ...s, title } : s)));

  const openModal = (type, secId) => {
    setActiveSectionId(secId);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setActiveSectionId(null);
  };

  const handleSaveLesson = (lessonData) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === activeSectionId
          ? {
              ...s,
              lessons: [
                ...(s.lessons || []),
                {
                  ...lessonData,
                  id: `temp_l_${Date.now()}`,
                  order: (s.lessons || []).length + 1,
                  isNew: true,
                },
              ],
            }
          : s,
      ),
    );
  };

  const handleSaveQuiz = (quizData) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === activeSectionId) {
          const alreadyHasRealQuiz = s.quiz && !isTempId(s.quiz.id);

          return {
            ...s,
            quiz: {
              ...quizData,
              id: alreadyHasRealQuiz ? s.quiz.id : quizData.id,
              isNew: !alreadyHasRealQuiz,
              isModified: alreadyHasRealQuiz ? true : quizData.isModified,
            },
          };
        }
        return s;
      }),
    );
  };

  const handleSaveQuestion = (qData) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === activeSectionId
          ? { ...s, questions: [...(s.questions || []), qData] }
          : s,
      ),
    );

  const handleReorderLessons = (secId, reordered) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === secId
          ? { ...s, lessons: reordered.map((l, i) => ({ ...l, order: i + 1 })) }
          : s,
      ),
    );

  const deleteLesson = (secId, lessonId) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === secId
          ? {
              ...s,
              lessons: (s.lessons || [])
                .filter((l) => l.id !== lessonId)
                .map((l, i) => ({ ...l, order: i + 1 })),
            }
          : s,
      ),
    );

  const deleteQuiz = (secId) => {
    const qId = sections.find((s) => s.id === secId)?.quiz?.id;
    if (qId && window.confirm("Delete this exam?"))
      onDeleteQuiz
        ? onDeleteQuiz(secId, qId)
        : setSections((prev) =>
            prev.map((s) => (s.id === secId ? { ...s, quiz: null } : s)),
          );
  };

  const deleteQuestion = (secId, qId) => {
    if (window.confirm("Delete this question?"))
      onDeleteQuestion
        ? onDeleteQuestion(secId, qId)
        : setSections((prev) =>
            prev.map((s) =>
              s.id === secId
                ? {
                    ...s,
                    questions: (s.questions || []).filter((q) => q.id !== qId),
                  }
                : s,
            ),
          );
  };

  const handleFetchAttachments = async (lessonId) => {
    if (!lessonId || isTempId(lessonId)) return;
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
      setSections((prev) =>
        prev.map((sec) => ({
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
      console.error("Error fetching attachments:", error);
    }
  };

  const handleAddAttachment = (secId, lessonId, attachmentData) => {
    if (!lessonId || !attachmentData) return;
    setSections((prev) =>
      prev.map((s) => {
        if (secId && String(s.id) !== String(secId)) return s;
        return {
          ...s,
          lessons: (s.lessons || []).map((l) => {
            if (String(l.id) === String(lessonId)) {
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

  const handleDeleteAttachment = (secId, lessonId, attId) => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        lessons: (s.lessons || []).map((l) => {
          if (String(l.id) === String(lessonId)) {
            return {
              ...l,
              attachments: (l.attachments || []).filter(
                (att) => String(att.id) !== String(attId),
              ),
            };
          }
          return l;
        }),
      })),
    );
  };

  return {
    expandedSections,
    activeModal,
    activeSectionId,
    toggleSection,
    handleAddSection,
    deleteSection,
    updateSectionTitle,
    openModal,
    closeModal,
    handleSaveLesson,
    handleSaveQuiz,
    handleSaveQuestion,
    handleReorderLessons,
    deleteLesson,
    deleteQuiz,
    deleteQuestion,
    handleFetchAttachments,
    handleAddAttachment,
    handleDeleteAttachment,
  };
};
