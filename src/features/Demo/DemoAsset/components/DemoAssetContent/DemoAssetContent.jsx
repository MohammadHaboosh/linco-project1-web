import { useState } from "react";
import { IoFolderOpenOutline, IoSearchOutline } from "react-icons/io5";
import AssetCourseCard from "../AssetCourseCard/AssetCourseCard";
import styles from "./DemoAssetContent.module.css";
import { useTranslation } from "react-i18next";

const DEMO_ASSETS = [
  {
    id: 201,
    title: "Company Onboarding 2026",
    source: "Internal Creation",
    description: "Internal onboarding procedures and HR guidelines.",
    tags: ["HR", "Onboarding"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 202,
    title: "Figma UI/UX Design System",
    source: "Purchased from Design Academy",
    description: "Create professional, reusable design systems.",
    tags: ["Figma", "Design"],
    image: "/images/linco-logo.jpg",
  },
];

const DemoAssetContent = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

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

      <div className={styles.coursesGrid}>
        {DEMO_ASSETS.map((course) => (
          <AssetCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default DemoAssetContent;
