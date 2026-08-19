import { Outlet } from "react-router-dom";
import { DemoProvider, useDemo } from "../../hooks/useDemo";
import Sidebar from "../../components/layouts/SideBar/Sidebar";
import Header from "../../components/layouts/Header/global_header/Header";
import SubHeader from "../../components/layouts/Header/sub_header/SubHeader";
import Footer from "../../components/layouts/Footer/Footer";
import AppLayoutSkeleton from "../AppLayoutSkeleton.jsx";
import styles from "./MainLayout.module.css";
import useMinimumLoader from "../../hooks/useMinimumLoader.js";

const LayoutContent = () => {
  const { role, currentRoleView, setRoleView, isLoading, demoData } = useDemo();
  const shouldShowLoader = useMinimumLoader(isLoading, 2000);

  if (shouldShowLoader) {
    return <AppLayoutSkeleton />;
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
        <Footer />
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
