import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoInformationCircleOutline,
  IoListOutline,
  IoChatbubblesOutline,
  IoSaveOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { useCourseManager } from "../../../hooks/useCourseManager";
import GeneralInfoTab from "./tabs/GeneralInfoTab/GeneralInfoTab";
import CurriculumTab from "./tabs/CurriculumTab/CurriculumTab";
import FAQsTab from "./tabs/FAQsTab";
import styles from "./CourseManager.module.css";
import { useTranslation } from "react-i18next";
import { lessonApi } from "../../../api/lessonApi";
import { sectionApi } from "../../../api/sectionApi";

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
    faqs,
    setFaqs,
    sections,
    setSections,
    deletedSectionIds,
    setDeletedSectionIds,
  } = useCourseManager(demoId, assetId);

  const [activeTab, setActiveTab] = useState("curriculum");

  const handleDeleteSection = (sectionId) => {
    if (sectionId && !isTempId(sectionId)) {
      setDeletedSectionIds((prev) => [...(prev || []), sectionId]);
    }
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
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

      // 3. إنشاء أو تحديث الأقسام والحصول على Real IDs
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

          if (isNewLesson) {
            let finalVideoUrl = lesson.videoUrl || "";

            if (lesson.videoFile) {
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
                );
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

            const realLessonId =
              createdLesson?.id || createdLesson?.data?.id || lesson.id;

            updatedLessonsList.push({
              ...lesson,
              id: realLessonId,
              videoUrl: finalVideoUrl,
              videoFile: null,
              isNew: false,
            });
          } else {
            updatedLessonsList.push(lesson);
          }
        }

        updatedSectionsList.push({
          ...sec,
          id: realSectionId,
          isNew: false,
          lessons: updatedLessonsList,
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
      if (setIsSaving) setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>Loading Workspace...</p>
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
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            title="Go back"
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
              />
            )}
            {activeTab === "faqs" && <FAQsTab faqs={faqs} setFaqs={setFaqs} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseManagerLayout;
