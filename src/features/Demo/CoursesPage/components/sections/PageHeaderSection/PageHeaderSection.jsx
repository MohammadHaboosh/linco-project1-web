import { IoChevronBack, IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import styles from "./PageHeaderSection.module.css";
import { PATHS } from "../../../../../../routes/paths";

const PageHeaderSection = ({ departmentName, title }) => {
  return (
    <div className={styles["header-container"]}>
      <div className={styles["title-area"]}>
        <Link to={PATHS.HOME} className={styles["back-link"]}>
          <IoChevronBack style={{ marginRight: "5px" }} /> {departmentName}
        </Link>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles["search-bar"]}>
        <input type="text" placeholder="Search by name's roadmap" />
        <IoSearch className={styles["search-icon"]} />
      </div>
    </div>
  );
};

export default PageHeaderSection;
