import React from "react";
import GeneralInfoTab from "../../../OwnerCourses/components/ManageCourse/components/tabs/GeneralInfoTab/GeneralInfoTab";
import styles from "./StepOneDetails.module.css";
import { IoArrowForwardOutline } from "react-icons/io5";

const StepOneDetails = ({
  courseData,
  updateCourseData,
  onNext,
  isCreating,
}) => {
  const handleDataChange = (fieldOrObject, value) => {
    updateCourseData(fieldOrObject, value);
  };

  return (
    <div className={styles.stepOneWrapper}>
      <GeneralInfoTab data={courseData} onChange={handleDataChange} />

      <div className={styles.actionFooter}>
        <button
          className={styles.nextStepBtn}
          type="button"
          onClick={onNext}
          disabled={isCreating}
        >
          {isCreating ? (
            "Creating Course..."
          ) : (
            <>
              Proceed to Curriculum <IoArrowForwardOutline />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StepOneDetails;
