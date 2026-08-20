import { sectionApi } from "../../OwnerCourses/api/sectionApi";
import { courseManagerApi } from "../../OwnerCourses/api/courseManagerApi";
import { lessonApi } from "../../OwnerCourses/api/lessonApi";
import { attachmentApi } from "../../OwnerCourses/api/attachmentApi";
import { quizApi } from "../../OwnerCourses/api/quizApi";
import { questionBankApi } from "../../OwnerCourses/api/questionBankApi";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useCoursePublisher = ({
  courseData,
  setCourseData,
  createCourse,
  setCurrentStep,
  setIsPublishing,
  setUploadProgress,
  deletedSectionIds,
  setDeletedSectionIds,
  isTempId,
  navigate,
}) => {
  const { t, i18n } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const numberFormatter = new Intl.NumberFormat(
    i18n.resolvedLanguage || i18n.language,
  );

  const clearError = () => setErrorMessage("");
  const getLessonUploadMessage = (lesson, index) =>
    t("course-studio-uploading-lesson", {
      title:
        lesson.title ||
        t("lesson-number", { number: numberFormatter.format(index + 1) }),
    });

  const handleNextStep = async () => {
    clearError();
    const hasTitle = courseData.title?.trim();
    const hasDescription = courseData.description?.trim();
    const hasTags = courseData.tags && courseData.tags.length > 0;
    const hasValidPrice =
      courseData.price !== "" &&
      courseData.price !== null &&
      Number(courseData.price) >= 0;
    const hasImage =
      courseData.imageFile ||
      (courseData.imagePath &&
        courseData.imagePath !== "default" &&
        courseData.imagePath !== "qwertyuiop");

    if (
      !hasTitle ||
      !hasDescription ||
      !hasTags ||
      !hasValidPrice ||
      !hasImage
    ) {
      setErrorMessage(t("course-studio-required-fields-error"));
      return;
    }

    try {
      if (!courseData.id) {
        const createdCourse = await createCourse(courseData);
        setCourseData((prev) => ({
          ...prev,
          ...createdCourse,
          id: createdCourse.id,
          imagePath: createdCourse.imagePath || prev.imagePath,
          imageFile: null,
          imagePreview: null,
        }));
      } else {
        const basePayload = {
          title: courseData.title,
          description: courseData.description,
          imagePath: courseData.imagePath,
          visibility: courseData.visibility || "PUBLIC",
          price: Number(courseData.price) || 0,
        };

        if (courseData.imageFile) {
          const updateResult = await courseManagerApi.uploadAndSaveCourseImage(
            courseData.id,
            courseData.imageFile,
            basePayload,
          );

          setCourseData((prev) => ({
            ...prev,
            imagePath: updateResult?.imagePath || prev.imagePath,
            imageFile: null,
            imagePreview: null,
          }));
        } else {
          await courseManagerApi.updateCourseGeneralInfo(
            courseData.id,
            basePayload,
          );
        }
      }

      setCurrentStep(2);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error in Step 1 Next:", error);
      setErrorMessage(t("course-studio-setup-save-error"));
    }
  };

  const handlePublish = async () => {
    clearError();
    if (!courseData.id) {
      setErrorMessage(t("course-studio-missing-course-error"));
      return;
    }

    setIsPublishing(true);
    const currentSections = courseData.sections || [];
    const updatedSectionsList = [...currentSections];

    try {
      const activeCourseId = courseData.id;

      const processedTitles = currentSections.map((sec, index) => {
        return sec.title?.trim() || `Section ${index + 1}`;
      });

      const uniqueTitles = new Set(processedTitles.map((t) => t.toLowerCase()));
      if (uniqueTitles.size !== processedTitles.length) {
        setErrorMessage(t("section-title-unique-error"));
        setIsPublishing(false);
        return;
      }

      if (deletedSectionIds.length > 0) {
        await Promise.all(
          deletedSectionIds.map((secId) =>
            sectionApi.deleteSection(activeCourseId, secId),
          ),
        );
      }

      for (let index = 0; index < currentSections.length; index++) {
        const sec = currentSections[index];
        const finalTitle = processedTitles[index];
        const payload = { title: finalTitle, order: sec.order || index + 1 };

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

        const finalSecId =
          savedSection?.id ||
          savedSection?.data?.id ||
          savedSection?.section?.id ||
          sec.id;

        if (isTempId(finalSecId)) {
          console.warn("Warning: Still using a temp ID for section.");
        }

        updatedSectionsList[index] = {
          ...sec,
          title: finalTitle,
          id: finalSecId,
          realId: finalSecId,
          isNew: false,
        };

        const questions = sec.questions || [];
        const updatedQuestions = [...questions];
        for (let qIndex = 0; qIndex < questions.length; qIndex++) {
          const q = questions[qIndex];
          if (q.isNew || isTempId(q.id)) {
            try {
              const createdQ = await questionBankApi.addQuestion(finalSecId, q);
              updatedQuestions[qIndex] = {
                ...(createdQ?.data || createdQ || q),
                isNew: false,
              };
            } catch (qError) {
              console.error(
                `Failed to create question for section ${finalSecId}:`,
                qError,
              );
              throw qError;
            }
          }
        }
        updatedSectionsList[index].questions = updatedQuestions;

        let updatedQuiz = sec.quiz;
        if (updatedQuiz && (updatedQuiz.isNew || isTempId(updatedQuiz.id))) {
          try {
            const createdQuiz = await quizApi.createQuiz(finalSecId, {
              title: updatedQuiz.title,
              numberOfQuestions: updatedQuiz.numberOfQuestions,
              durationMinutes: updatedQuiz.durationMinutes,
              passingScore: updatedQuiz.passingScore,
            });
            updatedQuiz = {
              ...(createdQuiz?.data || createdQuiz || updatedQuiz),
              isNew: false,
              isModified: false,
            };
          } catch (quizError) {
            console.error(
              `Failed to create quiz for section ${finalSecId}:`,
              quizError,
            );
            throw quizError;
          }
        }
        updatedSectionsList[index].quiz = updatedQuiz;

        const lessons = sec.lessons || [];
        const updatedLessons = [...lessons];
        for (let lIndex = 0; lIndex < lessons.length; lIndex++) {
          const lesson = lessons[lIndex];
          const isNewLesson = !lesson.id || lesson.isNew || isTempId(lesson.id);

          let realLessonId = lesson.id;
          let finalVideoUrl = lesson.videoUrl || "";
          if (finalVideoUrl.startsWith("blob:")) finalVideoUrl = "";

          if (isNewLesson) {
            if (lesson.videoFile) {
              setUploadProgress({
                title: getLessonUploadMessage(lesson, lIndex),
                percent: 0,
              });
              const uploadData = await lessonApi.getUploadUrl(
                finalSecId,
                lesson.videoFile.name,
              );
              const uploadUrl = uploadData.uploadUrl || uploadData.url;
              const cloudUrl =
                uploadData.cdnUrl ||
                uploadData.videoUrl ||
                uploadData.fileKey ||
                uploadData.fileUrl ||
                uploadData.publicUrl ||
                uploadData.path ||
                uploadData.key;

              if (!cloudUrl)
                throw new Error(t("course-studio-video-url-missing"));
              finalVideoUrl = cloudUrl;

              if (uploadUrl) {
                await lessonApi.uploadVideoToStorage(
                  uploadUrl,
                  lesson.videoFile,
                  (percent) => {
                    setUploadProgress({
                      title: getLessonUploadMessage(lesson, lIndex),
                      percent: percent,
                    });
                  },
                );
                setUploadProgress({
                  title: getLessonUploadMessage(lesson, lIndex),
                  percent: 100,
                });
                await new Promise((resolve) => setTimeout(resolve, 400));
              }
            }

            const createdLesson = await lessonApi.createLesson(finalSecId, {
              title: lesson.title?.trim() || `Lesson ${lIndex + 1}`,
              order: lesson.order || lIndex + 1,
              videoUrl: finalVideoUrl,
              courseId: activeCourseId,
              description:
                lesson.description?.trim() || t("lesson-default-description"),
              duration: Number(lesson.duration) || 0,
            });

            realLessonId =
              createdLesson?.id ||
              createdLesson?.data?.id ||
              createdLesson?.lesson?.id ||
              lesson.id;
          }

          const currentAttachments = lesson.attachments || [];
          const updatedAttachments = [...currentAttachments];
          const newAttachments = currentAttachments.filter(
            (att) => att.isNew && att.file,
          );

          if (newAttachments.length > 0 && realLessonId) {
            try {
              const fileNames = newAttachments.map((att) => att.file.name);
              const uploadUrls = await attachmentApi.getUploadUrl(
                realLessonId,
                fileNames,
              );

              for (
                let aIndex = 0;
                aIndex < currentAttachments.length;
                aIndex++
              ) {
                const att = currentAttachments[aIndex];
                if (att.isNew && att.file) {
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

                  updatedAttachments[aIndex] = {
                    ...(createdAtt?.data || createdAtt || att),
                    isNew: false,
                  };
                }
              }
            } catch (attError) {
              console.error(
                `Failed to process attachments for lesson ID ${realLessonId}:`,
                attError,
              );
              throw attError;
            }
          }

          updatedLessons[lIndex] = {
            ...lesson,
            id: realLessonId,
            videoUrl: finalVideoUrl,
            videoFile: null,
            isNew: false,
            attachments: updatedAttachments,
          };
        }
        updatedSectionsList[index].lessons = updatedLessons;
      }

      setDeletedSectionIds([]);
      alert(t("course-studio-save-success"));
      navigate(-1);
    } catch (error) {
      console.error("Error saving curriculum:", error);

      setCourseData((prev) => ({
        ...prev,
        sections: updatedSectionsList,
      }));

      const backendMessage = error?.response?.data?.message || error?.message;
      t("course-studio-publish-error");
      setErrorMessage(backendMessage);
    } finally {
      setIsPublishing(false);
      setUploadProgress(null);
    }
  };

  return { errorMessage, clearError, handleNextStep, handlePublish };
};
