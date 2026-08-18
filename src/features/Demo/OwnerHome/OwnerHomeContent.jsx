import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDemo } from "../../../hooks/useDemo";
import { useOwnerReport } from "./hooks/useOwnerReport";
import PlanUpgradeCard from "../Subscription/components/PlanUpgradeCard/PlanUpgradeCard";
import WelcomeBanner from "./components/WelcomeBanner";
import FreePlanWarning from "./components/FreePlanWarning";
import StatsOverview from "./components/StatsOverview";
import TopDepartments from "./components/TopDepartments";
import ReportMembersList from "./components/ReportMembersList";
import ReportCoursesTable from "./components/ReportCoursesTable";
import styles from "./OwnerHomeContent.module.css";

const OwnerHomeContent = () => {
  const { t, i18n } = useTranslation();
  const { demoId, demoData } = useDemo();
  const locale = i18n.resolvedLanguage || i18n.language || "en";

  const { reportData, isLoading, error } = useOwnerReport(demoId);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale],
  );
  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 1,
      }),
    [locale],
  );

  const workspaceName = demoData?.name || t("your-workspace");
  const currentPlan =
    demoData?.plan ||
    demoData?.subscription?.plan ||
    demoData?.subscriptionPlan ||
    demoData?.tier ||
    "FREE";
  const isFreePlan = String(currentPlan).trim().toUpperCase() === "FREE";

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorState}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer} dir={i18n.dir()}>
      <WelcomeBanner workspaceName={workspaceName} />

      {isFreePlan && (
        <FreePlanWarning
          createdAt={demoData?.createdAt}
          numberFormatter={numberFormatter}
          demoId={demoId}
          currentPlan={currentPlan}
        />
      )}

      {!isFreePlan && (
        <PlanUpgradeCard demoId={demoId} currentPlan={currentPlan} />
      )}

      <StatsOverview
        overview={reportData?.overview}
        numberFormatter={numberFormatter}
        percentFormatter={percentFormatter}
        isLoading={isLoading}
      />

      <div className={styles.mainLayout}>
        <div className={styles.leftColumn}>
          <TopDepartments
            departments={reportData?.departments}
            numberFormatter={numberFormatter}
            percentFormatter={percentFormatter}
            isLoading={isLoading}
          />
        </div>

        <div className={styles.rightColumn}>
          <ReportMembersList
            members={reportData?.members}
            numberFormatter={numberFormatter}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className={styles.fullWidthSection}>
        <ReportCoursesTable
          courses={reportData?.courses}
          numberFormatter={numberFormatter}
          percentFormatter={percentFormatter}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default OwnerHomeContent;
