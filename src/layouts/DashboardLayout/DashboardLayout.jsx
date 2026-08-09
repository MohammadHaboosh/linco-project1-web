import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layouts/SideBar/Sidebar";
import GlobalHeader from "../../components/layouts/Header/global_header/GlobalHeader";
import styles from "../MainLayout/MainLayout.module.css";
import Footer from "../../components/layouts/Footer/Footer";
import { FOOTER_CONFIG } from "../../components/layouts/Footer/footerConfig";

const DashboardLayout = () => {
  return (
    <div className={styles.appContainer}>
      <Sidebar role="global" />
      <div className={`${styles.mainWrapper} custom-scrollbar`}>
        <GlobalHeader />
        <main className={styles.pageContent}>
          <Outlet />
        </main>
        <Footer footerLinks={FOOTER_CONFIG.dashboard} />
      </div>
    </div>
  );
};

export default DashboardLayout;
