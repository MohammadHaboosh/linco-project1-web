import Sidebar from "../components/layouts/SideBar/Sidebar";
import Header from "../components/layouts/Header/global_header/Header";
import Footer from "../components/layouts/Footer/Footer";
import DemoContentContent from "../features/HomeDemoPage/components/DemoContent/DemoContent";
import styles from "../features/HomeDemoPage/components/DemoContent/DemoContent.module.css";

const DemoPage = () => {
  const currentRole = "trainee";

  return (
    <div className={styles["app-container"]}>
      <Sidebar role={currentRole} />
      <div className={`${styles["main-wrapper"]} custom-scrollbar`}>
        <Header
          role={currentRole}
          companyName="CompanyName"
          roomName="Company Demo"
        />
        <DemoContentContent />

        <Footer role={currentRole} />
      </div>
    </div>
  );
};

export default DemoPage;
