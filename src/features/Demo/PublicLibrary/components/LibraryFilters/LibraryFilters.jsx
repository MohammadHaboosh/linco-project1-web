import styles from "./LibraryFilters.module.css";
import { useTranslation } from "react-i18next";

const LibraryFilters = ({ activeCategory, setActiveCategory }) => {
  const { t } = useTranslation();
  const categories = [
    "All",
    "Front-End",
    "Back-End",
    "UI/UX",
    "Soft Skills",
    "Data Science",
  ];

  return (
    <div className={styles.filtersCard}>
      <h3 className={styles.filterTitle}>{t("categories")}</h3>
      <div className={styles.categoriesList}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.divider}></div>

      <h3 className={styles.filterTitle}>{t("difficulty")}</h3>
      <div className={styles.radioGroup}>
        {["Any Level", "Beginner", "Intermediate", "Advanced"].map((level) => (
          <label key={level} className={styles.radioLabel}>
            <input
              type="radio"
              name="difficulty"
              defaultChecked={level === "Any Level"}
            />
            <span className={styles.customRadio}></span>
            {level}
          </label>
        ))}
      </div>
    </div>
  );
};

export default LibraryFilters;
