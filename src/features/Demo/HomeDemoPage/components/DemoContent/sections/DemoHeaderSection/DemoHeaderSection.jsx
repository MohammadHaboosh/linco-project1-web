import { IoSearch } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./DemoHeaderSection.module.css";

const DemoHeaderSection = ({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleArea}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.searchBar}>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("search-departments-placeholder")}
          aria-label={t("search-departments")}
        />
        <IoSearch className={styles.searchIcon} aria-hidden="true" />
      </div>
    </div>
  );
};

export default DemoHeaderSection;
