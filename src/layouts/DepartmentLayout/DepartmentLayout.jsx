import { Outlet, useLocation } from "react-router-dom";
import { useDemo } from "../../hooks/useDemo";
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
import ExpiredSubscriptionGate from "../../features/Demo/Subscription/components/ExpiredSubscriptionGate/ExpiredSubscriptionGate";
import { isDemoSubscriptionExpired } from "../../features/Demo/Subscription/utils/demoSubscription";
import AppLayoutSkeleton from "../AppLayoutSkeleton.jsx";

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
  const demoPath = demoId
    ? PATHS.DEMO.replace(":demoId", encodeURIComponent(demoId))
    : null;

  if (isLoading) {
    return <AppLayoutSkeleton />;
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

  if (isDemoSubscriptionExpired(demoData)) {
    return <ExpiredSubscriptionGate demoId={demoId} demoData={demoData} />;
  }

  const navLinks =
    DEPARTMENT_NAV[role]?.navLinks || DEPARTMENT_NAV.member.navLinks;
  const footerLinks = FOOTER_CONFIG[`department_${role.toLowerCase()}`] || [];

  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div className={`${styles.mainWrapper} custom-scrollbar`}>
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
            isChatPage ? styles.chatPageContent : ""
          }`}
        >
          <Outlet />
        </main>
        {!isCoursePlayerPage && !isChatPage && (
          <Footer footerLinks={footerLinks} />
        )}
      </div>
    </div>
  );
};

const DepartmentLayout = () => {
  return (
    <AuthSessionBoundary>
      <LayoutContent />
    </AuthSessionBoundary>
  );
};

export default DepartmentLayout;
