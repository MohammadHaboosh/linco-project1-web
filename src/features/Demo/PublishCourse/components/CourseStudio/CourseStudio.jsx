import { useNavigate, useParams } from "react-router-dom";
import StepOneDetails from "../StepOneDetails/StepOneDetails";
import StepTwoCurriculum from "../StepTwoCurriculum/StepTwoCurriculum";
import StudioTopBar from "../StudioTopBar/StudioTopBar";
import UploadProgressOverlay from "../../../OwnerCourses/components/ManageCourse/components/UploadProgressOverlay/UploadProgressOverlay";
import styles from "./CourseStudio.module.css";
import { useCreateCourse } from "../../hooks/useCreateCourse";

import { useCourseStudioState } from "../../hooks/useCourseStudioState";
import { useCoursePublisher } from "../../hooks/useCoursePublisher";

const CourseStudio = () => {
  const navigate = useNavigate();
  const { demoId } = useParams();

  const state = useCourseStudioState();

  const { createCourse, isCreating } = useCreateCourse(demoId);

  const { handleNextStep, handlePublish } = useCoursePublisher({
    ...state,
    createCourse,
    navigate,
  });

  return (
    <div className={styles.studioContainer}>
      <UploadProgressOverlay progress={state.uploadProgress} styles={styles} />

      <StudioTopBar
        currentStep={state.currentStep}
        onBack={() => navigate(-1)}
        styles={styles}
      />

      <div className={styles.workspaceCentered}>
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
      </div>
    </div>
  );
};

export default CourseStudio;
