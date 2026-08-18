import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IoArrowForwardOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoTrendingUp,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useDemoPlanCheckout } from "../../hooks/useDemoPlanCheckout";
import styles from "./PlanUpgradeCard.module.css";

const PLAN_ORDER = ["FREE", "STARTER", "PRO", "ENTERPRISE"];

const normalizePlan = (plan) => {
  const normalizedPlan = String(plan || "FREE").trim().toUpperCase();
  return PLAN_ORDER.includes(normalizedPlan) ? normalizedPlan : "FREE";
};

const PlanUpgradeCard = ({
  demoId,
  currentPlan,
  accessGate = false,
  workspaceName = "",
  triggerOnly = false,
  triggerLabel,
  triggerClassName,
  triggerAriaLabel,
}) => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activePlan = normalizePlan(currentPlan);
  const activePlanIndex = PLAN_ORDER.indexOf(activePlan);
  const {
    checkoutPlan,
    checkoutError,
    isStartingCheckout,
    startCheckout,
    clearCheckoutError,
  } = useDemoPlanCheckout(demoId);
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const plans = useMemo(
    () => [
      {
        id: "STARTER",
        price: 20,
        description: t("starter-plan-description"),
      },
      {
        id: "PRO",
        price: 100,
        description: t("pro-plan-description"),
        featured: true,
      },
      {
        id: "ENTERPRISE",
        price: 200,
        description: t("enterprise-plan-description"),
      },
    ],
    [t],
  );

  const hasUpgrade = activePlan !== "ENTERPRISE";

  const closeModal = useCallback(() => {
    if (isStartingCheckout) return;
    clearCheckoutError();
    setIsModalOpen(false);
  }, [clearCheckoutError, isStartingCheckout]);

  useEffect(() => {
    if (!isModalOpen || accessGate) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [accessGate, closeModal, isModalOpen]);

  const isPlanPanelOpen = accessGate || isModalOpen;
  const openModal = () => {
    clearCheckoutError();
    setIsModalOpen(true);
  };

  return (
    <>
      {!accessGate && triggerOnly && hasUpgrade && (
        <button
          type="button"
          className={triggerClassName || styles.upgradeButton}
          onClick={openModal}
          disabled={!demoId}
          aria-label={triggerAriaLabel}
        >
          {triggerLabel || t("upgrade-plan")}
          <IoArrowForwardOutline
            className={styles.forwardIcon}
            aria-hidden="true"
          />
        </button>
      )}

      {!accessGate && !triggerOnly && (
        <section className={styles.planCard} aria-labelledby="demo-plan-title">
          <div className={styles.planIcon} aria-hidden="true">
            <IoTrendingUp />
          </div>

          <div className={styles.planSummary}>
            <span className={styles.eyebrow}>{t("demo-subscription")}</span>
            <div className={styles.planHeading}>
              <h2 id="demo-plan-title">{t("current-plan")}</h2>
              <span className={styles.currentPlanBadge}>
                {t(`plan-${activePlan.toLowerCase()}`)}
              </span>
            </div>
            <p>
              {hasUpgrade
                ? t("upgrade-plan-summary")
                : t("enterprise-plan-active-summary")}
            </p>
          </div>

          {hasUpgrade && (
            <button
              type="button"
              className={styles.upgradeButton}
              onClick={openModal}
              disabled={!demoId}
            >
              {t("upgrade-plan")}
              <IoArrowForwardOutline
                className={styles.forwardIcon}
                aria-hidden="true"
              />
            </button>
          )}
        </section>
      )}

      {isPlanPanelOpen && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(event) => {
            if (!accessGate && event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-plan-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.eyebrow}>
                  {accessGate
                    ? t("subscription-expired")
                    : t("demo-subscription")}
                </span>
                <h2 id="upgrade-plan-title">
                  {accessGate
                    ? t("restore-workspace-access")
                    : t("choose-your-plan")}
                </h2>
                <p>
                  {accessGate
                    ? hasUpgrade
                      ? t("expired-subscription-checkout-note", {
                          workspaceName,
                        })
                      : t("expired-enterprise-plan-summary", {
                          workspaceName,
                        })
                    : t("checkout-redirect-note")}
                </p>
              </div>
              {!accessGate && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={closeModal}
                  disabled={isStartingCheckout}
                  aria-label={t("close")}
                >
                  <IoCloseOutline />
                </button>
              )}
            </div>

            <div className={styles.planGrid}>
              {plans.map((plan) => {
                const planIndex = PLAN_ORDER.indexOf(plan.id);
                const isCurrent = plan.id === activePlan;
                const isLowerTier = planIndex < activePlanIndex;
                const canSelect = !isCurrent && !isLowerTier;
                const isSelected = checkoutPlan === plan.id;

                return (
                  <article
                    key={plan.id}
                    className={`${styles.optionCard} ${
                      plan.featured ? styles.featuredPlan : ""
                    } ${isCurrent ? styles.activePlan : ""}`}
                  >
                    {plan.featured && !isCurrent && (
                      <span className={styles.popularBadge}>
                        {t("recommended")}
                      </span>
                    )}
                    <div className={styles.optionHeader}>
                      <span className={styles.planMark} aria-hidden="true">
                        {t(`plan-${plan.id.toLowerCase()}`).charAt(0)}
                      </span>
                      <h3>{t(`plan-${plan.id.toLowerCase()}`)}</h3>
                    </div>
                    <div className={styles.planPrice}>
                      {currencyFormatter.format(plan.price)}
                    </div>
                    <p>{plan.description}</p>
                    <button
                      type="button"
                      className={styles.selectPlanButton}
                      onClick={() => startCheckout(plan.id)}
                      disabled={!canSelect || isStartingCheckout}
                    >
                      {isCurrent ? (
                        <>
                          <IoCheckmarkOutline /> {t("current-plan")}
                        </>
                      ) : isLowerTier ? (
                        t("lower-tier")
                      ) : isSelected ? (
                        t("preparing-checkout")
                      ) : (
                        t("choose-plan")
                      )}
                    </button>
                  </article>
                );
              })}
            </div>

            {checkoutError && (
              <div className={styles.checkoutError} role="alert">
                {checkoutError}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default PlanUpgradeCard;
