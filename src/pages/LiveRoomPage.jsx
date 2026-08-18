import LiveRoom from "../features/Demo/Lives/components/LiveRoom/LiveRoom";
import { useDemo } from "../hooks/useDemo";
import AuthSessionBoundary from "../components/common/AuthSessionBoundary";
import ExpiredSubscriptionGate from "../features/Demo/Subscription/components/ExpiredSubscriptionGate/ExpiredSubscriptionGate";
import { isDemoSubscriptionExpired } from "../features/Demo/Subscription/utils/demoSubscription";
import { useTranslation } from "react-i18next";
import styles from "../layouts/MainLayout/MainLayout.module.css";

const LiveRoomAccess = () => {
  const { t } = useTranslation();
  const { demoId, demoData, isLoading, loadError, retryLoadDemo } = useDemo();

  if (isLoading) {
    return (
      <div className={styles.layoutState} role="status" aria-live="polite">
        <span className={styles.loader} aria-hidden="true" />
        <h1>{t("loading-workspace")}</h1>
        <p>{t("loading-workspace-description")}</p>
      </div>
    );
  }

  if (loadError || !demoData) {
    return (
      <div className={styles.layoutState} role="alert">
        <h1>{t("workspace-load-failed")}</h1>
        <p>{t("workspace-load-error-message")}</p>
        <button type="button" onClick={retryLoadDemo}>
          {t("try-again")}
        </button>
      </div>
    );
  }

  if (isDemoSubscriptionExpired(demoData)) {
    return <ExpiredSubscriptionGate demoId={demoId} demoData={demoData} />;
  }

  return <LiveRoom />;
};

const LiveRoomPage = () => {
  return (
    <AuthSessionBoundary>
      <LiveRoomAccess />
    </AuthSessionBoundary>
  );
};

export default LiveRoomPage;
