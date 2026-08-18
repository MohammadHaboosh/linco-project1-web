import { useId } from "react";
import { IoWarningOutline, IoTimeOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import PlanUpgradeCard from "../../Subscription/components/PlanUpgradeCard/PlanUpgradeCard";
import { FreePlanWarningSkeleton } from "./OwnerHomeSkeletons";
import styles from "../OwnerHomeContent.module.css";

const FREE_PLAN_DURATION_DAYS = 14;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const getFreePlanTimeline = (createdAt) => {
  const createdAtTimestamp = Date.parse(createdAt);
  if (Number.isNaN(createdAtTimestamp)) return null;

  const now = Date.now();
  const expiresAtTimestamp =
    createdAtTimestamp + FREE_PLAN_DURATION_DAYS * MILLISECONDS_PER_DAY;

  return {
    daysElapsed: Math.min(
      FREE_PLAN_DURATION_DAYS,
      Math.max(
        0,
        Math.floor((now - createdAtTimestamp) / MILLISECONDS_PER_DAY),
      ),
    ),
    daysRemaining: Math.max(
      0,
      Math.ceil((expiresAtTimestamp - now) / MILLISECONDS_PER_DAY),
    ),
    isExpired: now >= expiresAtTimestamp,
  };
};

const FreePlanWarning = ({
  createdAt,
  numberFormatter,
  demoId,
  currentPlan,
  isLoading,
}) => {
  const { t } = useTranslation();
  const titleId = useId();

  if (isLoading) return <FreePlanWarningSkeleton />;

  const freePlanTimeline = getFreePlanTimeline(createdAt);
  const isExpired = freePlanTimeline?.isExpired ?? false;

  return (
    <section
      className={`${styles.freePlanWarning} ${
        isExpired ? styles.freePlanExpired : ""
      }`}
      role={isExpired ? "alert" : "status"}
      aria-labelledby={titleId}
    >
      <div className={styles.warningIcon} aria-hidden="true">
        <IoWarningOutline />
      </div>
      <div className={styles.warningContent}>
        <h2 id={titleId}>
          {isExpired
            ? t("free-plan-expired-title")
            : t("free-plan-warning-title")}
        </h2>
        <p>
          {isExpired
            ? t("free-plan-expired-description", {
                totalDays: numberFormatter.format(FREE_PLAN_DURATION_DAYS),
              })
            : freePlanTimeline
              ? t("free-plan-warning-description", {
                  count: freePlanTimeline.daysElapsed,
                  formattedCount: numberFormatter.format(
                    freePlanTimeline.daysElapsed,
                  ),
                  totalDays: numberFormatter.format(FREE_PLAN_DURATION_DAYS),
                })
              : t("free-plan-warning-generic-description", {
                  totalDays: numberFormatter.format(FREE_PLAN_DURATION_DAYS),
                })}
        </p>
      </div>

      <div className={styles.warningActions}>
        {freePlanTimeline && (
          <span className={styles.warningBadge}>
            <IoTimeOutline aria-hidden="true" />
            {isExpired
              ? t("free-plan-expired-badge")
              : t("free-plan-days-remaining", {
                  count: freePlanTimeline.daysRemaining,
                  formattedCount: numberFormatter.format(
                    freePlanTimeline.daysRemaining,
                  ),
                })}
          </span>
        )}
        <PlanUpgradeCard
          demoId={demoId}
          currentPlan={currentPlan}
          triggerOnly
          triggerClassName={styles.warningButton}
        />
      </div>
    </section>
  );
};

export default FreePlanWarning;
