import GeneralInfoTab from "../../../OwnerCourses/components/ManageCourse/components/tabs/GeneralInfoTab/GeneralInfoTab";
import styles from "./StepOneDetails.module.css";
import { IoArrowForwardOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const StepOneDetails = ({
  courseData,
  updateCourseData,
  onNext,
  isCreating,
}) => {
  const handleDataChange = (fieldOrObject, value) => {
    updateCourseData(fieldOrObject, value);
  };
  const { t } = useTranslation();

  return (
    <div className={styles.stepOneWrapper}>
      <GeneralInfoTab
        data={courseData}
        onChange={handleDataChange}
        showPaidTrialNote
      />

      <div className={styles.actionFooter}>
        <button
          className={styles.nextStepBtn}
          type="button"
          onClick={onNext}
          disabled={isCreating}
        >
          {isCreating ? (
            t("creating-course")
          ) : (
            <>
              <span>{t("proceed-to-curriculum")}</span>
              <IoArrowForwardOutline aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StepOneDetails;
