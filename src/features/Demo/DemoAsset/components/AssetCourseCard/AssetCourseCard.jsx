import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  IoDownloadOutline,
  IoCheckmarkCircle,
  IoInformationCircleOutline,
} from "react-icons/io5";
import styles from "./AssetCourseCard.module.css";
import { useTranslation } from "react-i18next";
import { useCreateDepartmentCourse } from "../../hooks/useCreateDepartmentCourse";

const AssetCourseCard = ({ course, accessMethod, assetId }) => {
  const { t } = useTranslation();
  const { demoId, departmentId } = useParams();
  const [isImported, setIsImported] = useState(false);

  const { pullToDepartment, isImporting, importError } =
    useCreateDepartmentCourse();

  const handleImport = async () => {
    try {
      await pullToDepartment(demoId, departmentId, assetId);
      setIsImported(true);
    } catch (error) {
      console.error("Failed to pull course:", error);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={course.imagePath}
          alt={course.title}
          className={styles.coverImage}
        />
        <div className={styles.readyBadge}>{t("ready-to-use")}</div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.sourceInfo}>
          <IoInformationCircleOutline />{" "}
          {accessMethod +
            (accessMethod === "PURCHASED" ? ` from ${course.demo?.name}` : "")}
        </div>

        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.description}>{course.description}</p>

        {importError && (
          <p
            style={{
              color: "#dc2626",
              fontSize: "0.8rem",
              marginBottom: "8px",
            }}
          >
            {importError}
          </p>
        )}

        <div className={styles.actionArea}>
          <button
            className={`${styles.importBtn} ${isImported ? styles.successBtn : ""}`}
            onClick={handleImport}
            disabled={isImported || isImporting}
          >
            {isImporting ? (
              <span>Loading...</span>
            ) : isImported ? (
              <>
                <IoCheckmarkCircle className={styles.btnIcon} />{" "}
                {t("added-to-department")}
              </>
            ) : (
              <>
                <IoDownloadOutline className={styles.btnIcon} />{" "}
                {t("pull-to-department")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetCourseCard;
