import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBack, IoCheckmarkOutline } from "react-icons/io5";
import StepOneDetails from "./StepOneDetails";
import StepTwoCurriculum from "./StepTwoCurriculum";
import styles from "./CourseStudio.module.css";
import { useTranslation } from "react-i18next";
import { useCreateCourse } from "../../hooks/useCreateCourse";

const CourseStudio = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { demoId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);

  const { createCourse, isCreating } = useCreateCourse(demoId);

  const [courseData, setCourseData] = useState({
    id: null,
    title: "",
    description: "",
    tags: [],
    imagePath: "",
    privacy: "public",
    price: 0,
    sections: [],
  });

  const updateCourseData = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = async () => {
    if (!courseData.title.trim() || !courseData.description.trim()) {
      alert("Please fill in the course title and description.");
      return;
    }

    if (!courseData.id) {
      try {
        const createdCourse = await createCourse(courseData);
        updateCourseData("id", createdCourse.id);
        setCurrentStep(2);
        window.scrollTo(0, 0);
      } catch (error) {
        alert(error.message);
      }
    } else {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePublish = () => {
    setIsPublishing(true);
    console.log("Publishing Course:", courseData);
    setTimeout(() => {
      navigate(-1);
    }, 1500);
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
          />
        )}
      </div>
    </div>
  );
};

export default CourseStudio;
