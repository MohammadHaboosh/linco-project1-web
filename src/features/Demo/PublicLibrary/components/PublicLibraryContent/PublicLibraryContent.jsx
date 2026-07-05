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
    title: "Advanced React Patterns & Architecture",
    description:
      "Master complex UI building, custom hooks, and scalable FSD architecture.",
    author: "LinCo Originals",
    category: "Front-End",
    difficulty: "Advanced",
    imports: 342,
    rating: 4.9,
    tags: ["React", "Architecture"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 102,
    title: "Node.js Microservices Masterclass",
    description:
      "Learn how to break down monoliths into scalable microservices using Docker.",
    author: "Ahmad Y.",
    category: "Back-End",
    difficulty: "Intermediate",
    imports: 128,
    rating: 4.7,
    tags: ["Node.js", "Docker"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 103,
    title: "Figma UI/UX Design System",
    description:
      "Create professional, reusable design systems and components from scratch.",
    author: "Design Academy",
    category: "UI/UX",
    difficulty: "Beginner",
    imports: 512,
    rating: 4.8,
    tags: ["Figma", "Design"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 101,
    title: "Advanced React Patterns & Architecture",
    description:
      "Master complex UI building, custom hooks, and scalable FSD architecture.",
    author: "LinCo Originals",
    category: "Front-End",
    difficulty: "Advanced",
    imports: 342,
    rating: 4.9,
    tags: ["React", "Architecture"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 102,
    title: "Node.js Microservices Masterclass",
    description:
      "Learn how to break down monoliths into scalable microservices using Docker.",
    author: "Ahmad Y.",
    category: "Back-End",
    difficulty: "Intermediate",
    imports: 128,
    rating: 4.7,
    tags: ["Node.js", "Docker"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 103,
    title: "Figma UI/UX Design System",
    description:
      "Create professional, reusable design systems and components from scratch.",
    author: "Design Academy",
    category: "UI/UX",
    difficulty: "Beginner",
    imports: 512,
    rating: 4.8,
    tags: ["Figma", "Design"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 101,
    title: "Advanced React Patterns & Architecture",
    description:
      "Master complex UI building, custom hooks, and scalable FSD architecture.",
    author: "LinCo Originals",
    category: "Front-End",
    difficulty: "Advanced",
    imports: 342,
    rating: 4.9,
    tags: ["React", "Architecture"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 102,
    title: "Node.js Microservices Masterclass",
    description:
      "Learn how to break down monoliths into scalable microservices using Docker.",
    author: "Ahmad Y.",
    category: "Back-End",
    difficulty: "Intermediate",
    imports: 128,
    rating: 4.7,
    tags: ["Node.js", "Docker"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 103,
    title: "Figma UI/UX Design System",
    description:
      "Create professional, reusable design systems and components from scratch.",
    author: "Design Academy",
    category: "UI/UX",
    difficulty: "Beginner",
    imports: 512,
    rating: 4.8,
    tags: ["Figma", "Design"],
    image: "/images/linco-logo.jpg",
  },
];

const PublicLibraryContent = () => {
  const { t } = useTranslation();
  const { currentRoleView } = useDemo();
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
