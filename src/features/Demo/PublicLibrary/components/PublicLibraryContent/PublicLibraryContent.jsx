import { useState } from "react";
import {
  IoLibraryOutline,
  IoAddCircleOutline,
  IoSearchOutline,
} from "react-icons/io5";
import LibraryCourseCard from "../MarketplaceCard/MarketplaceCard";
import LibraryFilters from "../LibraryFilters/LibraryFilters";
import styles from "./PublicLibraryContent.module.css";
import { useDemo } from "../../../../../hooks/useDemo";
import { useTranslation } from "react-i18next";

const MOCK_LIBRARY = [
  {
    id: 101,
    title: "Advanced React & Next.js Architecture",
    company: "Google Workspace",
    description:
      "Master complex UI building, Server-Side Rendering (SSR), and scalable Front-End architecture.",
    price: 49.99,
    isMyDemo: false,
    isPrivate: false,
    rating: 4.9,
    students: 1240,
    tags: ["React", "Architecture", "Web"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 102,
    title: "Company Onboarding 2026",
    company: "LinCo.TechCorp",
    description:
      "Internal onboarding procedures, HR guidelines, and company culture essentials.",
    price: 0,
    isMyDemo: true,
    isPrivate: true,
    rating: 4.5,
    students: 85,
    tags: ["HR", "Onboarding", "Internal"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 103,
    title: "Figma UI/UX Masterclass",
    company: "Design Academy",
    description:
      "Create professional, reusable design systems and components from scratch.",
    price: 0,
    isMyDemo: false,
    isPrivate: false,
    rating: 4.8,
    students: 3450,
    tags: ["Figma", "UI/UX", "Design"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 104,
    title: "Node.js Microservices",
    company: "LinCo.TechCorp",
    description:
      "Learn to build scalable backend systems using Node, Docker and Kubernetes.",
    price: 89.99,
    isMyDemo: true,
    isPrivate: false,
    rating: 5.0,
    students: 432,
    tags: ["Node.js", "Backend", "Docker"],
    image: "/images/linco-logo.jpg",
  },
];

const PublicLibraryContent = () => {
  const { t } = useTranslation();
  const //{
    currentRoleView = "owner";
  //} = useDemo();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCourses = MOCK_LIBRARY.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoLibraryOutline className={styles.headerIcon} />
          </div>
          <div>
            <span className={styles.subHeading}>
              {t("content-marketplace")}
            </span>
            <h1 className={styles.title}>{t("ublic-course-library")}</h1>
            <p className={styles.description}>
              {t(
                "discover-import-and-manage-premium-training-content-for-your-departments",
              )}
            </p>
          </div>
        </div>

        {currentRoleView === "owner" && (
          <button className={styles.createBtn}>
            <IoAddCircleOutline className={styles.btnIcon} />{" "}
            {t("publish-new-course")}
          </button>
        )}
      </div>

      <div className={styles.layoutGrid}>
        <div className={styles.sidebarColumn}>
          <div className={styles.searchBox}>
            <IoSearchOutline className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t("search-library")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <LibraryFilters
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>

        <div className={styles.mainColumn}>
          <div className={styles.resultsHeader}>
            <span>
              {t("showing")} <strong>{filteredCourses.length}</strong>{" "}
              {t("courses")}
            </span>
          </div>

          <div className={styles.coursesGrid}>
            {filteredCourses.map((course) => (
              <LibraryCourseCard
                key={course.id}
                course={course}
                role={currentRoleView}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className={styles.emptyState}>
              <h3>{t("no-courses-found")}</h3>
              <p>
                {t(
                  "try-adjusting-your-search-or-filters-to-find-what-youre-looking-for",
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicLibraryContent;
