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
  const sourceText =
    accessMethod === "PURCHASED"
      ? t("asset-source-purchased", {
          workspaceName: course.demo?.name || t("unknown-workspace"),
        })
      : t("asset-source-owned");

  const handleImport = async () => {
    try {
      await pullToDepartment(demoId, departmentId, assetId);
      setIsImported(true);
    } catch (error) {
      console.error("Failed to pull course:", error);
    }
  };

  return (
    <article className={styles.card} aria-busy={isImporting}>
      <div className={styles.imageWrapper}>
        <img
          src={course.imagePath}
          alt={t("course-cover-alt", { title: course.title })}
          className={styles.coverImage}
        />
        <div className={styles.readyBadge}>{t("ready-to-use")}</div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.sourceInfo}>
          <IoInformationCircleOutline aria-hidden="true" />
          {sourceText}
        </div>

        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.description}>{course.description}</p>

        {importError && (
          <p className={styles.importError} role="alert">
            {t("course-import-failed")}
          </p>
        )}

        <div className={styles.actionArea}>
          <button
            type="button"
            className={`${styles.importBtn} ${isImported ? styles.successBtn : ""}`}
            onClick={handleImport}
            disabled={isImported || isImporting}
            aria-live="polite"
            aria-label={t(
              isImported
                ? "course-added-to-department-label"
                : isImporting
                  ? "importing-named-course"
                  : "add-named-course-to-department",
              { title: course.title },
            )}
          >
            {isImporting ? (
              <span>{t("importing-course")}</span>
            ) : isImported ? (
              <>
                <IoCheckmarkCircle
                  className={styles.btnIcon}
                  aria-hidden="true"
                />{" "}
                {t("added-to-department")}
              </>
            ) : (
              <>
                <IoDownloadOutline
                  className={styles.btnIcon}
                  aria-hidden="true"
                />{" "}
                {t("pull-to-department")}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default AssetCourseCard;
