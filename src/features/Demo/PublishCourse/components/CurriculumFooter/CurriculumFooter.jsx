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
      <button className={styles.backStepBtn} type="button" onClick={onBack}>
        <IoArrowBackOutline aria-hidden="true" /> <span>{t("back")}</span>
      </button>
      <button
        className={styles.finalPublishBtn}
        type="button"
        onClick={onPublish}
        disabled={!canPublish || isPublishing}
      >
        {isPublishing ? (
          t("saving")
        ) : (
          <>
            <IoCheckmarkCircleOutline aria-hidden="true" />
            <span>{t("create-course")}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default CurriculumFooter;
