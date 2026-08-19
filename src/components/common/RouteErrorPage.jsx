import { useTranslation } from "react-i18next";
import styles from "./RouteErrorPage.module.css";

const RouteErrorPage = () => {
  const { t } = useTranslation();
  const isOffline =
    typeof navigator !== "undefined" && navigator.onLine === false;

  return (
    <main className={styles.page}>
      <section className={styles.card} role="alert">
        <img
          className={styles.logo}
          src="/icons/linco-logo-96.webp"
          alt="LinCo"
        />
        <p className={styles.eyebrow}>{t("route-error-eyebrow")}</p>
        <h1>{t("route-error-title")}</h1>
        <p className={styles.message}>
          {isOffline
            ? t("route-error-network-message")
            : t("route-error-message")}
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={() => window.location.reload()}>
            {t("reload-page")}
          </button>
          <a href="/">{t("go-to-home")}</a>
        </div>
      </section>
    </main>
  );
};

export default RouteErrorPage;
