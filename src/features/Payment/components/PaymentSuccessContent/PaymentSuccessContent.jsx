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
  const { verificationState, payment, error, retry } =
    usePaymentStatus(sessionId);

  const demoId = payment?.metadata?.demoId;
  const demoPath = demoId
    ? `${PATHS.DEMO.replace(":demoId", encodeURIComponent(demoId))}/${
        PATHS.OWNER_HOME
      }`
    : PATHS.HOME;
  const formattedAmount = formatAmount(
    payment?.amountTotal,
    payment?.currency,
    i18n.language,
  );

  const isVerifying = verificationState === "verifying";
  const isSuccess = verificationState === "success";
  const isPending = verificationState === "pending";
  const isInvalid = verificationState === "invalid";

  return (
    <main className={styles.page}>
      <Link to={PATHS.HOME} className={styles.brand}>
        {t("linco-brand")}
      </Link>

      <section className={styles.statusCard} aria-live="polite">
        {isVerifying && (
          <>
            <div className={`${styles.statusIcon} ${styles.verifyingIcon}`}>
              <span className={styles.spinner} />
            </div>
            <span className={styles.eyebrow}>{t("payment-verification")}</span>
            <h1>{t("verifying-your-payment")}</h1>
            <p className={styles.description}>
              {t("keep-this-page-open-while-payment-is-verified")}
            </p>
          </>
        )}

        {isSuccess && (
          <>
            <div className={`${styles.statusIcon} ${styles.successIcon}`}>
              <IoCheckmarkCircle />
            </div>
            <span className={styles.eyebrow}>{t("payment-confirmed")}</span>
            <h1>{t("demo-upgrade-successful")}</h1>
            <p className={styles.description}>
              {t("subscription-payment-completed-description")}
            </p>

            <div className={styles.receipt}>
              {formattedAmount && (
                <div className={styles.receiptRow}>
                  <span>
                    <IoShieldCheckmarkOutline /> {t("amount-paid")}
                  </span>
                  <strong>{formattedAmount}</strong>
                </div>
              )}
              {payment?.customerEmail && (
                <div className={styles.receiptRow}>
                  <span>
                    <IoMailOutline /> {t("receipt-email")}
                  </span>
                  <strong>{payment.customerEmail}</strong>
                </div>
              )}
              <div className={styles.receiptRow}>
                <span>
                  <IoCheckmarkCircle /> {t("payment-status")}
                </span>
                <strong className={styles.paidStatus}>
                  {String(payment.paymentStatus || "paid").toUpperCase()}
                </strong>
              </div>
            </div>

            <Link to={demoPath} className={styles.primaryButton}>
              {demoId ? t("return-to-demo") : t("go-to-dashboard")}
              <IoArrowForwardOutline />
            </Link>
          </>
        )}

        {isPending && (
          <>
            <div className={`${styles.statusIcon} ${styles.pendingIcon}`}>
              <IoTimeOutline />
            </div>
            <span className={styles.eyebrow}>{t("payment-processing")}</span>
            <h1>{t("payment-is-still-processing")}</h1>
            <p className={styles.description}>
              {t("payment-processing-description")}
            </p>
            <button type="button" className={styles.primaryButton} onClick={retry}>
              <IoRefreshOutline /> {t("check-again")}
            </button>
          </>
        )}

        {isInvalid && (
          <>
            <div className={`${styles.statusIcon} ${styles.errorIcon}`}>
              <IoWarningOutline />
            </div>
            <span className={styles.eyebrow}>{t("invalid-payment-link")}</span>
            <h1>{t("checkout-session-is-missing")}</h1>
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
            <div className={`${styles.statusIcon} ${styles.errorIcon}`}>
              <IoCloseCircleOutline />
            </div>
            <span className={styles.eyebrow}>{t("verification-failed")}</span>
            <h1>{t("could-not-verify-payment")}</h1>
            <p className={styles.description}>
              {error || t("payment-verification-error-description")}
            </p>
            <div className={styles.actionRow}>
              <button type="button" className={styles.primaryButton} onClick={retry}>
                <IoRefreshOutline /> {t("try-again")}
              </button>
              <Link to={PATHS.HOME} className={styles.secondaryButton}>
                {t("go-to-dashboard")}
              </Link>
            </div>
          </>
        )}
      </section>

      <p className={styles.secureNote}>
        <IoShieldCheckmarkOutline /> {t("payment-secured-by-stripe")}
      </p>
    </main>
  );
};

export default PaymentSuccessContent;
