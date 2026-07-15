import { useNavigate, useParams } from "react-router-dom";
import { IoReloadOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import CourseManagementCard from "../CourseManagementCard/CourseManagementCard";
import { useOwnerCourses } from "../../hooks/useOwnerCourses";
import styles from "./OwnerCoursesContent.module.css";

const OwnerCoursesContent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { demoId } = useParams();

  const { courses, isLoading, error, refetch } = useOwnerCourses(demoId);

  const handleAddNew = () => {
    navigate(`/demos/${demoId}/course-studio`);
  };

  const handleEdit = (courseId) => {
    console.log("Editing course:", courseId);
    // navigate(`/demos/${demoId}/course-studio/${courseId}`);
  };

  const handlePublish = (courseId) => {
    console.log("Publishing course:", courseId);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <div>
          <h1 className={styles.title}>{t("demo-courses")}</h1>
          <p className={styles.description}>
            {t(
              "manage-your-created-courses-edit-curriculum-and-publish-them-to-the-public-library",
            )}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>
          <h2>{t("loading-your-courses")}</h2>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#ef4444" }}>
          <p>{error}</p>
          <button
            onClick={refetch}
            style={{
              padding: "10px 20px",
              marginTop: "15px",
              cursor: "pointer",
            }}
          >
            <IoReloadOutline /> {t("try-again")}
          </button>
        </div>
      ) : (
        <div className={styles.gridContainer}>
          <CourseManagementCard isAddNew={true} onAddNew={handleAddNew} />

          {courses.map((course) => (
            <CourseManagementCard
              key={course.id}
              isAddNew={false}
              course={course}
              onEdit={handleEdit}
              onPublish={handlePublish}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerCoursesContent;
