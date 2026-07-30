import React from "react";
import { IoArrowBackOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

const CurriculumFooter = ({
  onBack,
  onPublish,
  canPublish,
  isPublishing,
  styles,
  t,
}) => {
  return (
    <div className={styles.publishActionArea}>
      <button className={styles.backStepBtn} onClick={onBack}>
        <IoArrowBackOutline style={{ marginRight: "6px" }} /> {t("back")}
      </button>
      <button
        className={styles.finalPublishBtn}
        onClick={onPublish}
        disabled={!canPublish || isPublishing}
      >
        {isPublishing ? (
          "Publishing..."
        ) : (
          <>
            <IoCheckmarkCircleOutline /> {t("publish-course")}
          </>
        )}
      </button>
    </div>
  );
};

export default CurriculumFooter;
