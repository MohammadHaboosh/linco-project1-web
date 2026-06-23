import { IoSearch } from "react-icons/io5";
import styles from "./DemoHeaderSection.module.css";

const DemoHeaderSection = ({ title, subtitle }) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleArea}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.searchBar}>
        <input type="text" placeholder="Search departments..." />
        <IoSearch className={styles.searchIcon} />
      </div>
    </div>
  );
};

export default DemoHeaderSection;
