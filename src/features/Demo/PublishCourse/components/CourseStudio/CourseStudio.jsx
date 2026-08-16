import { useNavigate, useParams } from "react-router-dom";
import StepOneDetails from "../StepOneDetails/StepOneDetails";
import StepTwoCurriculum from "../StepTwoCurriculum/StepTwoCurriculum";
import StudioTopBar from "../StudioTopBar/StudioTopBar";
import UploadProgressOverlay from "../../../OwnerCourses/components/ManageCourse/components/UploadProgressOverlay/UploadProgressOverlay";
import styles from "./CourseStudio.module.css";
import { useCreateCourse } from "../../hooks/useCreateCourse";

import { useCourseStudioState } from "../../hooks/useCourseStudioState";
import { useCoursePublisher } from "../../hooks/useCoursePublisher";
import { IoCloseOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

const CourseStudio = () => {
  const navigate = useNavigate();
  const { demoId } = useParams();
  const { t } = useTranslation();
  const errorBannerRef = useRef(null);

  const state = useCourseStudioState();

  const { createCourse, isCreating } = useCreateCourse(demoId);

  const { errorMessage, clearError, handleNextStep, handlePublish } =
    useCoursePublisher({
      ...state,
      createCourse,
      navigate,
    });

  useEffect(() => {
    if (errorMessage) {
      errorBannerRef.current?.focus();
      errorBannerRef.current?.scrollIntoView({ block: "center" });
    }
  }, [errorMessage]);

  return (
    <div className={styles.studioContainer}>
      <UploadProgressOverlay progress={state.uploadProgress} styles={styles} />

      <StudioTopBar
        currentStep={state.currentStep}
        onBack={() => navigate(-1)}
        styles={styles}
      />

      <main className={styles.workspaceCentered}>
        {errorMessage && (
          <div
            ref={errorBannerRef}
            className={styles.errorBanner}
            role="alert"
            tabIndex="-1"
          >
            <span>{errorMessage}</span>
            <button
              type="button"
              className={styles.dismissErrorBtn}
              onClick={clearError}
              aria-label={t("dismiss-error")}
            >
              <IoCloseOutline aria-hidden="true" />
            </button>
          </div>
        )}

        {state.currentStep === 1 && (
          <StepOneDetails
            courseData={state.courseData}
            updateCourseData={state.updateCourseData}
            onNext={handleNextStep}
            isCreating={isCreating}
          />
        )}

        {state.currentStep === 2 && (
          <StepTwoCurriculum
            courseData={state.courseData}
            updateCourseData={state.updateCourseData}
            onPublish={handlePublish}
            isPublishing={state.isPublishing}
            onBack={() => state.setCurrentStep(1)}
            onDeleteSection={state.handleRemoveSection}
          />
        )}
      </main>
    </div>
  );
};

export default CourseStudio;
