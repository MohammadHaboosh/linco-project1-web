import { useState } from "react";
import { useParams } from "react-router-dom";
import { IoFolderOpenOutline, IoSearchOutline } from "react-icons/io5";
import AssetCourseCard from "../AssetCourseCard/AssetCourseCard";
import styles from "./DemoAssetContent.module.css";
import { useTranslation } from "react-i18next";
import { useDemoAssets } from "../../hooks/useDemoAssets";

const DemoAssetContent = () => {
  const { t } = useTranslation();
  const { demoId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const { assets, isLoading, error } = useDemoAssets(demoId);

  const filteredAssets = assets.filter((asset) => {
    const course = asset.course;
    if (!course || !course.isPublished) return false;

    if (searchQuery.trim() === "") return true;

    return course.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoFolderOpenOutline className={styles.headerIcon} />
          </div>
          <div>
            <span className={styles.subHeading}>
              {t("internal-repository")}
            </span>
            <h1 className={styles.title}>{t("company-assets")}</h1>
            <p className={styles.description}>
              {t(
                "browse-all-courses-owned-by-your-company-and-import-them-into-your-department",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <IoSearchOutline className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t("search-company-assets")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {isLoading ? (
        <p style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>
          {t("loading-assets")}
        </p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "#dc2626", padding: "40px" }}>
          {error}
        </p>
      ) : filteredAssets.length > 0 ? (
        <div className={styles.coursesGrid}>
          {filteredAssets.map((asset) => (
            <AssetCourseCard
              key={asset.id}
              course={asset.course}
              accessMethod={asset.accessMethod}
              assetId={asset.id}
            />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>
          {t("no-published-assets-found")}
        </p>
      )}
    </div>
  );
};

export default DemoAssetContent;
