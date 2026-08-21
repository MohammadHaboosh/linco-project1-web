import { Outlet, useLocation } from "react-router-dom";
import { useDemo } from "../../hooks/useDemo";
import Sidebar from "../../components/layouts/SideBar/Sidebar";
import Header from "../../components/layouts/Header/global_header/Header";
import SubHeader from "../../components/layouts/Header/sub_header/SubHeader";
import { DEMO_NAV } from "../../config/layoutConfig";
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
    role,
    currentRoleView,
    setRoleView,
    isLoading,
    loadError,
    retryLoadDemo,
    demoData,
  } = useDemo();

  const location = useLocation();
  const isGroupsPage = location.pathname.includes("/groups");

  if (isLoading) {
    return <AppLayoutSkeleton />;
  }

  if (loadError || !demoData) {
    return (
      <div className={styles.layoutState} role="alert">
        <h1>{t("workspace-load-failed")}</h1>
        <p>{loadError || t("workspace-load-error-message")}</p>
        <button type="button" onClick={retryLoadDemo}>
          {t("try-again")}
        </button>
      </div>
    );
  }

  if (isDemoSubscriptionExpired(demoData)) {
    return <ExpiredSubscriptionGate demoId={demoData.id} demoData={demoData} />;
  }

  const navLinks = DEMO_NAV[role.toLowerCase()]?.navLinks || [];
  const footerLinks = FOOTER_CONFIG[`demo_${role.toLowerCase()}`] || [];

  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div
        className={`${styles.mainWrapper} ${isGroupsPage ? "" : "custom-scrollbar"}`}
        style={
          isGroupsPage
            ? {
                overflow: "hidden",
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
        />
        <SubHeader navLinks={navLinks} />
        <main
          className={styles.pageContent}
          style={
            isGroupsPage
              ? {
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  padding: 0,
                }
              : {}
          }
        >
          <Outlet />
        </main>
        {!isGroupsPage && <Footer footerLinks={footerLinks} />}
      </div>
    </div>
  );
};

const DemoLayout = () => {
  return (
    <AuthSessionBoundary>
      <LayoutContent />
    </AuthSessionBoundary>
  );
};

export default DemoLayout;
