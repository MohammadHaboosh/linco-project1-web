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
  const { t, i18n } = useTranslation();
  const { demoId } = useParams();

  const { courses, isLoading, error, refetch } = usePublicCourses(demoId);
  const { tags, isLoadingTags, tagsError, refetchTags } = useTags();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { initiatePurchase, isBuying, buyError } = useBuyCourse();
  const filterRef = useRef(null);
  const locale = i18n.resolvedLanguage || i18n.language || "en";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setIsFilterOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
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
    void initiatePurchase(demoId, course.id);
  };

  const formattedSelectedTagCount = new Intl.NumberFormat(locale).format(
    selectedTagIds.length,
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoGlobeOutline className={styles.headerIcon} />
          </div>
          <div>
            <span className={styles.subHeading}>{t("global-marketplace")}</span>
            <h1 className={styles.title}>{t("public-course-library")}</h1>
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
              type="search"
              placeholder={t("search-courses")}
              aria-label={t("search-public-courses")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.divider}></div>

          <div className={styles.filterBox} ref={filterRef}>
            <button
              type="button"
              className={styles.filterBtn}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-expanded={isFilterOpen}
              aria-controls="course-tag-filter-menu"
            >
              <IoFilterOutline className={styles.filterIcon} />
              {selectedTagIds.length === 0
                ? t("all-tags")
                : t("selected-tag-count", {
                    count: selectedTagIds.length,
                    formattedCount: formattedSelectedTagCount,
                  })}
              <IoChevronDownOutline />
            </button>
            {isFilterOpen && (
              <div
                id="course-tag-filter-menu"
                className={styles.filterDropdown}
                aria-label={t("filter-courses-by-tag")}
              >
                {isLoadingTags ? (
                  <div className={styles.filterState} role="status">
                    {t("loading-tags")}
                  </div>
                ) : tagsError ? (
                  <div className={styles.filterState} role="alert">
                    <span>{tagsError}</span>
                    <button type="button" onClick={refetchTags}>
                      {t("try-again")}
                    </button>
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
                        aria-pressed={isSelected}
                      >
                        <span>{tag.name}</span>
                        {isSelected && <IoCheckmarkOutline size={16} />}
                      </button>
                    );
                  })
                ) : (
                  <div className={styles.filterState} role="status">
                    {t("no-tags-found")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className={styles.pageState} role="status" aria-live="polite">
          <span className={styles.loader} aria-hidden="true" />
          <strong>{t("loading-public-courses")}</strong>
          <p>{t("loading-public-courses-description")}</p>
        </div>
      )}
      {error && !isLoading && (
        <div className={styles.pageState} role="alert">
          <strong>{t("public-courses-load-error-title")}</strong>
          <p>{error}</p>
          <button type="button" onClick={refetch}>
            {t("try-again")}
          </button>
        </div>
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
            <div className={styles.emptyState} role="status">
              <strong>
                {courses.length === 0
                  ? t("public-library-empty-title")
                  : t("public-library-no-results-title")}
              </strong>
              <p>
                {courses.length === 0
                  ? t("public-library-empty-description")
                  : t("no-courses-found-matching-your-criteria")}
              </p>
            </div>
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
