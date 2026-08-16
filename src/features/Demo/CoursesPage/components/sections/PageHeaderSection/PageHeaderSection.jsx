import { IoChevronBack, IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import styles from "./PageHeaderSection.module.css";
import { useTranslation } from "react-i18next";

const PageHeaderSection = ({ searchQuery, onSearchChange }) => {
  const { t } = useTranslation();

  return (
    <div className={styles["header-container"]}>
      <div className={styles["title-area"]}>
        <Link
          to=".."
          relative="path"
          className={styles["back-link"]}
          aria-label={t("back-to-department-home")}
        >
          <IoChevronBack aria-hidden="true" /> {t("department-courses")}
        </Link>
        <h1 className={styles.title}>{t("all-courses")}</h1>
      </div>

      <label className={styles["search-bar"]}>
        <span className={styles.visuallyHidden}>
          {t("search-department-courses")}
        </span>
        <IoSearch className={styles["search-icon"]} aria-hidden="true" />
        <input
          type="search"
          placeholder={t("search-department-courses-placeholder")}
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
    </div>
  );
};

export default PageHeaderSection;
