import { IoPlayCircleOutline } from "react-icons/io5";
import styles from "./CourseCard.module.css";
import placeholderImg from "../../../assets/images/linco-logo.jpg"; // صورة مؤقتة

const CourseCard = ({ course }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={placeholderImg} alt={course.title} className={styles.image} />
        <IoPlayCircleOutline className={styles.playIcon} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.description}>{course.description}</p>
        <div className={styles.actionRow}>
          <button className={styles.btn}>Continue Learning</button>
        </div>
        <div className={styles.progressContainer}>
          <span className={styles.progressText}>Progress</span>
          <span className={styles.progressPercentage}>{course.progress}%</span>
        </div>
        <div className={styles.progressBarBg}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
