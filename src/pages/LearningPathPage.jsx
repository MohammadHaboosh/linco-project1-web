import Sidebar from "../components/layouts/SideBar/Sidebar";
import Header from "../components/layouts/Header/global_header/Header";
import SubHeader from "../components/layouts/Header/sub_header/SubHeader";
import Footer from "../components/layouts/Footer/Footer";
import LearningPathContent from "../features/Demo/LearningPathPage/components/LearningPathContent";
import styles from "../features/Demo/LearningPathPage/components/LearningPathContent.module.css";

const LearningPathPage = () => {
  const currentRole = "trainee";

  return (
    <div className={styles["app-container"]}>
      <Sidebar role={currentRole} />

      <div className={`${styles["main-wrapper"]} custom-scrollbar`}>
        <Header
          role={currentRole}
          companyName="TechCorp"
          roomName="Front-End Dept"
          showDeptSwitcher={true}
        />
        <SubHeader role={currentRole} />

        <LearningPathContent />

        <Footer role={currentRole} />
      </div>
    </div>
  );
};

export default LearningPathPage;
