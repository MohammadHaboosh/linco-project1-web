import { Outlet, useLocation } from "react-router-dom";
import { DemoProvider, useDemo } from "../../hooks/useDemo";
import Sidebar from "../../components/layouts/SideBar/Sidebar";
import Header from "../../components/layouts/Header/global_header/Header";
import SubHeader from "../../components/layouts/Header/sub_header/SubHeader";
import { DEPARTMENT_NAV } from "../../config/layoutConfig";
import { PATHS } from "../../routes/paths";
import styles from "../MainLayout/MainLayout.module.css";
import Footer from "../../components/layouts/Footer/Footer";

const LayoutContent = () => {
  const { demoId, role, currentRoleView, setRoleView, isLoading, demoData } =
    useDemo();
  const location = useLocation();
  const isChatPage = location.pathname.includes("/chats");
  const demoPath = demoId
    ? PATHS.DEMO.replace(":demoId", encodeURIComponent(demoId))
    : null;

  if (isLoading)
    return <div className={styles.loader}>Loading Department...</div>;

  const navLinks =
    DEPARTMENT_NAV[currentRoleView]?.navLinks ||
    DEPARTMENT_NAV.trainee.navLinks;
  console.log("department navLinks :", navLinks);

  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div className={`${styles.mainWrapper} custom-scrollbar`}>
        <Header
          role={role}
          currentRoleView={currentRoleView}
          onRoleChange={setRoleView}
          demoName={demoData?.name}
          currentDepartment="Current Dept Name"
          demoPath={demoPath}
        />

        <SubHeader navLinks={navLinks} />

        <main
          className={`${styles.pageContent} ${
            isChatPage ? styles.chatPageContent : ""
          }`}
        >
          <Outlet />
        </main>
        {!isChatPage && <Footer />}
      </div>
    </div>
  );
};

const DepartmentLayout = () => {
  return (
    <DemoProvider>
      <LayoutContent />
    </DemoProvider>
  );
};

export default DepartmentLayout;
