import { useState } from "react";
import { useParams } from "react-router-dom";
import { IoFolderOpenOutline, IoSearchOutline } from "react-icons/io5";
import AssetCourseCard from "../AssetCourseCard/AssetCourseCard";
import AssetCourseCardSkeleton from "../AssetCourseCard/AssetCourseCardSkeleton";
import styles from "./DemoAssetContent.module.css";
import { useTranslation } from "react-i18next";
import { useDemoAssets } from "../../hooks/useDemoAssets";

const DemoAssetContent = () => {
  const { t, i18n } = useTranslation();
  const { demoId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const locale = i18n.resolvedLanguage || i18n.language || "en";

  const { assets, isLoading, error, retry } = useDemoAssets(demoId);

  const filteredAssets = assets.filter((asset) => {
    const course = asset.course;
    if (!course || !course.isPublished) return false;

    if (searchQuery.trim() === "") return true;

    return course.title
      ?.toLocaleLowerCase(locale)
      .includes(searchQuery.trim().toLocaleLowerCase(locale));
  });

  return (
    <div className={styles.pageContainer} dir={i18n.dir()}>
      <div className={styles.headerArea}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoFolderOpenOutline
              className={styles.headerIcon}
              aria-hidden="true"
            />
          </div>
          <div>
            <span className={styles.subHeading}>{t("workspace-content")}</span>
            <h1 className={styles.title}>{t("workspace-library")}</h1>
            <p className={styles.description}>
              {t("workspace-library-description")}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.controlsBar}>
        <label className={styles.searchBox}>
          <span className={styles.visuallyHidden}>
            {t("search-workspace-library")}
          </span>
          <IoSearchOutline className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            placeholder={t("search-workspace-library-placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </label>
      </div>

      {/* 💡 2. عرض شبكة الهياكل العظمية أثناء التحميل */}
      {isLoading ? (
        <div className={styles.coursesGrid}>
          {Array(8)
            .fill(0)
            .map((_, idx) => (
              <AssetCourseCardSkeleton key={`asset-skeleton-${idx}`} />
            ))}
        </div>
      ) : error ? (
        <div
          className={`${styles.statePanel} ${styles.errorState}`}
          role="alert"
        >
          <strong>{t("assets-load-failed")}</strong>
          <span>{error}</span>
          <button type="button" onClick={retry}>
            {t("try-again")}
          </button>
        </div>
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
        <div className={styles.statePanel}>
          <strong>
            {searchQuery.trim()
              ? t("no-assets-match-search")
              : t("no-published-assets-found")}
          </strong>
          <span>
            {searchQuery.trim()
              ? t("adjust-asset-search")
              : t("workspace-library-empty-description")}
          </span>
          {searchQuery.trim() && (
            <button type="button" onClick={() => setSearchQuery("")}>
              {t("clear-search")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DemoAssetContent;
