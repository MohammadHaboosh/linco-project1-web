import { Outlet, useLocation } from "react-router-dom";
import { DemoProvider, useDemo } from "../../hooks/useDemo";
import Sidebar from "../../components/layouts/SideBar/Sidebar";
import Header from "../../components/layouts/Header/global_header/Header";
import SubHeader from "../../components/layouts/Header/sub_header/SubHeader";
import { DEMO_NAV } from "../../config/layoutConfig";
import styles from "../MainLayout/MainLayout.module.css";
import Footer from "../../components/layouts/Footer/Footer";

const LayoutContent = () => {
  const { role, currentRoleView, setRoleView, isLoading, demoData } = useDemo();
  const location = useLocation();
  const isChatPage = location.pathname.includes("/chats");

  if (isLoading)
    return <div className={styles.loader}>Loading Workspace...</div>;
  console.log(
    " [DemoLayout] 1. currentRoleView from Context:",
    currentRoleView,
  );

  const safeRole = (currentRoleView || "trainee").toLowerCase();
  console.log(" [DemoLayout] 2. safeRole (after lowercase):", safeRole);

  const roleConfig = DEMO_NAV[safeRole] || DEMO_NAV.trainee;
  console.log(" [DemoLayout] 3. roleConfig Object found:", roleConfig);

  const navLinks = roleConfig?.navLinks || [];
  console.log(" [DemoLayout] 4. Final navLinks Array:", navLinks);

  // const navLinks =
  //   DEMO_NAV[currentRoleView]?.navLinks || DEMO_NAV.trainee.navLinks;
  // console.log("demo navLinks :", navLinks);

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
        {!isChatPage && <Footer />}
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
