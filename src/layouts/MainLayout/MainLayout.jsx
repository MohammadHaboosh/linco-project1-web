import { Outlet } from "react-router-dom";
import { DemoProvider, useDemo } from "../../hooks/useDemo";
import Sidebar from "../../components/layouts/SideBar/Sidebar";
import Header from "../../components/layouts/Header/global_header/Header";
import SubHeader from "../../components/layouts/Header/sub_header/SubHeader";
import Footer from "../../components/layouts/Footer/Footer";
import styles from "./MainLayout.module.css";

const LayoutContent = () => {
  const { role, currentRoleView, setRoleView, isLoading, demoData } = useDemo();

  if (isLoading) {
    return <div className={styles.loader}>Loading Demo Workspace...</div>;
  }

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

        <SubHeader role={currentRoleView} />

        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const MainLayout = () => {
  return (
    <DemoProvider>
      <LayoutContent />
    </DemoProvider>
  );
};

export default MainLayout;
