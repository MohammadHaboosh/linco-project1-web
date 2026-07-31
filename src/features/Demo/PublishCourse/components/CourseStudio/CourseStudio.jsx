import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBack, IoCheckmarkOutline } from "react-icons/io5";
import StepOneDetails from "./StepOneDetails";
import StepTwoCurriculum from "./StepTwoCurriculum";
import styles from "./CourseStudio.module.css";
import { useTranslation } from "react-i18next";
import { useCreateCourse } from "../../hooks/useCreateCourse";

import { sectionApi } from "../../../OwnerCourses/api/sectionApi";
import { courseManagerApi } from "../../../OwnerCourses/api/courseManagerApi";
import { lessonApi } from "../../../OwnerCourses/api/lessonApi";

const CourseStudio = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { demoId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [deletedSectionIds, setDeletedSectionIds] = useState([]);

  // حالة لتتبع نسبة رفع الفيديو الحالي
  const [uploadProgress, setUploadProgress] = useState(null);

  const { createCourse, isCreating } = useCreateCourse(demoId);

  const [courseData, setCourseData] = useState({
    id: null,
    title: "",
    description: "",
    tags: [],
    imagePath: "",
    imageFile: null,
    imagePreview: null,
    visibility: "PUBLIC",
    price: 0,
    sections: [],
  });

  const updateCourseData = (fieldOrObject, value) => {
    setCourseData((prev) => {
      if (typeof fieldOrObject === "object" && fieldOrObject !== null) {
        return { ...prev, ...fieldOrObject };
      }
      return { ...prev, [fieldOrObject]: value };
    });
  };

  const isTempId = (id) => {
    if (!id) return true;
    const strId = String(id);
    return strId.startsWith("temp-") || strId.startsWith("temp_");
  };

  const handleRemoveSection = (section, sectionId) => {
    const targetId =
      sectionId || (typeof section === "object" ? section?.id : section);
    const isNew = typeof section === "object" ? section?.isNew : false;

    if (targetId && !isNew && !isTempId(targetId)) {
      setDeletedSectionIds((prev) => [...prev, targetId]);
    }

    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.filter((sec) => sec.id !== targetId),
    }));
  };

  const handleNextStep = async () => {
    if (!courseData.title.trim() || !courseData.description.trim()) {
      alert("Please fill in the course title and description.");
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
        if (courseData.imageFile) {
          const basePayload = {
            title: courseData.title,
            description: courseData.description,
            imagePath: courseData.imagePath,
            visibility: courseData.visibility || "PUBLIC",
            price: Number(courseData.price) || 0,
          };

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

      const processedSections = await Promise.all(
        sections.map(async (sec, index) => {
          const payload = {
            title: sec.title,
            order: sec.order || index + 1,
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

          return {
            ...sec,
            realId: realSectionId,
          };
        }),
      );

      for (const section of processedSections) {
        const lessons = section.lessons || [];

        for (let index = 0; index < lessons.length; index++) {
          const lesson = lessons[index];
          const isNewLesson = !lesson.id || lesson.isNew || isTempId(lesson.id);

          if (isNewLesson) {
            let finalVideoUrl = lesson.videoUrl || "";

            if (lesson.videoFile) {
              const uploadData = await lessonApi.getUploadUrl(
                section.realId,
                lesson.videoFile.name,
              );

              const uploadUrl = uploadData.uploadUrl || uploadData.url;
              finalVideoUrl =
                uploadData.videoUrl ||
                uploadData.fileUrl ||
                uploadData.publicUrl ||
                finalVideoUrl;

              if (uploadUrl) {
                // البدء بتهيئة النسبة عند 0%
                setUploadProgress({
                  title: lesson.title || `Lesson ${index + 1}`,
                  percent: 0,
                });

                // رفع الفيديو وتتبع النسبة لحظة بلحظة
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

                // تثبيت النسبة عند 100% لفترة قصيرة لإعطاء انطباع بصري باكتماها
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

            await lessonApi.createLesson(section.realId, lessonPayload);
          }
        }
      }

      setDeletedSectionIds([]);
      alert("Course, sections, and lessons saved successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error saving curriculum:", error);
      alert("Failed to save: " + (error.message || "Something went wrong"));
    } finally {
      setIsPublishing(false);
      setUploadProgress(null); // تفريغ نسبة الرفع بعد الانتهاء أو عند الخطأ
    }
  };

  return (
    <div className={styles.studioContainer}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <IoChevronBack /> {t("back")}
          </button>
        </div>

        <div className={styles.stepperContainer}>
          <div
            className={`${styles.stepIndicator} ${
              currentStep >= 1 ? styles.stepActive : ""
            }`}
          >
            <div className={styles.stepCircle}>
              {currentStep > 1 ? <IoCheckmarkOutline /> : "1"}
            </div>
            <span>{t("course-setup")}</span>
          </div>
          <div
            className={`${styles.stepLine} ${
              currentStep === 2 ? styles.lineActive : ""
            }`}
          ></div>
          <div
            className={`${styles.stepIndicator} ${
              currentStep === 2 ? styles.stepActive : ""
            }`}
          >
            <div className={styles.stepCircle}>2</div>
            <span>{t("curriculum-builder")}</span>
          </div>
        </div>

        <div className={styles.topBarRight}></div>
      </div>

      <div className={styles.workspaceCentered}>
        {currentStep === 1 && (
          <StepOneDetails
            courseData={courseData}
            updateCourseData={updateCourseData}
            onNext={handleNextStep}
            isCreating={isCreating}
          />
        )}

        {currentStep === 2 && (
          <StepTwoCurriculum
            courseData={courseData}
            updateCourseData={updateCourseData}
            onPublish={handlePublish}
            isPublishing={isPublishing}
            onBack={() => setCurrentStep(1)}
            onDeleteSection={handleRemoveSection}
          />
        )}
      </div>

      {/* نافذة شريط تقدم الرفع عند رفع الدروس */}
      {uploadProgress && (
        <div className={styles.progressOverlay}>
          <div className={styles.progressCard}>
            <h4>Uploading Video...</h4>
            <p className={styles.lessonTitle}>{uploadProgress.title}</p>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${uploadProgress.percent}%` }}
              ></div>
            </div>
            <span className={styles.progressPercentage}>
              {uploadProgress.percent}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseStudio;
