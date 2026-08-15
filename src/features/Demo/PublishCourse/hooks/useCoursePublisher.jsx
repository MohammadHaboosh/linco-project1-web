import { sectionApi } from "../../OwnerCourses/api/sectionApi";
import { courseManagerApi } from "../../OwnerCourses/api/courseManagerApi";
import { lessonApi } from "../../OwnerCourses/api/lessonApi";
import { attachmentApi } from "../../OwnerCourses/api/attachmentApi";
import { quizApi } from "../../OwnerCourses/api/quizApi";
import { questionBankApi } from "../../OwnerCourses/api/questionBankApi";

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
  const handleNextStep = async () => {
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
      alert(
        "Please fill in all required fields: Course Thumbnail, Title, Price, Tags, and Description.",
      );
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
      alert(error.message || "Failed to proceed to next step");
    }
  };

  const handlePublish = async () => {
    if (!courseData.id) {
      alert("Course ID is missing. Please complete step 1 first.");
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
                title: lesson.title || `Lesson ${index + 1}`,
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
                throw new Error(
                  `الباك إند لم يرسل الرابط النهائي للدرس: ${lesson.title}`,
                );
              finalVideoUrl = cloudUrl;

              if (uploadUrl) {
                await lessonApi.uploadVideoToStorage(
                  uploadUrl,
                  lesson.videoFile,
                  (percent) => {
                    setUploadProgress({
                      title: lesson.title || `Lesson ${index + 1}`,
                      percent: percent,
                    });
                  },
                );
                setUploadProgress({
                  title: lesson.title || `Lesson ${index + 1}`,
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
              description: lesson.description || "",
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
                        title: `Uploading Attachment: ${att.file.name}`,
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
            }
          }
        }
      }

      setDeletedSectionIds([]);
      alert(
        "Course, sections, lessons, attachments, and quizzes saved successfully!",
      );
      navigate(-1);
    } catch (error) {
      console.error("Error saving curriculum:", error);
      alert("Failed to save: " + (error.message || "Something went wrong"));
    } finally {
      setIsPublishing(false);
      setUploadProgress(null);
    }
  };

  return { handleNextStep, handlePublish };
};
