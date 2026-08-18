import { useEffect, useMemo } from "react";
import {
  IoArrowForwardOutline,
  IoCheckmarkCircle,
  IoCloseCircleOutline,
  IoMailOutline,
  IoRefreshOutline,
  IoShieldCheckmarkOutline,
  IoTimeOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { PATHS } from "../../../../routes/paths";
import { usePaymentStatus } from "../../hooks/usePaymentStatus";
import {
  clearCourseCheckoutContext,
  getCourseCheckoutContext,
} from "../../utils/courseCheckoutContext";
import styles from "./PaymentSuccessContent.module.css";

const formatAmount = (amountTotal, currency, language) => {
  const amount = Number(amountTotal);
  if (!Number.isFinite(amount)) return "";

  try {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency: String(currency || "usd").toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount} ${String(currency || "usd").toUpperCase()}`;
  }
};

const PaymentSuccessContent = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id")?.trim() || "";
  const { verificationState, payment, retry } = usePaymentStatus(sessionId);
  const language = i18n.resolvedLanguage || i18n.language || "en";

  const demoId = String(payment?.metadata?.demoId || "").trim();
  const courseId = String(payment?.metadata?.courseId || "").trim();
  const paymentKind = courseId ? "course" : demoId ? "workspace" : "payment";
  const courseCheckoutContext = useMemo(
    () => getCourseCheckoutContext(courseId),
    [courseId],
  );
  const workspacePath = demoId
    ? `${PATHS.DEMO.replace(":demoId", encodeURIComponent(demoId))}/${
        PATHS.OWNER_HOME
      }`
    : PATHS.HOME;
  const courseWorkspaceId = courseCheckoutContext?.demoId;
  const courseWorkspaceBasePath = courseWorkspaceId
    ? PATHS.DEMO.replace(
        ":demoId",
        encodeURIComponent(courseWorkspaceId),
      )
    : "";
  const workspaceCoursesPath = courseWorkspaceBasePath
    ? `${courseWorkspaceBasePath}/${PATHS.OWNER_COURSES}`
    : PATHS.HOME;
  const publicLibraryPath = courseWorkspaceBasePath
    ? `${courseWorkspaceBasePath}/${PATHS.OWNER_LIBRARY}`
    : "";
  const formattedAmount = formatAmount(
    payment?.amountTotal,
    payment?.currency,
    language,
  );

  const isVerifying = verificationState === "verifying";
  const isSuccess = verificationState === "success";
  const isPending = verificationState === "pending";
  const isInvalid = verificationState === "invalid";

  useEffect(() => {
    if (isSuccess && courseId && courseCheckoutContext) {
      clearCourseCheckoutContext(courseId);
    }
  }, [courseCheckoutContext, courseId, isSuccess]);

  const successEyebrow =
    paymentKind === "course"
      ? t("course-purchase-confirmed")
      : t("payment-confirmed");
  const successTitle =
    paymentKind === "course"
      ? t("course-purchase-successful")
      : paymentKind === "workspace"
        ? t("workspace-upgrade-successful")
        : t("payment-completed-successfully");
  const successDescription =
    paymentKind === "course"
      ? t("course-purchase-completed-description")
      : paymentKind === "workspace"
        ? t("subscription-payment-completed-description")
        : t("payment-completed-description");

  return (
    <main className={styles.page}>
      <Link
        to={PATHS.HOME}
        className={styles.brand}
        aria-label={t("go-to-linco-dashboard")}
      >
        {t("linco-brand")}
      </Link>

      <section
        className={styles.statusCard}
        role={verificationState === "error" || isInvalid ? "alert" : "status"}
        aria-live={
          verificationState === "error" || isInvalid ? "assertive" : "polite"
        }
        aria-busy={isVerifying}
        aria-labelledby="payment-status-heading"
      >
        {isVerifying && (
          <>
            <div
              className={`${styles.statusIcon} ${styles.verifyingIcon}`}
              aria-hidden="true"
            >
              <span className={styles.spinner} />
            </div>
            <span className={styles.eyebrow}>{t("payment-verification")}</span>
            <h1 id="payment-status-heading">{t("verifying-your-payment")}</h1>
            <p className={styles.description}>
              {t("keep-this-page-open-while-payment-is-verified")}
            </p>
          </>
        )}

        {isSuccess && (
          <>
            <div
              className={`${styles.statusIcon} ${styles.successIcon}`}
              aria-hidden="true"
            >
              <IoCheckmarkCircle />
            </div>
            <span className={styles.eyebrow}>{successEyebrow}</span>
            <h1 id="payment-status-heading">{successTitle}</h1>
            <p className={styles.description}>{successDescription}</p>

            <div className={styles.receipt}>
              {formattedAmount && (
                <div className={styles.receiptRow}>
                  <span>
                    <IoShieldCheckmarkOutline aria-hidden="true" />
                    {t("amount-paid")}
                  </span>
                  <strong>
                    <bdi>{formattedAmount}</bdi>
                  </strong>
                </div>
              )}
              {payment?.customerEmail && (
                <div className={styles.receiptRow}>
                  <span>
                    <IoMailOutline aria-hidden="true" />
                    {t("receipt-email")}
                  </span>
                  <strong>
                    <bdi>{payment.customerEmail}</bdi>
                  </strong>
                </div>
              )}
              <div className={styles.receiptRow}>
                <span>
                  <IoCheckmarkCircle aria-hidden="true" />
                  {t("payment-status")}
                </span>
                <strong className={styles.paidStatus}>
                  {t("payment-status-paid")}
                </strong>
              </div>
            </div>

            {paymentKind === "course" ? (
              <div className={styles.successActions}>
                <Link
                  to={workspaceCoursesPath}
                  className={styles.primaryButton}
                >
                  {courseWorkspaceId
                    ? t("go-to-workspace-courses")
                    : t("go-to-dashboard")}
                  <IoArrowForwardOutline
                    className={styles.directionalIcon}
                    aria-hidden="true"
                  />
                </Link>
                {publicLibraryPath && (
                  <Link
                    to={publicLibraryPath}
                    className={styles.secondaryButton}
                  >
                    {t("return-to-public-library")}
                  </Link>
                )}
              </div>
            ) : (
              <Link to={workspacePath} className={styles.primaryButton}>
                {paymentKind === "workspace"
                  ? t("return-to-workspace")
                  : t("go-to-dashboard")}
                <IoArrowForwardOutline
                  className={styles.directionalIcon}
                  aria-hidden="true"
                />
              </Link>
            )}
          </>
        )}

        {isPending && (
          <>
            <div
              className={`${styles.statusIcon} ${styles.pendingIcon}`}
              aria-hidden="true"
            >
              <IoTimeOutline />
            </div>
            <span className={styles.eyebrow}>{t("payment-processing")}</span>
            <h1 id="payment-status-heading">
              {t("payment-is-still-processing")}
            </h1>
            <p className={styles.description}>
              {t("payment-processing-description")}
            </p>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={retry}
            >
              <IoRefreshOutline aria-hidden="true" /> {t("check-again")}
            </button>
          </>
        )}

        {isInvalid && (
          <>
            <div
              className={`${styles.statusIcon} ${styles.errorIcon}`}
              aria-hidden="true"
            >
              <IoWarningOutline />
            </div>
            <span className={styles.eyebrow}>{t("invalid-payment-link")}</span>
            <h1 id="payment-status-heading">
              {t("checkout-session-is-missing")}
            </h1>
            <p className={styles.description}>
              {t("open-payment-page-from-stripe-redirect")}
            </p>
            <Link to={PATHS.HOME} className={styles.secondaryButton}>
              {t("go-to-dashboard")}
            </Link>
          </>
        )}

        {verificationState === "error" && (
          <>
            <div
              className={`${styles.statusIcon} ${styles.errorIcon}`}
              aria-hidden="true"
            >
              <IoCloseCircleOutline />
            </div>
            <span className={styles.eyebrow}>{t("verification-failed")}</span>
            <h1 id="payment-status-heading">
              {t("could-not-verify-payment")}
            </h1>
            <p className={styles.description}>
              {t("payment-verification-error-description")}
            </p>
            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={retry}
              >
                <IoRefreshOutline aria-hidden="true" /> {t("try-again")}
              </button>
              <Link to={PATHS.HOME} className={styles.secondaryButton}>
                {t("go-to-dashboard")}
              </Link>
            </div>
          </>
        )}
      </section>

      <p className={styles.secureNote}>
        <IoShieldCheckmarkOutline aria-hidden="true" />
        {t("payment-secured-by-stripe")}
      </p>
    </main>
  );
};

export default PaymentSuccessContent;
