import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoInformationCircleOutline,
  IoListOutline,
  IoChatbubblesOutline,
  IoSaveOutline,
  IoChevronForwardOutline,
  IoCloudUploadOutline,
} from "react-icons/io5";
import { useCourseManager } from "../../../hooks/useCourseManager";
import GeneralInfoTab from "./tabs/GeneralInfoTab/GeneralInfoTab";
import CurriculumTab from "./tabs/CurriculumTab/CurriculumTab";
import FAQsTab from "./tabs/FAQsTab/FAQsTab";
import styles from "./CourseManager.module.css";
import { useTranslation } from "react-i18next";
import { lessonApi } from "../../../api/lessonApi";
import { sectionApi } from "../../../api/sectionApi";
import { attachmentApi } from "../../../api/attachmentApi";
import { quizApi } from "../../../api/quizApi";
import { questionBankApi } from "../../../api/questionBankApi";

const isTempId = (id) => {
  if (!id) return true;
  const strId = String(id);
  return (
    strId.startsWith("temp") ||
    strId.startsWith("temp_") ||
    strId.includes("temp")
  );
};

const CourseManagerLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { demoId, assetId } = useParams();

  const {
    isLoading,
    isSaving,
    setIsSaving,
    courseId,
    generalInfo,
    handleGeneralInfoChange,
    saveGeneralInfo,
    sections,
    setSections,
    deletedSectionIds,
    setDeletedSectionIds,
  } = useCourseManager(demoId, assetId);

  const [activeTab, setActiveTab] = useState("curriculum");
  const [uploadProgress, setUploadProgress] = useState(null);

  const [deletedQuizIds, setDeletedQuizIds] = useState([]);
  const [deletedQuestionIds, setDeletedQuestionIds] = useState([]);

  const handleDeleteSection = (sectionId) => {
    if (sectionId && !isTempId(sectionId)) {
      setDeletedSectionIds((prev) => [...(prev || []), sectionId]);
    }
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const handleDeleteQuiz = (secId, quizId) => {
    if (quizId && !isTempId(quizId)) {
      setDeletedQuizIds((prev) => [...prev, { secId, quizId }]);
    }
    setSections((prev) =>
      prev.map((s) => (s.id === secId ? { ...s, quiz: null } : s)),
    );
  };

  const handleDeleteQuestion = (secId, questionId) => {
    if (questionId && !isTempId(questionId)) {
      setDeletedQuestionIds((prev) => [...prev, { secId, questionId }]);
    }
    setSections((prev) =>
      prev.map((s) =>
        s.id === secId
          ? {
              ...s,
              questions: (s.questions || []).filter((q) => q.id !== questionId),
            }
          : s,
      ),
    );
  };

  const handleSaveAll = async () => {
    try {
      if (setIsSaving) setIsSaving(true);

      const activeCourseId = courseId || assetId || demoId;

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

          if (isNewLesson) {
            if (lesson.videoFile) {
              setUploadProgress({
                title: lesson.title || `Lesson ${index + 1}`,
                percent: 0,
              });

              const uploadData = await lessonApi.getUploadUrl(
                realSectionId,
                lesson.videoFile.name,
              );

              const uploadUrl = uploadData.uploadUrl || uploadData.url;
              finalVideoUrl =
                uploadData.videoUrl ||
                uploadData.fileUrl ||
                uploadData.publicUrl ||
                finalVideoUrl;

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

            const lessonPayload = {
              title: lesson.title,
              order: lesson.order || index + 1,
              videoUrl: finalVideoUrl,
              courseId: activeCourseId,
              description: lesson.description || "",
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
                        title: `Uploading: ${att.file.name}`,
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
            }
          }
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
              updatedQuestionsList.push(q);
            }
          } else {
            updatedQuestionsList.push(q);
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
      alert("All changes saved successfully!");
    } catch (error) {
      console.error("Error during full course save:", error);
      alert(
        "Failed to save changes: " + (error.message || "Something went wrong"),
      );
    } finally {
      setUploadProgress(null);
      if (setIsSaving) setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>{t("loading-workspace")}</p>
      </div>
    );
  }

  const TABS = [
    {
      id: "general",
      icon: <IoInformationCircleOutline />,
      label: t("general-info", "General Info"),
    },
    {
      id: "curriculum",
      icon: <IoListOutline />,
      label: t("curriculum", "Curriculum Builder"),
    },
    {
      id: "faqs",
      icon: <IoChatbubblesOutline />,
      label: t("faqs", "Course FAQs"),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {uploadProgress !== null && (
        <div className={styles.progressOverlay}>
          <div className={styles.progressCard}>
            <div className={styles.progressIcon}>
              <IoCloudUploadOutline />
            </div>
            <h3>{t("uploading-your-files-to-storage")}</h3>
            <p className={styles.lessonName}>{uploadProgress.title}</p>

            <div className={styles.progressBarWrapper}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${uploadProgress.percent}%` }}
              ></div>
            </div>

            <div className={styles.progressStats}>
              <span>{t("progress")}</span>
              <span className={styles.percentText}>
                {uploadProgress.percent}%
              </span>
            </div>
          </div>
        </div>
      )}

      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            title={t("go-back")}
          >
            <IoArrowBackOutline />
          </button>
          <div className={styles.courseHeaderInfo}>
            <span className={styles.badge}>
              {t("editing-mode", "Editing Mode")}
            </span>
            <h2>{generalInfo?.title || "Untitled Course"}</h2>
          </div>
        </div>

        <div className={styles.headerRight}>
          {activeTab !== "faqs" && (
            <button
              className={styles.saveBtn}
              onClick={handleSaveAll}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className={styles.btnSpinner}></div>
              ) : (
                <IoSaveOutline />
              )}
              <span>
                {isSaving
                  ? t("saving", "Saving...")
                  : t("save-changes", "Save Changes")}
              </span>
            </button>
          )}
        </div>
      </header>

      <div className={styles.layoutGrid}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span>NAVIGATION</span>
          </div>
          <nav className={styles.navMenu}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`${styles.navItem} ${
                    isActive ? styles.activeNav : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className={styles.navItemContent}>
                    <span className={styles.navIcon}>{tab.icon}</span>
                    <span className={styles.navLabel}>{tab.label}</span>
                  </div>
                  {isActive && (
                    <IoChevronForwardOutline className={styles.activeArrow} />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className={styles.mainPanel}>
          <div className={styles.contentWrapper}>
            {activeTab === "general" && (
              <GeneralInfoTab
                data={generalInfo}
                onChange={handleGeneralInfoChange}
              />
            )}
            {activeTab === "curriculum" && (
              <CurriculumTab
                courseId={courseId}
                sections={sections}
                setSections={setSections}
                onDeleteSection={handleDeleteSection}
                onDeleteQuiz={handleDeleteQuiz}
                onDeleteQuestion={handleDeleteQuestion}
              />
            )}
            {activeTab === "faqs" && <FAQsTab courseId={courseId} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseManagerLayout;
