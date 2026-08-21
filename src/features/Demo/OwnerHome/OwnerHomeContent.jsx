import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IoAlertCircleOutline } from "react-icons/io5";
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

  const { reportData, isLoading, error, refetch } = useOwnerReport(demoId);

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
      <div className={styles.pageContainer} dir={i18n.dir()}>
        <section className={styles.errorState} role="alert">
          <IoAlertCircleOutline
            className={styles.stateIcon}
            aria-hidden="true"
          />
          <h1>{t("analytics-report-load-failed")}</h1>
          <p>{error || t("analytics-report-load-error-message")}</p>
          <button
            type="button"
            className={styles.stateAction}
            onClick={refetch}
          >
            {t("try-again")}
          </button>
        </section>
      </div>
    );
  }

  return (
    <div
      className={styles.pageContainer}
      dir={i18n.dir()}
      aria-busy={isLoading}
    >
      {isLoading && (
        <p className={styles.srOnly} role="status" aria-live="polite">
          {t("analytics-report-loading")}
        </p>
      )}
      <WelcomeBanner workspaceName={workspaceName} isLoading={isLoading} />

      {isFreePlan && (
        <FreePlanWarning
          createdAt={demoData?.createdAt}
          numberFormatter={numberFormatter}
          demoId={demoId}
          currentPlan={currentPlan}
          isLoading={isLoading}
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
            isLoading={isLoading}
          />
        </div>

        <div className={styles.rightColumn}>
          <ReportMembersList
            members={reportData?.members}
            numberFormatter={numberFormatter}
            percentFormatter={percentFormatter}
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
