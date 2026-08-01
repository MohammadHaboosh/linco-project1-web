import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  IoGlobeOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoChevronDownOutline,
} from "react-icons/io5";
import MarketplaceCard from "../MarketplaceCard/MarketplaceCard";
import CourseDetailsModal from "../CourseDetailsModal/CourseDetailsModal";
import styles from "./PublicLibraryContent.module.css";
import { useTranslation } from "react-i18next";
import { usePublicCourses } from "../../hooks/usePublicCourses"; // استيراد الـ Hook

const PublicLibraryContent = () => {
  const { t } = useTranslation();
  const { demoId } = useParams();
  const { courses, isLoading, error, refetch } = usePublicCourses(demoId);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    "All",
    "Front-End",
    "Back-End",
    "UI/UX",
    "JavaScript",
    "SQL",
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleEnrollOrBuy = (course) => {
    if (course.price === 0) {
      alert(`Successfully enrolled in "${course.title}" for free!`);
      setSelectedCourse(null);
    } else {
      alert(
        `Redirecting to payment gateway for "${course.title}" ($${course.price})`,
      );
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoGlobeOutline className={styles.headerIcon} />
          </div>
          <div>
            <span className={styles.subHeading}>{t("global-marketplace")}</span>
            <h1 className={styles.title}>{t("ublic-course-library")}</h1>
            <p className={styles.description}>
              {t(
                "explore-public-courses-published-by-developer-teams-and-start-learning",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.controlsWrapper}>
        <div className={styles.controlsInner}>
          <div className={styles.searchBox}>
            <IoSearchOutline className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t("search-courses")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.divider}></div>

          <div className={styles.filterBox} ref={filterRef}>
            <button
              className={styles.filterBtn}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <IoFilterOutline className={styles.filterIcon} /> {activeCategory}{" "}
              <IoChevronDownOutline />
            </button>
            {isFilterOpen && (
              <div className={styles.filterDropdown}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`${styles.catItem} ${activeCategory === cat ? styles.catActive : ""}`}
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsFilterOpen(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <p style={{ textAlign: "center", padding: "40px" }}>
          {t("loading-courses")}
        </p>
      )}
      {error && (
        <p style={{ textAlign: "center", padding: "40px", color: "red" }}>
          {error}
        </p>
      )}

      {!isLoading && !error && (
        <div className={styles.coursesGrid}>
          {filteredCourses.length > 0 ? (
            courses.map((course) => (
              <MarketplaceCard
                key={course.id}
                course={course}
                onViewDetails={() => setSelectedCourse(course)}
              />
            ))
          ) : (
            <p
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              {t("no-courses-found-0")}
            </p>
          )}
        </div>
      )}

      <CourseDetailsModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnroll={handleEnrollOrBuy}
      />
    </div>
  );
};

export default PublicLibraryContent;
