import styles from "./LibraryFilters.module.css";
import { useTranslation } from "react-i18next";

const LibraryFilters = ({ activeCategory, setActiveCategory }) => {
  const { t } = useTranslation();
  const categories = [
    { value: "All", label: t("course-category-all") },
    { value: "Front-End", label: t("course-category-front-end") },
    { value: "Back-End", label: t("course-category-back-end") },
    { value: "UI/UX", label: t("course-category-ui-ux") },
    { value: "Soft Skills", label: t("course-category-soft-skills") },
    { value: "Data Science", label: t("course-category-data-science") },
  ];
  const difficultyLevels = [
    { value: "Any Level", label: t("course-difficulty-any") },
    { value: "Beginner", label: t("course-difficulty-beginner") },
    { value: "Intermediate", label: t("course-difficulty-intermediate") },
    { value: "Advanced", label: t("course-difficulty-advanced") },
  ];

  return (
    <div className={styles.filtersCard}>
      <h3 className={styles.filterTitle}>{t("categories")}</h3>
      <div className={styles.categoriesList}>
        {categories.map((category) => (
          <button
            type="button"
            key={category.value}
            className={`${styles.filterBtn} ${activeCategory === category.value ? styles.active : ""}`}
            onClick={() => setActiveCategory(category.value)}
            aria-pressed={activeCategory === category.value}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className={styles.divider}></div>

      <h3 className={styles.filterTitle}>{t("difficulty")}</h3>
      <div className={styles.radioGroup}>
        {difficultyLevels.map((level) => (
          <label key={level.value} className={styles.radioLabel}>
            <input
              type="radio"
              name="difficulty"
              value={level.value}
              defaultChecked={level.value === "Any Level"}
            />
            <span className={styles.customRadio} aria-hidden="true"></span>
            {level.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default LibraryFilters;
