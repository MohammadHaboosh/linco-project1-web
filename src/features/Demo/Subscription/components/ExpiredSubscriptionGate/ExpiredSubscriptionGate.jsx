import { useTranslation } from "react-i18next";
import PlanUpgradeCard from "../PlanUpgradeCard/PlanUpgradeCard";
import styles from "./ExpiredSubscriptionGate.module.css";

const getCurrentPlan = (demoData) =>
  demoData?.plan ||
  demoData?.subscription?.plan ||
  demoData?.subscriptionPlan ||
  demoData?.tier ||
  "FREE";

const ExpiredSubscriptionGate = ({ demoId, demoData }) => {
  const { t, i18n } = useTranslation();
  const workspaceName = demoData?.name || t("your-workspace");

  return (
    <main className={styles.gate} dir={i18n.dir()}>
      <div className={styles.preview} aria-hidden="true">
        <div className={styles.previewSidebar}>
          <span className={styles.previewLogo} />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className={styles.previewMain}>
          <div className={styles.previewHeader} />
          <div className={styles.previewBanner} />
          <div className={styles.previewCards}>
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className={styles.previewContent}>
            <span />
            <span />
          </div>
        </div>
      </div>

      <PlanUpgradeCard
        demoId={demoId}
        currentPlan={getCurrentPlan(demoData)}
        workspaceName={workspaceName}
        accessGate
      />
    </main>
  );
};

export default ExpiredSubscriptionGate;
