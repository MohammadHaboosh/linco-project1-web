import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IoArrowForwardOutline,
  IoCloseOutline,
  IoHomeOutline,
  IoSettingsOutline,
  IoTrendingUp,
  IoPeopleOutline,
  IoLayersOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PATHS } from "../../../../../routes/paths";
import { useDemoPlanCheckout } from "../../hooks/useDemoPlanCheckout";
import { useDemoSubscriptionPortal } from "../../hooks/useDemoSubscriptionPortal";
import styles from "./PlanUpgradeCard.module.css";

const PLAN_ORDER = ["FREE", "STARTER", "PRO", "ENTERPRISE"];

const normalizePlan = (plan) => {
  const normalizedPlan = String(plan || "FREE")
    .trim()
    .toUpperCase();
  return PLAN_ORDER.includes(normalizedPlan) ? normalizedPlan : "FREE";
};

const PlanUpgradeCard = ({
  demoId,
  currentPlan,
  accessGate = false,
  workspaceName = "",
  triggerOnly = false,
  triggerClassName,
}) => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activePlan = normalizePlan(currentPlan);
  const {
    checkoutPlan,
    checkoutError,
    isStartingCheckout,
    startCheckout,
    clearCheckoutError,
  } = useDemoPlanCheckout(demoId);
  const { isOpeningPortal, portalError, openSubscriptionPortal } =
    useDemoSubscriptionPortal(demoId);
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
        limits: { members: 5, departmentsAndGroups: 2 },
      },
      {
        id: "PRO",
        price: 100,
        description: t("pro-plan-description"),
        featured: true,
        limits: { members: 25, departmentsAndGroups: 10 },
      },
      {
        id: "ENTERPRISE",
        price: 200,
        description: t("enterprise-plan-description"),
        limits: { members: 100, departmentsAndGroups: 50 },
      },
    ],
    [t],
  );

  const isPaidPlan = activePlan !== "FREE";

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
      {!accessGate && triggerOnly && !isPaidPlan && (
        <button
          type="button"
          className={triggerClassName || styles.upgradeButton}
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
              {isPaidPlan
                ? t("manage-subscription-summary")
                : t("upgrade-plan-summary")}
            </p>
          </div>

          <div className={styles.planActions}>
            {isPaidPlan ? (
              <button
                type="button"
                className={styles.manageButton}
                onClick={openSubscriptionPortal}
                disabled={!demoId || isOpeningPortal}
              >
                <IoSettingsOutline aria-hidden="true" />
                {isOpeningPortal
                  ? t("opening-subscription-portal")
                  : t("manage-subscription")}
              </button>
            ) : (
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
            {portalError && (
              <div className={styles.actionError} role="alert">
                {portalError}
              </div>
            )}
          </div>
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
                    ? isPaidPlan
                      ? t("expired-subscription-manage-note", {
                          workspaceName,
                        })
                      : t("expired-subscription-checkout-note", {
                          workspaceName,
                        })
                    : t("checkout-redirect-note")}
                </p>
              </div>
              {accessGate ? (
                <Link to={PATHS.HOME} className={styles.homeButton}>
                  <IoHomeOutline aria-hidden="true" />
                  {t("go-to-home")}
                </Link>
              ) : (
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

            {accessGate && isPaidPlan ? (
              <div className={styles.portalAction}>
                <button
                  type="button"
                  className={styles.manageButton}
                  onClick={openSubscriptionPortal}
                  disabled={!demoId || isOpeningPortal}
                >
                  <IoSettingsOutline aria-hidden="true" />
                  {isOpeningPortal
                    ? t("opening-subscription-portal")
                    : t("manage-subscription")}
                </button>
              </div>
            ) : (
              <div className={styles.planGrid}>
                {plans.map((plan) => {
                  const isSelected = checkoutPlan === plan.id;

                  return (
                    <article
                      key={plan.id}
                      className={`${styles.optionCard} ${
                        plan.featured ? styles.featuredPlan : ""
                      }`}
                    >
                      {plan.featured && (
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

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          margin: "18px 0",
                          padding: "12px 0",
                          borderTop: "1px solid var(--app-border, #e2e8f0)",
                          borderBottom: "1px solid var(--app-border, #e2e8f0)",
                          fontSize: "0.85rem",
                          color: "var(--app-muted, #64748b)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <IoPeopleOutline
                            size={18}
                            style={{ color: "var(--app-link, #3b82f6)" }}
                          />
                          <span>
                            <strong>{plan.limits.members}</strong>{" "}
                            {t("plan-members-limit")}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <IoLayersOutline
                            size={18}
                            style={{ color: "var(--app-link, #3b82f6)" }}
                          />
                          <span>
                            <strong>{plan.limits.departmentsAndGroups}</strong>{" "}
                            {t(
                              "plan-departments-groups-limit",
                              "Departments & Groups",
                            )}
                          </span>
                        </div>
                      </div>

                      <p>{plan.description}</p>

                      <button
                        type="button"
                        className={styles.selectPlanButton}
                        onClick={() => startCheckout(plan.id)}
                        disabled={isStartingCheckout}
                        style={{ marginTop: "auto" }}
                      >
                        {isSelected
                          ? t("preparing-checkout")
                          : t("choose-plan")}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}

            {(checkoutError || portalError) && (
              <div className={styles.checkoutError} role="alert">
                {checkoutError || portalError}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default PlanUpgradeCard;
