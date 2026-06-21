import Sidebar from "../components/layouts/SideBar/Sidebar";
import Header from "../components/layouts/Header/global_header/Header";
import SubHeader from "../components/layouts/Header/sub_header/SubHeader";
import Footer from "../components/layouts/Footer/Footer";
import CoursesContent from "../features/Demo/CoursesPage/components/CoursesContent/CoursesContent";
import styles from "../features/Demo/CoursesPage/components/CoursesContent/CoursesContent.module.css";

const CoursesPage = () => {
  const currentRole = "trainee";

  return (
    <div className={styles["app-container"]}>
      <Sidebar role={currentRole} />

      <div className={`${styles["main-wrapper"]} custom-scrollbar`}>
        {/* الهيدر العلوي الخاص بمساحة العمل */}
        <Header
          role={currentRole}
          companyName="CompanyName"
          roomName="Company Demo"
        />

        {/* الهيدر الفرعي الذي يحوي روابط (Courses, Road Map, إلخ) */}
        <SubHeader role={currentRole} />

        {/* محتوى الصفحة الذي برمجناه */}
        <CoursesContent />

        <Footer role={currentRole} />
      </div>
    </div>
  );
};

export default CoursesPage;
