import { Outlet } from "react-router-dom";
import { DemoProvider, useDemo } from "../../hooks/useDemo";
import Sidebar from "../../components/layouts/SideBar/Sidebar";
import Header from "../../components/layouts/Header/global_header/Header";
import SubHeader from "../../components/layouts/Header/sub_header/SubHeader";
import { DEMO_NAV } from "../../config/layoutConfig";
import styles from "../MainLayout/MainLayout.module.css";
import Footer from "../../components/layouts/Footer/Footer";
import { FOOTER_CONFIG } from "../../components/layouts/Footer/footerConfig";

const LayoutContent = () => {
  const { role, currentRoleView, setRoleView, isLoading, demoData } = useDemo();

  if (isLoading)
    return <div className={styles.loader}>Loading Workspace...</div>;

  const navLinks = DEMO_NAV[role.toLowerCase()]?.navLinks || [];
  // const footerLinks = FOOTER_CONFIG[`demo_${role.toLowerCase()}`] || [];

  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div className={`${styles.mainWrapper} custom-scrollbar`}>
        <Header
          role={role}
          currentRoleView={currentRoleView}
          onRoleChange={setRoleView}
          demoName={demoData?.name}
        />

        <SubHeader navLinks={navLinks} />

        <main className={styles.pageContent}>
          <Outlet />
        </main>
        <Footer location="demo" />
      </div>
    </div>
  );
};

const DemoLayout = () => {
  return (
    <DemoProvider>
      <LayoutContent />
    </DemoProvider>
  );
};

export default DemoLayout;
