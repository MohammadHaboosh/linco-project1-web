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

    try {
      const activeCourseId = courseData.id;
      const sections = courseData.sections || [];

      if (deletedSectionIds.length > 0) {
        await Promise.all(
          deletedSectionIds.map((secId) =>
            sectionApi.deleteSection(activeCourseId, secId),
          ),
        );
      }

      const processedSections = [];

      for (let index = 0; index < sections.length; index++) {
        const sec = sections[index];
        const payload = { title: sec.title, order: sec.order || index + 1 };
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
          console.warn(
            "Warning: Still using a temp ID for section. The backend didn't return a proper ID.",
          );
        }

        processedSections.push({
          ...sec,
          realId: finalSecId,
        });
      }

      for (const section of processedSections) {
        if (section.quiz && (section.quiz.isNew || isTempId(section.quiz.id))) {
          try {
            await quizApi.createQuiz(section.realId, {
              title: section.quiz.title,
              numberOfQuestions: section.quiz.numberOfQuestions,
              durationMinutes: section.quiz.durationMinutes,
              passingScore: section.quiz.passingScore,
            });
          } catch (quizError) {
            console.error(
              `Failed to create quiz for section ${section.realId}:`,
              quizError,
            );
            throw quizError;
          }
        }

        const questions = section.questions || [];
        for (const q of questions) {
          if (q.isNew || isTempId(q.id)) {
            try {
              await questionBankApi.addQuestion(section.realId, q);
            } catch (qError) {
              console.error(
                `Failed to create question for section ${section.realId}:`,
                qError,
              );
              throw qError;
            }
          }
        }

        const lessons = section.lessons || [];
        for (let index = 0; index < lessons.length; index++) {
          const lesson = lessons[index];
          const isNewLesson = !lesson.id || lesson.isNew || isTempId(lesson.id);

          let realLessonId = lesson.id;
          let finalVideoUrl = lesson.videoUrl || "";
          if (finalVideoUrl.startsWith("blob:")) finalVideoUrl = "";

          if (isNewLesson) {
            if (lesson.videoFile) {
              setUploadProgress({
                title: getLessonUploadMessage(lesson, index),
                percent: 0,
              });
              const uploadData = await lessonApi.getUploadUrl(
                section.realId,
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
                      title: getLessonUploadMessage(lesson, index),
                      percent: percent,
                    });
                  },
                );
                setUploadProgress({
                  title: getLessonUploadMessage(lesson, index),
                  percent: 100,
                });
                await new Promise((resolve) => setTimeout(resolve, 400));
              }
            }

            const createdLesson = await lessonApi.createLesson(section.realId, {
              title: lesson.title,
              order: lesson.order || index + 1,
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

                await attachmentApi.createAttachment(realLessonId, {
                  name: att.title || att.fileName || att.file.name,
                  path: finalPath,
                });
              }
            } catch (attError) {
              console.error(
                `Failed to process attachments for lesson ID ${realLessonId}:`,
                attError,
              );
              throw attError;
            }
          }
        }
      }

      setDeletedSectionIds([]);
      alert(t("course-studio-save-success"));
      navigate(-1);
    } catch (error) {
      console.error("Error saving curriculum:", error);
      setErrorMessage(t("course-studio-publish-error"));
    } finally {
      setIsPublishing(false);
      setUploadProgress(null);
    }
  };

  return { errorMessage, clearError, handleNextStep, handlePublish };
};
