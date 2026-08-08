import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  IoGlobeOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoChevronDownOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import MarketplaceCard from "../MarketplaceCard/MarketplaceCard";
import CourseDetailsModal from "../CourseDetailsModal/CourseDetailsModal";
import styles from "./PublicLibraryContent.module.css";
import { useTranslation } from "react-i18next";
import { usePublicCourses } from "../../hooks/usePublicCourses";
import { useTags } from "../../hooks/useTags";
import { useBuyCourse } from "../../hooks/useBuyCourse";

const PublicLibraryContent = () => {
  const { t } = useTranslation();
  const { demoId } = useParams();

  const { courses, isLoading, error } = usePublicCourses(demoId);
  const { tags, isLoadingTags } = useTags();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { initiatePurchase, isBuying, buyError } = useBuyCourse();
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTagSelection = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTagIds.length === 0 ||
      course.tags?.some((courseTag) => selectedTagIds.includes(courseTag.id));

    return matchesSearch && matchesTags;
  });

  const handleEnrollOrBuy = (course) => {
    if (course.price > 0) {
      initiatePurchase(demoId, course.id);
    } else {
      console.log("Free enrollment");
      setSelectedCourse(null);
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
              <IoFilterOutline className={styles.filterIcon} />
              {selectedTagIds.length === 0
                ? t("all-tags")
                : `${selectedTagIds.length} ${t("tags-selected")}`}
              <IoChevronDownOutline />
            </button>
            {isFilterOpen && (
              <div
                className={styles.filterDropdown}
                style={{ minWidth: "200px" }}
              >
                {isLoadingTags ? (
                  <div
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      fontSize: "0.85rem",
                    }}
                  >
                    {t("loading-tags")}
                  </div>
                ) : tags.length > 0 ? (
                  tags.map((tag) => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        className={`${styles.catItem} ${isSelected ? styles.catActive : ""}`}
                        onClick={() => toggleTagSelection(tag.id)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>{tag.name}</span>
                        {isSelected && <IoCheckmarkOutline size={16} />}
                      </button>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      fontSize: "0.85rem",
                    }}
                  >
                    {t("no-tags-found")}
                  </div>
                )}
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
            filteredCourses.map((course) => (
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
              {t("no-courses-found-matching-your-criteria")}
            </p>
          )}
        </div>
      )}

      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          onClose={() => {
            if (!isBuying) setSelectedCourse(null);
          }}
          onEnroll={handleEnrollOrBuy}
          isBuying={isBuying}
          buyError={buyError}
        />
      )}
    </div>
  );
};

export default PublicLibraryContent;
