import { useState } from "react";
import { useTranslation } from "react-i18next";
import { sectionApi } from "../api/sectionApi";
import { lessonApi } from "../api/lessonApi";
import { attachmentApi } from "../api/attachmentApi";
import { quizApi } from "../api/quizApi";
import { questionBankApi } from "../api/questionBankApi";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

export const useCourseSaver = ({
  courseId,
  assetId,
  demoId,
  saveGeneralInfo,
  setIsSaving,
}) => {
  const { t, i18n } = useTranslation();
  const [uploadProgress, setUploadProgress] = useState(null);
  const [saveFeedback, setSaveFeedback] = useState(null);

  const formatNumber = (value) =>
    new Intl.NumberFormat(i18n.resolvedLanguage || i18n.language).format(value);

  const isTempId = (id) =>
    !id || String(id).startsWith("temp-") || String(id).startsWith("temp_");

  const saveCourseData = async (sections, setSections, deletedIds) => {
    const {
      deletedSectionIds,
      setDeletedSectionIds,
      deletedQuizIds,
      setDeletedQuizIds,
      deletedQuestionIds,
      setDeletedQuestionIds,
    } = deletedIds;

    try {
      setSaveFeedback(null);
      if (setIsSaving) setIsSaving(true);
      const activeCourseId = courseId || assetId || demoId;
      let hadItemSaveErrors = false;
      let itemSaveError = "";

      for (let i = 0; i < (sections || []).length; i++) {
        const sec = sections[i];
        if (sec.quiz) {
          const quizQCount = Number(sec.quiz.numberOfQuestions || 0);
          const bankQCount = sec.questions?.length || 0;

          if (quizQCount > bankQCount) {
            setSaveFeedback({
              type: "error",
              message: t("quiz-questions-exceed-bank-error", {
                defaultValue: `The number of questions in the quiz exceeds the number of questions in the question bank (${bankQCount}). Please ensure that the quiz does not have more questions than are available in the question bank.`,
              }),
            });
            if (setIsSaving) setIsSaving(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return false;
          }
        }
      }

      if (saveGeneralInfo) {
        await saveGeneralInfo();
      }

      if (deletedSectionIds && deletedSectionIds.length > 0) {
        await Promise.all(
          deletedSectionIds.map((secId) =>
            sectionApi.deleteSection(activeCourseId, secId),
          ),
        );
        if (setDeletedSectionIds) setDeletedSectionIds([]);
      }

      if (deletedQuizIds.length > 0) {
        await Promise.all(
          deletedQuizIds.map((q) => quizApi.deleteQuiz(q.secId, q.quizId)),
        );
        setDeletedQuizIds([]);
      }

      if (deletedQuestionIds.length > 0) {
        if (questionBankApi.deleteQuestion) {
          await Promise.all(
            deletedQuestionIds.map((q) =>
              questionBankApi.deleteQuestion(q.secId, q.questionId),
            ),
          );
        }
        setDeletedQuestionIds([]);
      }

      const updatedSectionsList = [];

      for (let i = 0; i < (sections || []).length; i++) {
        const sec = sections[i];
        const payload = {
          title: sec.title,
          order: sec.order || i + 1,
        };

        const isNewSection = !sec.id || sec.isNew || isTempId(sec.id);

        let savedSection;
        if (isNewSection) {
          savedSection = await sectionApi.createSection(
            activeCourseId,
            payload,
          );
        } else {
          savedSection = await sectionApi.updateSection(
            activeCourseId,
            sec.id,
            payload,
          );
        }

        const realSectionId =
          savedSection?.id || savedSection?.data?.id || sec.id;

        const currentLessons = sec.lessons || [];
        const updatedLessonsList = [];

        for (let index = 0; index < currentLessons.length; index++) {
          const lesson = currentLessons[index];
          const isNewLesson =
            !lesson.id || lesson.isNew === true || isTempId(lesson.id);

          let realLessonId = lesson.id;
          let finalVideoUrl = lesson.videoUrl || "";
          if (finalVideoUrl.startsWith("blob:")) finalVideoUrl = "";

          if (isNewLesson) {
            if (lesson.videoFile) {
              const lessonTitle =
                lesson.title ||
                t("lesson-number", { number: formatNumber(index + 1) });
              setUploadProgress({
                title: t("course-studio-uploading-lesson", {
                  title: lessonTitle,
                }),
                percent: 0,
              });

              const uploadData = await lessonApi.getUploadUrl(
                realSectionId,
                lesson.videoFile.name,
              );

              const uploadUrl = uploadData.uploadUrl || uploadData.url;

              finalVideoUrl =
                uploadData.cdnUrl ||
                uploadData.fileKey ||
                uploadData.path ||
                uploadData.key ||
                uploadData.videoUrl ||
                uploadData.fileUrl ||
                uploadData.publicUrl ||
                finalVideoUrl;

              if (!finalVideoUrl) {
                const videoUrlError = new Error(
                  t("course-studio-video-url-missing"),
                );
                videoUrlError.name = "CourseValidationError";
                throw videoUrlError;
              }

              if (uploadUrl) {
                await lessonApi.uploadVideoToStorage(
                  uploadUrl,
                  lesson.videoFile,
                  (percent) => {
                    setUploadProgress({
                      title: t("course-studio-uploading-lesson", {
                        title: lessonTitle,
                      }),
                      percent: percent,
                    });
                  },
                );

                setUploadProgress({
                  title: t("course-studio-uploading-lesson", {
                    title: lessonTitle,
                  }),
                  percent: 100,
                });
                await new Promise((resolve) => setTimeout(resolve, 400));
              }
            }

            const lessonPayload = {
              title: lesson.title,
              order: lesson.order || index + 1,
              videoUrl: finalVideoUrl,
              courseId: activeCourseId,
              description:
                lesson.description?.trim() || t("lesson-default-description"),
              duration: Number(lesson.duration) || 0,
            };

            const createdLesson = await lessonApi.createLesson(
              realSectionId,
              lessonPayload,
            );

            realLessonId =
              createdLesson?.id || createdLesson?.data?.id || lesson.id;
          }
          const currentAttachments = lesson.attachments || [];
          const updatedAttachmentsList = [];

          const newAttachments = currentAttachments.filter(
            (att) => att.isNew && att.file,
          );
          const existingAttachments = currentAttachments.filter(
            (att) => !att.isNew || !att.file,
          );

          updatedAttachmentsList.push(...existingAttachments);

          if (newAttachments.length > 0 && realLessonId) {
            try {
              const fileNames = newAttachments.map((att) => att.file.name);
              const uploadUrls = await attachmentApi.getUploadUrl(
                realLessonId,
                fileNames,
              );

              for (const att of newAttachments) {
                const uploadInfo = uploadUrls?.find(
                  (u) =>
                    u.fileName === att.file.name || u.name === att.file.name,
                );

                const uploadUrl = uploadInfo?.uploadUrl || uploadInfo?.url;
                const finalPath =
                  uploadInfo?.fileKey ||
                  uploadInfo?.cdnUrl ||
                  uploadInfo?.path ||
                  "";

                if (uploadUrl) {
                  await attachmentApi.uploadAttachmentToStorage(
                    uploadUrl,
                    att.file,
                    (percent) => {
                      setUploadProgress({
                        title: t("course-studio-uploading-attachment", {
                          fileName: att.file.name,
                        }),
                        percent: percent,
                      });
                    },
                  );
                }

                const createdAtt = await attachmentApi.createAttachment(
                  realLessonId,
                  {
                    name: att.title || att.fileName || att.file.name,
                    path: finalPath,
                  },
                );

                updatedAttachmentsList.push({
                  id: createdAtt?.id || createdAtt?.data?.id,
                  title: createdAtt?.name || att.title,
                  fileName: createdAtt?.name || att.fileName,
                  path: createdAtt?.path || finalPath,
                  isNew: false,
                });
              }
            } catch (attError) {
              console.error(
                `Failed to process attachments for lesson ID ${realLessonId}:`,
                attError,
              );
              hadItemSaveErrors = true;
              itemSaveError ||= getApiErrorMessage(attError);
              updatedAttachmentsList.push(...newAttachments);
            }
          }

          updatedLessonsList.push({
            ...lesson,
            id: realLessonId,
            attachments: updatedAttachmentsList,
            videoUrl: finalVideoUrl,
            videoFile: null,
            isNew: false,
          });

          setUploadProgress(null);
        }

        const currentQuestions = sec.questions || [];
        const updatedQuestionsList = [];
        for (let q of currentQuestions) {
          if (q.isNew || isTempId(q.id)) {
            try {
              const createdQ = await questionBankApi.addQuestion(
                realSectionId,
                q,
              );
              updatedQuestionsList.push({
                ...(createdQ?.data || createdQ),
                isNew: false,
              });
            } catch (err) {
              console.error("Failed to save question", err);
              hadItemSaveErrors = true;
              itemSaveError ||= getApiErrorMessage(err);
              updatedQuestionsList.push(q);
            }
          } else {
            updatedQuestionsList.push(q);
          }
        }

        let updatedQuiz = sec.quiz;
        if (sec.quiz) {
          if (sec.quiz.isNew || isTempId(sec.quiz.id)) {
            try {
              const createdQuiz = await quizApi.createQuiz(
                realSectionId,
                sec.quiz,
              );
              updatedQuiz = {
                ...(createdQuiz?.data || createdQuiz),
                isNew: false,
                isModified: false,
              };
            } catch (err) {
              console.error("Failed to create quiz", err);
              hadItemSaveErrors = true;
              itemSaveError ||= getApiErrorMessage(err);
            }
          } else if (sec.quiz.isModified) {
            try {
              const editedQuiz = await quizApi.updateQuiz(
                realSectionId,
                sec.quiz.id,
                sec.quiz,
              );
              updatedQuiz = {
                ...(editedQuiz?.data || editedQuiz),
                isNew: false,
                isModified: false,
              };
            } catch (err) {
              console.error("Failed to update quiz", err);
              hadItemSaveErrors = true;
              itemSaveError ||= getApiErrorMessage(err);
            }
          }
        }

        updatedSectionsList.push({
          ...sec,
          id: realSectionId,
          isNew: false,
          lessons: updatedLessonsList,
          quiz: updatedQuiz,
          questions: updatedQuestionsList,
        });
      }

      setSections(updatedSectionsList);
      if (hadItemSaveErrors) {
        setSaveFeedback({
          type: "error",
          message: itemSaveError || t("course-manager-save-failed"),
        });
        return false;
      }

      setSaveFeedback({
        type: "success",
        message: t("course-studio-save-success"),
      });
      return true;
    } catch (error) {
      console.error("Error saving:", error);
      setSaveFeedback({
        type: "error",
        message: getApiErrorMessage(
          error,
          t("course-manager-save-failed"),
        ),
      });
      return false;
    } finally {
      setUploadProgress(null);
      if (setIsSaving) setIsSaving(false);
    }
  };

  return {
    saveCourseData,
    uploadProgress,
    saveFeedback,
    clearSaveFeedback: () => setSaveFeedback(null),
  };
};
