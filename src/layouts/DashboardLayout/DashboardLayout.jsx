import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layouts/SideBar/Sidebar";
import GlobalHeader from "../../components/layouts/Header/global_header/GlobalHeader";
import styles from "../MainLayout/MainLayout.module.css"; // يمكننا استخدام نفس تنسيقات التقسيم
import Footer from "../../components/layouts/Footer/Footer";

const DashboardLayout = () => {
  return (
    <div className={styles.appContainer}>
      <Sidebar role="global" />
      <div className={`${styles.mainWrapper} custom-scrollbar`}>
        <GlobalHeader />
        <main className={styles.pageContent}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
