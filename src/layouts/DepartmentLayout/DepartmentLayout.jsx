import { Outlet, useLocation } from "react-router-dom";
import { DemoProvider, useDemo } from "../../hooks/useDemo";
import Sidebar from "../../components/layouts/SideBar/Sidebar";
import Header from "../../components/layouts/Header/global_header/Header";
import SubHeader from "../../components/layouts/Header/sub_header/SubHeader";
import { DEPARTMENT_NAV } from "../../config/layoutConfig";
import { PATHS } from "../../routes/paths";
import styles from "../MainLayout/MainLayout.module.css";
import Footer from "../../components/layouts/Footer/Footer";
import { FOOTER_CONFIG } from "../../components/layouts/Footer/footerConfig";
import AuthSessionBoundary from "../../components/common/AuthSessionBoundary";
import { useTranslation } from "react-i18next";

const LayoutContent = () => {
  const { t } = useTranslation();
  const {
    demoId,
    role,
    currentRoleView,
    setRoleView,
    isLoading,
    loadError,
    retryLoadDemo,
    demoData,
  } = useDemo();
  const location = useLocation();
  const isChatPage = location.pathname.includes("/chats");
  const isCoursePlayerPage = location.pathname.includes("/course-player");
  const isGroupsPage = location.pathname.includes("/groups");

  const demoPath = demoId
    ? PATHS.DEMO.replace(":demoId", encodeURIComponent(demoId))
    : null;

  if (isLoading) {
    return (
      <div className={styles.layoutState} role="status" aria-live="polite">
        <span className={styles.loader} aria-hidden="true" />
        <h1>{t("loading-department")}</h1>
        <p>{t("loading-department-description")}</p>
      </div>
    );
  }

  if (loadError || !demoData) {
    return (
      <div className={styles.layoutState} role="alert">
        <h1>{t("department-load-failed")}</h1>
        <p>{t("department-load-error-message")}</p>
        <button type="button" onClick={retryLoadDemo}>
          {t("try-again")}
        </button>
      </div>
    );
  }

  const navLinks =
    DEPARTMENT_NAV[role]?.navLinks || DEPARTMENT_NAV.member.navLinks;
  const footerLinks = FOOTER_CONFIG[`department_${role.toLowerCase()}`] || [];
  const shouldLockHeight = isChatPage || isGroupsPage || isCoursePlayerPage;

  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div
        className={`${styles.mainWrapper} ${
          shouldLockHeight ? styles.noScrollWrapper : "custom-scrollbar"
        }`}
        style={
          shouldLockHeight
            ? {
                overflow: "hidden",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
              }
            : {}
        }
      >
        <Header
          role={role}
          currentRoleView={currentRoleView}
          onRoleChange={setRoleView}
          demoName={demoData?.name}
          currentDepartment={t("departments")}
          demoPath={demoPath}
        />

        {!isCoursePlayerPage && <SubHeader navLinks={navLinks} />}

        <main
          className={`${styles.pageContent} ${
            isChatPage || isGroupsPage ? styles.chatPageContent : ""
          }`}
          style={
            shouldLockHeight
              ? {
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                }
              : {}
          }
        >
          <Outlet />
        </main>

        {!isCoursePlayerPage && !isChatPage && !isGroupsPage && (
          <Footer footerLinks={footerLinks} />
        )}
      </div>
    </div>
  );
};

const DepartmentLayout = () => {
  return (
    <AuthSessionBoundary>
      <DemoProvider>
        <LayoutContent />
      </DemoProvider>
    </AuthSessionBoundary>
  );
};

export default DepartmentLayout;
